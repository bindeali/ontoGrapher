import * as joint from 'jointjs';
import {Links, Prefixes, ProjectElements, ProjectLinks, Schemes, VocabularyElements} from "./Variables";
import {initLanguageObject} from "../function/FunctionEditVars"
import {generalizationLink} from "../graph/uml/GeneralizationLink";
import {LinkType} from "./Enum";

export var LinkConfig: {
	[key: number]: {
		add: (id: string) => {},
		delete: (id: string, del: string[]) => {}
		newLink: (id?: string) => joint.dia.Link,
		labels: { [key: string]: string }
	}
} = {
	[LinkType.DEFAULT]: {
		labels: initLanguageObject(""),
		newLink: (id) => {
			if (id) return new joint.shapes.standard.Link({id: id});
			else return new joint.shapes.standard.Link();
		},
		add: (id: string) => {
			let iri = ProjectElements[ProjectLinks[id].source].iri;
			let scheme = VocabularyElements[iri].inScheme;
			let connections: { [key: string]: string } = {};
			let connectionContext: { [key: string]: any } = {};
			let linkContext: { [key: string]: any } = {};

			Object.keys(Links).forEach(link => {
				if (Links[link].type === LinkType.DEFAULT) linkContext[link] = {"@type": "@id"};
			})

			ProjectElements[ProjectLinks[id].source].connections.forEach((linkID) => {
				if (linkID in ProjectLinks && ProjectElements[ProjectLinks[linkID].target]) {
					connections[ProjectLinks[linkID].iri] = ProjectElements[ProjectLinks[linkID].target].iri
					connectionContext[ProjectLinks[linkID].iri] = {"@type": "@id"}
				}
			})

			return {
				"@context": {...Prefixes, ...connectionContext, ...linkContext},
				"@id": Schemes[scheme].graph,
				"@graph": [
					{
						"@id": iri,
						...connections
					}
				]
			};
		},
		delete: (id, del) => {
			let iri = ProjectElements[ProjectLinks[id].source].iri;
			let scheme = VocabularyElements[iri].inScheme;
			let connectionContext: { [key: string]: any } = {};
			let linkContext: { [key: string]: any } = {};
			let connections: { [key: string]: string } = {};
			let delConnections: { [key: string]: string } = {};

			Object.keys(Links).forEach(link => {
				if (Links[link].type === LinkType.DEFAULT) linkContext[link] = {"@type": "@id"};
			})

			ProjectElements[ProjectLinks[id].source].connections.forEach((linkID) => {
				if (linkID in ProjectLinks && ProjectElements[ProjectLinks[linkID].target]) {
					connections[ProjectLinks[linkID].iri] = ProjectElements[ProjectLinks[linkID].target].iri
					connectionContext[ProjectLinks[linkID].iri] = {"@type": "@id"}
				}
			})

			del.forEach((linkID) => {
				if (linkID in ProjectLinks && ProjectElements[ProjectLinks[linkID].target]) {
					delConnections[ProjectLinks[linkID].iri] = ProjectElements[ProjectLinks[linkID].target].iri
					connectionContext[ProjectLinks[linkID].iri] = {"@type": "@id"}
				}
			})

			return {
				"@context": {...Prefixes, ...connectionContext, ...linkContext},
				"@id": Schemes[scheme].graph,
				"@graph": [
					{
						"@id": iri,
						...delConnections
					}
				]
			};
		}
	},
	[LinkType.GENERALIZATION]: {
		labels: {"cs": "Generalizace", "en": "Generalization"},
		newLink: (id) => {
			if (id) return new generalizationLink({id: id});
			else return new generalizationLink();
		},
		add: (id) => {
			let subClassOf: string[] = ProjectElements[ProjectLinks[id].source].connections.filter(conn => ProjectLinks[conn].type === LinkType.GENERALIZATION).map(conn => ProjectElements[ProjectLinks[conn].target].iri);
			let sourceIRI = ProjectElements[ProjectLinks[id].source].iri;
			let scheme = VocabularyElements[sourceIRI].inScheme;
			return {
				"@context": {...Prefixes, "rdfs:subClassOf": {"@type": "@id"}},
				"@id": Schemes[scheme].graph,
				"@graph": [
					{
						"@id": sourceIRI,
						"rdfs:subClassOf": subClassOf
					}
				]
			};
		},
		delete: (id, del) => {
			let iri = ProjectElements[ProjectLinks[id].source].iri;
			let scheme = VocabularyElements[iri].inScheme;
			let delConnections: string[] = [];

			del.forEach((linkID) => {
				delConnections.push(ProjectElements[ProjectLinks[linkID].target].iri);
			})

			return {
				"@context": {...Prefixes, "rdfs:subClassOf": {"@type": "@id"}},
				"@id": Schemes[scheme].graph,
				"@graph": [
					{
						"@id": iri,
						"rdfs:subClassOf": delConnections,
					}
				]
			};
		}
	}
};