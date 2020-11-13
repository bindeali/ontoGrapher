import {PackageRoot, ProjectSettings, Schemes, VocabularyElements} from "../config/Variables";
import {graphElement} from '../graph/GraphElement';
import {fetchConcepts, getScheme} from "./SPARQLInterface";
import {PackageNode} from "../datatypes/PackageNode";
import {addClass} from "../function/FunctionCreateVars";

export async function testContext(contextIRI: string, contextEndpoint: string) {
	let vocabularyQ = [
		"PREFIX ex: <http://example.org/>",
		"PREFIX owl: <http://www.w3.org/2002/07/owl#>",
		"PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
		"select ?vocab ?label where {",
		"BIND(<" + contextIRI + "> as ?contextIRI) .",
		"OPTIONAL {?contextIRI rdfs:label ?label.}",
		"graph ?contextIRI {",
		"?vocab a ?vocabType .",
		"VALUES ?vocabType {",
		"<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext>",
		"<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkovy-kontext>",
		"<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení>",
		"}}",
		"}"
	].join(" ");
	//keep this .log
	console.log(vocabularyQ);
	let result: { labels: string[], imports: string[], error: any } = {labels: [], imports: [], error: undefined};
	let vocabularyQurl = contextEndpoint + "?query=" + encodeURIComponent(vocabularyQ);
	let response: {}[] = await fetch(vocabularyQurl,
		{headers: {'Accept': 'application/json'}})
		.then((response) => response.json())
		.then((data) => {
			return data.results.bindings;
		}).catch((error) => {
			console.log(error);
			result.error = error;
		});
	if (result.error) return result;
	else {
		response.forEach((res: { [key: string]: any }) => {
			if (res.label && !(result.labels.includes(res.label.value))) result.labels.push(res.label.value);
			if (!(result.imports.includes(res.vocab.value))) result.imports.push(res.vocab.value);
		});
		return result;
	}
}

export async function getContext(
	contextIRI: string,
	contextEndpoint: string,
	acceptType: string): Promise<boolean> {
	//get vocabularies
	let vocabularyQ = [
		"PREFIX owl: <http://www.w3.org/2002/07/owl#> ",
		"PREFIX skos: <http://www.w3.org/2004/02/skos/core#> ",
		"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ",
		"PREFIX termit: <http://onto.fel.cvut.cz/ontologies/application/termit/>",
		"PREFIX a-popis-dat: <http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/>",
		"PREFIX dcterms: <http://purl.org/dc/terms/>",
		"select ?vocab (bound(?ro) as ?readOnly) ?label ?title ?vocabLabel",
		"?vocabIRI",
		"where {",
		"BIND(<" + contextIRI + "> as ?contextIRI) . ",
		"OPTIONAL {?contextIRI rdfs:label ?label. }",
		"OPTIONAL {?contextIRI dcterms:title ?title. }",
		"graph ?contextIRI {",
		"?vocab a ?vocabType .",
		"VALUES ?vocabType {",
		"<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext> ",
		"<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení> ",
		"} }",
		"graph ?vocab {",
		"?vocabIRI a <http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář> .",
		"?vocabIRI dcterms:title ?vocabLabel .",
		"}",
		"OPTIONAL{ ?vocab a  ?ro . FILTER(?ro = <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení>) .  } ",
		"}",
	].join(" ");
	let vocabularyQurl = contextEndpoint + "?query=" + encodeURIComponent(vocabularyQ);
	let responseInit: { [key: string]: any }[] = await fetch(vocabularyQurl,
		{headers: {'Accept': acceptType}})
		.then((response) => response.json())
		.then((data) => {
			return data.results.bindings;
		}).catch(() => false);
	let vocabularies: { [key: string]: { names: { [key: string]: string }, readOnly: boolean, terms: any, graph: string } } = {};
	if (responseInit) for (const result of responseInit) {
		if (!(result.vocabIRI.value in vocabularies)) {
			vocabularies[result.vocabIRI.value] = {
				readOnly: result.readOnly.value === "true",
				names: {},
				terms: {},
				graph: result.vocab.value
			};
		}
		vocabularies[result.vocabIRI.value].names[result.vocabLabel["xml:lang"]] = result.vocabLabel.value;
		if (result.label) ProjectSettings.name[result.label["xml:lang"]] = result.label.value;
		if (result.title) ProjectSettings.name[result.title["xml:lang"]] = result.title.value;
	}
	//load terms
	for (let vocab in vocabularies) {
		await getScheme(vocab, contextEndpoint, vocabularies[vocab].readOnly, vocabularies[vocab].graph).catch(() => false);
		await fetchConcepts(contextEndpoint, vocab, vocabularies[vocab].terms, vocabularies[vocab].readOnly, Schemes[vocab].graph).catch(() => false);
		//put into packages
		Object.assign(VocabularyElements, vocabularies[vocab].terms);
		let pkg = new PackageNode(Schemes[vocab].labels, PackageRoot, false, vocab);
		for (let elem in vocabularies[vocab].terms) {
			let id = new graphElement().id;
			if (typeof id === "string") {
				addClass(id, elem, pkg);
			}
		}
	}
	return true;
}