import {
	Diagrams,
	Prefixes,
	ProjectElements,
	ProjectLinks,
	ProjectSettings,
	Schemes,
	VocabularyElements
} from "../config/Variables";
import {LinkConfig} from "../config/LinkConfig";

export async function updateProjectElement(
	contextEndpoint: string,
	source: string,
	newTypes: string[],
	newLabels: { [key: string]: string },
	newDefinitions: { [key: string]: string },
	id: string): Promise<boolean> {
	let iri = ProjectElements[id].iri;
	let scheme = VocabularyElements[iri].inScheme;
	let delTypes = VocabularyElements[iri].types;
	let addDefinitions: { "@value": string, "@language": string }[] = [];
	let addLabels: { "@value": string, "@language": string }[] = [];

	Object.keys(newLabels).forEach((lang) => {
		if (newLabels[lang] !== "") addLabels.push({"@value": newLabels[lang], "@language": lang});
	})

	Object.keys(newDefinitions).forEach((lang) => {
		if (newDefinitions[lang] !== "") addDefinitions.push({"@value": newDefinitions[lang], "@language": lang});
	})

	let addLD = {
		"@context": {
			...Prefixes,
			"skos:inScheme": {"@type": "@id"},
			"og:diagram": {"@type": "@id"},
			"og:attribute": {"@type": "@id"},
			"og:property": {"@type": "@id"},
			"og:iri": {"@type": "@id"},
			"og:context": {"@type": "@id"},
			"http://www.w3.org/2002/07/owl#onProperty": {"@type": "@id"},
		},
		"@id": Schemes[scheme].graph,
		"@graph": [
			{
				"@id": iri,
				"@type": newTypes,
				"skos:prefLabel": addLabels,
				"skos:definition": addDefinitions,
				"skos:inScheme": scheme,
			},
			{
				"@id": iri + "/diagram",
				"@type": "og:element",
				"og:context": ProjectSettings.contextIRI,
				"og:id": id,
				"og:iri": iri,
				"og:untitled": ProjectElements[id].untitled,
				"og:diagram": ProjectElements[id].diagrams.map((diag) => (iri + "/diagram-" + (diag + 1))),
				"og:active": ProjectElements[id].active,
			},
			...ProjectElements[id].diagrams.map(diag => {
				return {
					"@id": iri + "/diagram-" + (diag + 1),
					"@type": "og:elementDiagram",
					"og:index": diag,
					"og:position-x": ProjectElements[id].position[diag].x,
					"og:position-y": ProjectElements[id].position[diag].y,
					"og:hidden": ProjectElements[id].hidden[diag]
				}
			}),
		]
	}

	let deleteLD = {
		"@context": {
			...Prefixes,
			"skos:inScheme": {"@type": "@id"},
			"og:diagram": {"@type": "@id"},
			"og:attribute": {"@type": "@id"},
			"og:property": {"@type": "@id"},
			"og:iri": {"@type": "@id"},
			"owl:onProperty": {"@type": "@id"}
		},
		"@id": Schemes[scheme].graph,
		"@graph": [
			{
				"@id": iri,
				"@type": delTypes,
				"skos:prefLabel": Object.keys(VocabularyElements[iri].labels).map(lang => {
					return {
						"@value": VocabularyElements[iri].labels[lang],
						"@language": lang
					}
				}),
				"skos:definition": Object.keys(VocabularyElements[iri].definitions).map(lang => {
					return {
						"@value": VocabularyElements[iri].definitions[lang],
						"@language": lang
					}
				}),
				"skos:inScheme": scheme,
			}
		]
	}

	let addStrings: string[] = [JSON.stringify(addLD)];
	let delStrings: string[] = [JSON.stringify(deleteLD)];

	for (const diag of ProjectElements[id].diagrams) {
		let delString = await processGetTransaction(contextEndpoint, {subject: iri + "/diagram-" + (diag + 1), context: Schemes[scheme].graph}).catch(() => false);
		if (typeof delString === "string") {
			delStrings.push(delString);
		} else return false;
	}


	return await processTransaction(contextEndpoint, {add: addStrings, delete: delStrings});
}

export async function updateProjectLink(contextEndpoint: string, id: string) {
	let linkIRI = ProjectSettings.ontographerContext + "-" + id;
	let cardinalities: { [key: string]: string } = {};
	let vertices: { "@id": string, "@type": "og:vertex", "og:index": number, "og:position-x": number, "og:position-y": number }[] = [];
	if (ProjectLinks[id].sourceCardinality) {
		cardinalities["og:sourceCardinality1"] = ProjectLinks[id].sourceCardinality.getFirstCardinality();
		cardinalities["og:sourceCardinality2"] = ProjectLinks[id].sourceCardinality.getSecondCardinality();
	}
	if (ProjectLinks[id].targetCardinality) {
		cardinalities["og:targetCardinality1"] = ProjectLinks[id].targetCardinality.getFirstCardinality();
		cardinalities["og:targetCardinality2"] = ProjectLinks[id].targetCardinality.getSecondCardinality();
	}

	ProjectLinks[id].vertices.forEach((vertex, i) => {
		vertices.push({
			"@id": linkIRI + "/vertex-" + (i + 1),
			"@type": "og:vertex",
			"og:index": i,
			"og:position-x": Math.round(vertex.x),
			"og:position-y": Math.round(vertex.y)
		})
	})

	let addLD = {
		"@context": {
			...Prefixes,
			"og:iri": {"@type": "@id"},
			"og:source": {"@type": "@id"},
			"og:target": {"@type": "@id"},
			"og:context": {"@type": "@id"},
			"og:vertex": {"@type": "@id"},
		},
		"@id": ProjectSettings.ontographerContext,
		"@graph": [{
			"@id": linkIRI,
			"@type": "og:link",
			"og:id": id,
			"og:context": ProjectSettings.contextIRI,
			"og:iri": ProjectLinks[id].iri,
			"og:active": ProjectLinks[id].active,
			"og:source-id": ProjectLinks[id].source,
			"og:target-id": ProjectLinks[id].target,
			"og:source": ProjectElements[ProjectLinks[id].source].iri,
			"og:target": ProjectElements[ProjectLinks[id].target].iri,
			"og:type": ProjectLinks[id].type,
			...cardinalities,
			"og:vertex": vertices.map(vert => vert["@id"])
		},
			...vertices
		]
	}

	let delString = "";
	let del = await processGetTransaction(contextEndpoint, {subject: linkIRI}).catch(() => false);
	if (typeof del === "string") {
		delString = del;
	}

	let addStrings: string[] = [JSON.stringify(addLD)];
	let delStrings: string[] = delString === "" ? [] : [delString];

	for (let vert of ProjectLinks[id].vertices) {
		let i = ProjectLinks[id].vertices.indexOf(vert);
		let del = await processGetTransaction(contextEndpoint, {subject: linkIRI + "/vertex-" + (i + 1)}).catch(() => false);
		if (typeof del === "string") {
			delStrings.push(del);
		}
	}

	return await processTransaction(contextEndpoint, {"add": addStrings, delete: delStrings}).catch(() => false);
}

export async function updateDeleteProjectElement(contextEndpoint: string, iri: string, context: string) {
	let subjectLD = await processGetTransaction(contextEndpoint, {subject: iri, context: context}).catch(() => false);
	let predicateLD = await processGetTransaction(contextEndpoint, {predicate: iri, context: context}).catch(() => false);
	let objectLD = await processGetTransaction(contextEndpoint, {object: iri, context: context}).catch(() => false);
	if (typeof subjectLD === "string" && typeof predicateLD === "string" && typeof objectLD === "string") {
		return await processTransaction(contextEndpoint, {add: [], "delete": [subjectLD]}) &&
			await processTransaction(contextEndpoint, {add: [], "delete": [predicateLD]}) &&
			await processTransaction(contextEndpoint, {add: [], "delete": [objectLD]});
	} else return false;
}

//id: link ID
export async function updateConnections(contextEndpoint: string, id: string) {

	return await processTransaction(contextEndpoint, {
		"add": [],
		"delete": [],
		"update": LinkConfig[ProjectLinks[id].type].update(id)
	});
}

export function getTransactionID(contextEndpoint: string) {
	return new Promise((resolve, reject) => {
		let transactionUrl = contextEndpoint + "/transactions";
		fetch(transactionUrl, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: "POST"
		}).then(response => response.headers).then(
			headers => resolve(headers.get("location"))
		).catch((error) => {
			reject(error);
		});
	})
}

export async function processGetTransaction(contextEndpoint: string, request: { subject?: string, predicate?: string, object?: string, context?: string}) {
	const transactionID = await getTransactionID(contextEndpoint);

	if (transactionID) {
		let transactionUrl = transactionID + "?action=GET" +
			((request.subject !== undefined) ? ("&subj=<" + encodeURIComponent(request.subject) + ">") : "") +
			((request.predicate !== undefined) ? ("&pred=<" + encodeURIComponent(request.predicate) + ">") : "") +
			((request.object !== undefined) ? ("&obj=<" + encodeURIComponent(request.object) + ">") : "") +
			((request.context !== undefined) ? ("&context=<" + encodeURIComponent(request.context) + ">") : "")
		return await fetch(transactionUrl, {
			headers: {'Accept': "application/ld+json"},
			method: "PUT"
		}).then(response => response.text()).catch(() => {
			return null;
		});
	} else return null;
}

export async function processTransaction(contextEndpoint: string, transactions: { add: string[], delete: string[], update?: string[] }): Promise<boolean> {
	const transactionID = await getTransactionID(contextEndpoint);

	if (transactionID) {
		let resultAdd, resultDelete, resultUpdate, resultCommit;

		if (transactions.update) {
			for (let update of transactions.update) {
				resultUpdate = await fetch(transactionID + "?action=UPDATE&update=" + encodeURIComponent(update), {
					headers: {
						'Content-Type': 'application/json'
					},
					method: "PUT",
				}).then(response => response.ok)
			}
		}

		for (let del of transactions.delete) {
			resultDelete = await fetch(transactionID + "?action=DELETE", {
				headers: {
					'Content-Type': 'application/ld+json'
				},
				method: "PUT",
				body: del
			}).then(response => response.ok)
		}

		for (let add of transactions.add) {
			resultAdd = await fetch(transactionID + "?action=ADD", {
				headers: {
					'Content-Type': 'application/ld+json'
				},
				method: "PUT",
				body: add
			}).then(response => response.ok)
		}

		resultCommit = await fetch(transactionID + "?action=COMMIT", {
			headers: {
				'Content-Type': 'application/json'
			},
			method: "PUT"
		}).then(response => response.ok)

		return ((resultAdd ? resultAdd : true) && (resultDelete ? resultDelete : true) && (resultUpdate ? resultUpdate : true) && resultCommit);
	} else return false;
}

export async function updateProjectSettings(contextIRI: string, contextEndpoint: string) {

	let contextLD = {
		"@context": {
			...Prefixes,
			"d-sgov-pracovní-prostor-pojem:aplikační-kontext": {"@type": "@id"},
			"d-sgov-pracovní-prostor-pojem:odkazuje-na-kontext": {"@type": "@id"}
		},
		"@id": contextIRI,
		"@graph": [{
			"@id": contextIRI,
			"d-sgov-pracovní-prostor-pojem:odkazuje-na-kontext": ProjectSettings.ontographerContext
		}, {
			"@id": ProjectSettings.ontographerContext,
			"@type": "d-sgov-pracovní-prostor-pojem:aplikační-kontext"
		}]
	}

	let contextInstance = ProjectSettings.contextIRI.substring(ProjectSettings.contextIRI.lastIndexOf("/"));

	let ogContextLD = {
		"@context": {
			...Prefixes,
			"og:diagram": {"@type": "@id"},
			"d-sgov-pracovní-prostor-pojem:aplikační-kontext": {"@type": "@id"},
			"og:context": {"@type": "@id"}
		},
		"@id": ProjectSettings.ontographerContext,
		"@graph": [
			{
				"@id": ProjectSettings.ontographerContext,
				"@type": "d-sgov-pracovní-prostor-pojem:aplikační-kontext",
				"d-sgov-pracovní-prostor-pojem:aplikační-kontext": contextIRI,
			},
			{
				"@id": ProjectSettings.ontographerContext + contextInstance,
				"og:context": contextIRI,
				"og:selectedDiagram": ProjectSettings.selectedDiagram,
				"og:selectedLanguage": ProjectSettings.selectedLanguage,
				"og:diagram": Diagrams.map((diag, i) => ProjectSettings.ontographerContext + contextInstance + "/diagram-" + (i + 1)),
				"og:initialized": true
			},
			...(Diagrams).filter(diag => diag.active).map((diag, i) => {
				return {
					"@id": ProjectSettings.ontographerContext + contextInstance + "/diagram-" + (i + 1),
					"og:index": i,
					"og:context": contextIRI,
					"og:name": diag.name,
				}
			})
		]
	}

	let addStrings = [JSON.stringify(contextLD), JSON.stringify(ogContextLD)];
	let delStrings: string[] = [];

	let delString = await processGetTransaction(ProjectSettings.contextEndpoint, {
		subject: ProjectSettings.ontographerContext,
		context: ProjectSettings.ontographerContext}).catch(() => false);
	if (typeof delString === "string") {
		delStrings.push(delString);
	}

	for (const diag of Diagrams) {
		let i = Diagrams.indexOf(diag);
		let delString = await processGetTransaction(contextEndpoint, {
			subject: ProjectSettings.ontographerContext + "/diagram-" + (i + 1),
			context: ProjectSettings.ontographerContext}).catch(() => false);
		if (typeof delString === "string") {
			delStrings.push(delString);
		}
	}

	return await processTransaction(contextEndpoint, {"add": addStrings, "delete": delStrings});
}