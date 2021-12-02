import {
  getDiagramContextIRI,
  getWorkspaceContextIRI,
} from "../../function/FunctionGetVars";
import { DELETE, INSERT } from "@tpluscode/sparql-builder";
import { qb } from "../QueryBuilder";
import { AppSettings, Diagrams } from "../../config/Variables";
import { parsePrefix } from "../../function/FunctionEditVars";

function getDiagramTriples(diagram: number): string {
  const diagramIRI = getDiagramContextIRI(diagram);
  const diagramAttachmentTypes = [
    qb.i(parsePrefix("d-sgov-pracovní-prostor-pojem", "příloha")),
    qb.i(parsePrefix("a-popis-dat", "příloha")),
    qb.i(parsePrefix("og", "diagram")),
  ];
  return INSERT.DATA`${qb.g(diagramIRI, [
    qb.s(qb.i(diagramIRI), "rdf:type", qb.a(diagramAttachmentTypes)),
    qb.s(qb.i(diagramIRI), "og:index", qb.ll(diagram)),
    qb.s(qb.i(diagramIRI), "og:name", qb.ll(Diagrams[diagram].name)),
    qb.s(qb.i(diagramIRI), "og:id", qb.ll(Diagrams[diagram].id)),
    qb.s(
      qb.i(diagramIRI),
      "og:representation",
      qb.ll(Diagrams[diagram].representation)
    ),
  ])}`.build();
}

export function updateCreateDiagram(diagram: number): string {
  const diagramIRI = qb.i(getDiagramContextIRI(diagram));
  const insertDiagramContext = getDiagramTriples(diagram);
  const insertMetadataContext = INSERT.DATA`${qb.g(AppSettings.contextIRI, [
    qb.s(
      qb.i(AppSettings.contextIRI),
      qb.i(
        parsePrefix(
          "d-sgov-pracovní-prostor-pojem",
          `odkazuje-na-přílohový-kontext`
        )
      ),
      diagramIRI
    ),
    qb.s(
      diagramIRI,
      "rdf:type",
      qb.i(parsePrefix("d-sgov-pracovní-prostor-pojem", "přílohový-kontext"))
    ),
    qb.s(
      diagramIRI,
      qb.i(parsePrefix("d-sgov-pracovní-prostor-pojem", "má-typ-přílohy")),
      "og:diagram"
    ),
  ])}`.build();

  return qb.combineQueries(insertMetadataContext, insertDiagramContext);
}

export function updateDiagram(diagram: number): string {
  const appContextIRI = getWorkspaceContextIRI();
  const diagramIRI = getDiagramContextIRI(diagram);
  const insertAppContext = INSERT.DATA`${qb.g(appContextIRI, [
    qb.s(qb.i(appContextIRI), "og:diagram", qb.i(diagramIRI)),
  ])}`.build();
  const insertDiagramContext = getDiagramTriples(diagram);
  const del = DELETE`${qb.g(diagramIRI, [
    qb.s(qb.i(diagramIRI), "?p1", "?o1"),
  ])}`.WHERE`${qb.g(diagramIRI, [
    qb.s(qb.i(diagramIRI), "?p1", "?o1"),
  ])}`.build();
  return qb.combineQueries(del, insertAppContext, insertDiagramContext);
}

export function updateDeleteDiagram(diagram: number) {
  const diagramIRI = getDiagramContextIRI(diagram);
  const deleteGraph = `DROP GRAPH <${diagramIRI}>`;
  const projectID = AppSettings.contextIRI.substring(
    AppSettings.contextIRI.lastIndexOf("/")
  );
  const deleteGraphLegacy = `DROP GRAPH <${parsePrefix(
    "d-sgov-pracovní-prostor-pojem",
    `assetový-kontext${projectID}/diagram/${Diagrams[diagram].id}`
  )}>`;
  const deleteMetadataContext = DELETE.DATA`${qb.g(AppSettings.contextIRI, [
    qb.s(
      qb.i(AppSettings.contextIRI),
      qb.i(
        parsePrefix(
          "d-sgov-pracovní-prostor-pojem",
          `odkazuje-na-přílohový-kontext`
        )
      ),
      qb.i(diagramIRI)
    ),
    qb.s(
      qb.i(AppSettings.contextIRI),
      qb.i(
        parsePrefix(
          "d-sgov-pracovní-prostor-pojem",
          `odkazuje-na-assetový-kontext`
        )
      ),
      qb.i(diagramIRI)
    ),
    qb.s(
      qb.i(diagramIRI),
      "rdf:type",
      qb.i(parsePrefix("d-sgov-pracovní-prostor-pojem", "přílohový-kontext"))
    ),
    qb.s(
      qb.i(diagramIRI),
      qb.i(parsePrefix("d-sgov-pracovní-prostor-pojem", "má-typ-přílohy")),
      "og:diagram"
    ),
  ])}`.build();
  return qb.combineQueries(
    deleteGraph,
    deleteGraphLegacy,
    deleteMetadataContext
  );
}
