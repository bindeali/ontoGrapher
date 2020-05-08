import {Schemes, VocabularyElements} from "../config/Variables";
import {initLanguageObject} from "../function/FunctionEditVars";

export async function fetchConcepts(
    endpoint: string,
    source: string,
    sendTo: { [key: string]: any },
    readOnly: boolean,
    callback?: Function,
    subclassOf?: string,
    requiredTypes?: string[],
    requiredValues?: string[]) {
    if (!(source in Schemes)) await getScheme(source, endpoint, readOnly, callback);

    let result: {
        [key: string]: {
            labels: { [key: string]: string },
            definitions: { [key: string]: string },
            types: string[],
            inScheme: string,
            domainOf: []
        }
    } = {};

    let query = [
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
        "SELECT DISTINCT ?term ?termLabel ?termType ?termDefinition",
        "WHERE {",
        !subclassOf ? "?term skos:inScheme <" + source + ">." : "",
        "?term a ?termType.",
        subclassOf ? "?term rdfs:subPropertyOf <" + subclassOf + ">." : "",
        requiredTypes ? "VALUES ?termType {<" + requiredTypes.join("> <") + ">}" : "",
        requiredValues ? "VALUES ?term {<" + requiredValues.join("> <") + ">}" : "",
        "OPTIONAL {?term skos:prefLabel ?termLabel.}",
        "OPTIONAL {?term skos:definition ?termDefinition.}",
        "FILTER (?term NOT IN (<https://slovník.gov.cz/základní/pojem/vztah>))",
        "}"
    ].join(" ");
    let q = endpoint + "?query=" + encodeURIComponent(query);
    await fetch(q, {headers: {"Accept": "application/json"}}).then(
        response => response.json()
    ).then(async data => {
        for (let row of data.results.bindings){
            if (!(row.term.value in result)) {
                await fetchConcepts(endpoint, source, sendTo, readOnly, callback, row.term.value, requiredTypes, requiredValues);
                result[row.term.value] = {
                    labels: initLanguageObject(""),
                    definitions: initLanguageObject(""),
                    types: [],
                    inScheme: source,
                    domainOf: []
                }
            }
            if (row.termType && !(result[row.term.value].types.includes(row.termType.value))) result[row.term.value].types.push(row.termType.value);
            if (row.termLabel) result[row.term.value].labels[row.termLabel['xml:lang']] = row.termLabel.value;
            if (row.termDefinition) result[row.term.value].definitions[row.termDefinition['xml:lang']] = row.termDefinition.value;
        }
        Object.assign(sendTo, result);
        if (callback) callback(true);
    }).catch(() => {
        if (callback) callback(false);
    });
}

export async function getScheme(iri: string, endpoint: string, readOnly: boolean, callback?: Function) {
    let query = [
        "SELECT DISTINCT ?term ?termLabel ?graph",
        "WHERE {",
        "GRAPH ?graph {",
        "<" + iri + "> rdfs:label ?termLabel",
        "}",
        "}"
    ].join(" ");
    let q = endpoint + "?query=" + encodeURIComponent(query);
    await fetch(q, {headers: {'Accept': 'application/json'}}).then(response => {
        return response.json();
    }).then(data => {
        for (let result of data.results.bindings) {
            if (!(iri in Schemes)) Schemes[iri] = {labels: {}, readOnly: readOnly, graph: ""}
            if (result.termLabel !== undefined) Schemes[iri].labels[result.termLabel['xml:lang']] = result.termLabel.value;
            if (result.graph !== undefined) Schemes[iri].graph = result.graph.value;
        }
        if (callback) callback(true);
    }).catch(() => {
        if (callback) callback(false);
    });
}

//TODO: implement loading og things
export async function getElementsConfig(endpoint: string, callback?: Function) {
    let editableSchemes = Object.keys(Schemes).filter((scheme) => !Schemes[scheme].readOnly);
    for (let iri in VocabularyElements) {
        if (editableSchemes.includes(VocabularyElements[iri].inScheme)) {
            let query = "select ?p ?o where {<" + iri + "> ?p ?o .}";
            let q = endpoint + "?query=" + encodeURIComponent(query);
            await fetch(q, {headers: {'Accept': 'application/json'}}).then(response => {
                return response.json();
            }).then(data => {
                for (let result of data.results.bindings) {

                }
                if (callback) callback(true);
            }).catch(() => {
                if (callback) callback(false);
            });
        }
    }
}

export async function getLinksConfig(endpoint: string, callback?: Function) {
    let editableSchemes = Object.keys(Schemes).filter((scheme) => !Schemes[scheme].readOnly);
    for (let iri in VocabularyElements) {
        if (editableSchemes.includes(VocabularyElements[iri].inScheme)) {
            let query = "select ?p ?o where {<" + iri + "> ?p ?o .}";
            let q = endpoint + "?query=" + encodeURIComponent(query);
            await fetch(q, {headers: {'Accept': 'application/json'}}).then(response => {
                return response.json();
            }).then(data => {
                for (let result of data.results.bindings) {

                }
                if (callback) callback(true);
            }).catch(() => {
                if (callback) callback(false);
            });
        }
    }
}