import {PackageRoot, ProjectSettings, Schemes, VocabularyElements} from "../config/Variables";
import {graphElement} from '../graph/graphElement';
import {fetchConcepts, getScheme} from "./SPARQLInterface";
import {PackageNode} from "../datatypes/PackageNode";
import * as Locale from "../locale/LocaleMain.json";
import {addClass, addElemsToPackage} from "../function/FunctionCreateVars";
import {parsePrefix} from "../function/FunctionEditVars";

export async function testContext(contextIRI: string, contextEndpoint: string) {
    let vocabularyQ = [
        "PREFIX ex: <http://example.org/>",
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
        "select ?vocab ?label ?vocabIRI where {",
        "BIND(<" + contextIRI + "> as ?contextIRI) .",
        "?contextIRI rdfs:label ?label;",
        "<https://slovník.gov.cz/datový/pracovní-prostor/pojem/odkazuje-na-kontext> ?vocab.",
        "?vocab a ?vocabType.",
        "VALUES ?vocabType {",
        "<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext>",
        "<https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení>",
        "}",
        "?vocab <https://slovník.gov.cz/datový/pracovní-prostor/pojem/obsahuje-slovník> ?vocabIRI .",
        "?vocabIRI owl:imports ?import .",
        "?import a skos:ConceptScheme .",
        "}",
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
            if (!(result.labels.includes(res.label.value))) result.labels.push(res.label.value);
            if (!(result.imports.includes(res.vocabIRI.value))) result.imports.push(res.vocabIRI.value);
        });
        return result;
    }
}

export async function getContext(
    contextIRI: string,
    contextEndpoint: string,
    acceptType: string,
    callback?: (message: string) => any) {
    if (callback) callback(Locale.loadingTerms);
    //get vocabularies
    let vocabularyQ = [
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
        "select ?vocab (bound(?ro) as ?readOnly) ?labelVocab ?label ?vocabIRI ?import ?importType",
        "where {",
        "BIND(<" + contextIRI + "> as ?contextIRI) .",
        "?contextIRI rdfs:label ?label;",
        "<https://slovník.gov.cz/datový/pracovní-prostor/pojem/odkazuje-na-kontext> ?vocab.",
        "?vocab a ?vocabType .",
        "VALUES ?vocabType { <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext> <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení> }",
        "?vocab <https://slovník.gov.cz/datový/pracovní-prostor/pojem/obsahuje-slovník> ?vocabIRI .",
        "?vocabIRI owl:imports ?import .",
        "?import a ?importType .",
        "?import rdfs:label ?labelVocab.",
        "OPTIONAL{ ?vocab a  ?ro . FILTER(?ro = <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext-pouze-pro-čtení>) .  }",
        "}",
    ].join(" ");
    let vocabularyQurl = contextEndpoint + "?query=" + encodeURIComponent(vocabularyQ);
    let responseInit: { [key: string]: any }[] = await fetch(vocabularyQurl,
        {headers: {'Accept': acceptType}})
        .then((response) => response.json())
        .then((data) => {
            return data.results.bindings;
        }).catch(() => {
            if (callback) callback(Locale.loadingError)
        });
    let vocabularies: { [key: string]: { names: { [key: string]: string }, readOnly: boolean, terms: any } } = {};
    let vsgov = "https://slovník.gov.cz/veřejný-sektor/glosář";
    if (responseInit) for (const result of responseInit) {
        if (result.importType.value === parsePrefix("skos", "ConceptScheme")) {
            if (!(result.import.value in vocabularies)) {
                vocabularies[result.import.value] = {readOnly: result.readOnly.value === "true", names: {}, terms: {}};
            }
            vocabularies[result.import.value].names[result.labelVocab["xml:lang"]] = result.labelVocab.value;
            ProjectSettings.name[result.label["xml:lang"]] = result.label.value;
        } else if (result.importType.value === parsePrefix("v-sgov-pojem", "glosář") && !(vsgov in Schemes)) {
            await getScheme(vsgov, "https://slovník.gov.cz/sparql", true);
            await fetchConcepts("https://slovník.gov.cz/sparql", vsgov, VocabularyElements, true);
            addElemsToPackage(vsgov);
        }
    }
    //load terms
    for (let vocab in vocabularies) {
        if (!(vocab in Schemes)) await getScheme(vocab, contextEndpoint, vocabularies[vocab].readOnly, function () {
        });
        await fetchConcepts(contextEndpoint, vocab, vocabularies[vocab].terms, vocabularies[vocab].readOnly);
        //put into packages
        Object.assign(VocabularyElements, vocabularies[vocab].terms);
        let pkg = new PackageNode(Schemes[vocab].labels, PackageRoot, false, vocab);
        for (let elem in vocabularies[vocab].terms) {
            let id = new graphElement().id;
            if (typeof id === "string") {
                addClass(id, elem, pkg, false, !vocabularies[vocab].readOnly);
            }
        }
    }
}