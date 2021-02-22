import React from 'react';
import * as joint from 'jointjs';
import {graphElement} from "../graph/GraphElement";
import {
    Diagrams,
    PackageRoot,
    ProjectElements,
    ProjectLinks,
    ProjectSettings,
    Schemes,
    VocabularyElements
} from "../config/Variables";
import {graph} from "../graph/Graph";
import {restoreHiddenElem, setRepresentation} from "../function/FunctionGraph";
import {HideButton} from "../graph/elementTool/ElemHide";
import {ElemCreateLink} from "../graph/elementTool/ElemCreateLink";
import NewLinkModal from "./NewLinkModal";
import {getElementShape, getNewLink} from "../function/FunctionGetVars";
import NewElemModal from "./NewElemModal";
import {PackageNode} from "../datatypes/PackageNode";
import {Representation} from "../config/Enum";
import {drawGraphElement, highlightCell, unHighlightCell, unHighlightSelected} from "../function/FunctionDraw";
import {zoomDiagram} from "../function/FunctionDiagram";
import {updateProjectLinkVertices} from "../queries/UpdateLinkQueries";
import {updateProjectElement, updateProjectElementDiagram} from "../queries/UpdateElementQueries";
import {createNewConcept, getElementToolPosition} from "../function/FunctionElem";
import {addLinkTools, saveNewLink, updateVertices} from "../function/FunctionLink";

interface Props {
    projectLanguage: string;
    updateElementPanel: Function;
    updateDetailPanel: Function;
    error: boolean;
    performTransaction: (...queries: string[]) => void;
}

interface State {
    modalAddElem: boolean;
    modalAddLink: boolean;
}

export var paper: joint.dia.Paper;

export default class DiagramCanvas extends React.Component<Props, State> {
    private readonly canvasRef: React.RefObject<HTMLDivElement>;
    private drag: { x: any, y: any } | undefined;
    private newLink: boolean;
    private sid: string | undefined;
    private tid: string | undefined;
    private newConceptEvent: { x: number, y: number };
    private highlightedCells: string[];
    private drawStart: joint.g.Rect | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            modalAddElem: false,
            modalAddLink: false
        }
        this.canvasRef = React.createRef();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.drag = undefined;
        this.newLink = false;
        this.sid = undefined;
        this.tid = undefined;
        this.newConceptEvent = {x: 0, y: 0}
        this.highlightedCells = [];
        this.drawStart = undefined;
        this.createNewLink = this.createNewLink.bind(this);
    }

    createNewLink(id: string) {
        this.newLink = true;
        this.sid = id;
        graph.getElements().forEach(element => {
            if (typeof element.id === "string") {
                highlightCell(element.id, '#ff7800');
                this.highlightedCells.push(element.id);
            }
        });
    }

    saveNewLink(iri: string) {
        if (this.sid && this.tid) {
            this.props.performTransaction(...saveNewLink(iri, this.sid, this.tid));
            this.props.updateElementPanel();
            this.props.updateDetailPanel();
            this.sid = undefined;
            this.tid = undefined;
            this.newLink = false;
            unHighlightSelected(this.highlightedCells);
            this.highlightedCells = [];
        }
    }

    updateElement(cell: joint.dia.Cell) {
        const id = cell.id as string;
        const find = ProjectSettings.selectedCells.findIndex(elem => elem.id === id);
        if (find !== -1)
            ProjectSettings.selectedCells.splice(find, 1);
        cell.remove();
        ProjectElements[id].hidden[ProjectSettings.selectedDiagram] = true;
        this.props.updateElementPanel();
        this.props.updateDetailPanel();
        this.props.performTransaction(updateProjectElementDiagram(ProjectSettings.selectedDiagram, id));
    }

    componentDidMount(): void {
        const node = (this.canvasRef.current! as HTMLElement);

        paper = new joint.dia.Paper({
            el: node,
            model: graph,
            width: "auto",
            height: "100vh",
            gridSize: 1,
            linkPinning: false,
            background: {
                color: "#e3e3e3"
            },
            clickThreshold: 0,
            async: false,
            sorting: joint.dia.Paper.sorting.APPROX,
            connectionStrategy: joint.connectionStrategies.pinAbsolute,
            defaultConnectionPoint: {name: 'boundary', args: {sticky: true, selector: 'bodyBox'}},
            defaultLink: function () {
                return getNewLink();
            }
        });

        paper.on({
            'blank:contextmenu': (evt) => {
                evt.preventDefault();
                if (!this.newLink && PackageRoot.children.find(pkg => !(Schemes[pkg.scheme].readOnly))) {
                    this.setState({modalAddElem: true});
                    this.newConceptEvent = {x: evt.clientX, y: evt.clientY}
                } else this.newLink = false;
                this.props.updateDetailPanel();
                unHighlightSelected(this.highlightedCells);
                this.highlightedCells = [];
                ProjectSettings.selectedLink = "";
            },
            'cell:contextmenu': (cellView, evt) => {
                evt.preventDefault();
            },
            'cell:pointerclick': (cellView, evt) => {
                if (!this.newLink && !evt.ctrlKey) {
                    const id = cellView.model.id;
                    this.props.updateDetailPanel(id);
                    ProjectSettings.selectedCells = [];
                    unHighlightSelected(this.highlightedCells);
                    highlightCell(id);
                    this.highlightedCells = [id];
                }
            },
            'element:pointerup': (cellView, evt) => {
                if (!this.newLink && !(evt.ctrlKey)) {
                    const iter = ProjectSettings.selectedCells.length > 0 ? ProjectSettings.selectedCells : [cellView.model];
                    const {
                        rect, bbox, ox, oy
                    } = evt.data;
                    if (rect) rect.remove();
                    let movedLinks: string[] = [];
                    let movedElems: string[] = [];
                    iter.forEach(elem => {
                        const id = elem.id;
                        const oldPos = elem.position();
                        if (bbox && ox && oy && id !== cellView.model.id) {
                            const diff = new joint.g.Point(bbox.x, bbox.y).difference(ox, oy);
                            elem.position(oldPos.x + diff.x / Diagrams[ProjectSettings.selectedDiagram].scale, oldPos.y + diff.y / Diagrams[ProjectSettings.selectedDiagram].scale);
                            for (const link of graph.getConnectedLinks(elem)) {
                                if (typeof link.id === "string" && !(movedLinks.includes(link.id)) && link.vertices().length > 0) {
                                    movedLinks.push(link.id);
                                    link.vertices().forEach((vert, i) => {
                                        link.vertex(i, {
                                            x: vert.x + diff.x / Diagrams[ProjectSettings.selectedDiagram].scale,
                                            y: vert.y + diff.y / Diagrams[ProjectSettings.selectedDiagram].scale
                                        })
                                    })
                                    ProjectLinks[link.id].vertices[ProjectSettings.selectedDiagram] = link.vertices();
                                }
                            }
                        }
                        const pos = elem.position();
                        if (pos.x !== ProjectElements[id].position[ProjectSettings.selectedDiagram].x ||
                            pos.y !== ProjectElements[cellView.model.id].position[ProjectSettings.selectedDiagram].y) {
                            ProjectElements[id].position[ProjectSettings.selectedDiagram] = pos;
                            movedElems.push(id);
                        }
                    })
                    let queries: string[] = [];
                    if (movedElems.length > 0)
                        queries.push(updateProjectElementDiagram(ProjectSettings.selectedDiagram, ...movedElems));
                    if (movedLinks.length > 0)
                        queries.push(updateProjectLinkVertices(ProjectSettings.selectedDiagram, ...movedLinks));
                    this.props.performTransaction(...queries);
                }
            },
            'element:pointerclick': (cellView, evt) => {
                ProjectSettings.selectedLink = "";
                if (this.newLink) {
                    this.tid = cellView.model.id;
                    this.setState({modalAddLink: true});
                } else if (evt.ctrlKey) {
                    this.props.updateDetailPanel();
                    const find = ProjectSettings.selectedCells.findIndex(elem => elem.id === cellView.model.id);
                    if (find !== -1) {
                        ProjectSettings.selectedCells.splice(ProjectSettings.selectedCells.indexOf(cellView.model), 1);
                        this.highlightedCells.splice(this.highlightedCells.indexOf(cellView.model), 1);
                        unHighlightCell(cellView.model.id);
                    } else {
                        ProjectSettings.selectedCells.push(cellView.model);
                        this.highlightedCells.push(cellView.model);
                        highlightCell(cellView.model.id, '#ff9037');
                    }
                } else {
                    unHighlightSelected(ProjectSettings.selectedCells.map(cell => cell.id as string).concat(this.highlightedCells));
                    highlightCell(cellView.model.id);
                    ProjectSettings.selectedCells = [];
                    this.highlightedCells = [cellView.model];
                }
            },
            'element:mouseenter': (elementView) => {
                const id = elementView.model.id;
                const tool = new HideButton({
                    useModelGeometry: false,
                    ...getElementToolPosition(id, true),
                    offset: {x: getElementShape(id) === "bodyTrapezoid" ? -20 : 0, y: 0},
                    action: () => this.updateElement(elementView.model)
                })
                elementView.addTools(new joint.dia.ToolsView({
                    tools: [
                        !(Schemes[VocabularyElements[ProjectElements[id].iri].inScheme].readOnly) && new ElemCreateLink({
                            useModelGeometry: false,
                            ...getElementToolPosition(id),
                            action: (evt: { currentTarget: { getAttribute: (arg0: string) => any; }; }) => {
                                if (graph.getElements().length > 1) this.createNewLink(evt.currentTarget.getAttribute("model-id"));
                            }
                        }),
                        tool]
                }));
            },
            'link:mouseenter': (linkView) => {
                if (ProjectSettings.selectedLink === linkView.model.id) addLinkTools(linkView,
                    this.props.performTransaction, this.props.updateElementPanel);
            },
            'cell:mouseleave': function (cellView) {
                cellView.removeTools();
            },
            'blank:pointerdown': (evt, x, y) => {
                if (evt.button === 0 && (!(evt.shiftKey))) {
                    ProjectSettings.selectedLink = "";
                    this.props.updateDetailPanel();
                    unHighlightSelected(this.highlightedCells);
                    this.highlightedCells = [];
                    ProjectSettings.selectedCells = [];
                    const translate = paper.translate();
                    const point = {
                        x: (x * Diagrams[ProjectSettings.selectedDiagram].scale + translate.tx),
                        y: (y * Diagrams[ProjectSettings.selectedDiagram].scale + translate.ty)
                    }
                    const bbox = new joint.g.Rect(point.x, point.y, 1, 1);
                    const rect = joint.V('rect', {
                        'stroke': 'blue',
                        'fill': 'blue',
                        'fill-opacity': 0.1,
                    });
                    rect.attr(bbox.toJSON());
                    rect.appendTo(paper.svg);
                    evt.data = {
                        rect,
                        ox: point.x,
                        oy: point.y,
                        bbox
                    };
                } else if (evt.button === 1 || (evt.button === 0 && evt.shiftKey)) {
                    const scale = paper.scale();
                    this.drag = {x: x * scale.sx, y: y * scale.sy};
                }
            },
            'blank:mousewheel': (evt, x, y, delta) => {
                evt.preventDefault();
                zoomDiagram(x, y, delta);
            },
            'blank:pointermove': function (evt, x, y) {
                const {
                    ox,
                    oy,
                    rect
                } = evt.data;
                if (evt.buttons === 1 && (!(evt.shiftKey))) {
                    const bbox = new joint.g.Rect(ox, oy,
                        (x * Diagrams[ProjectSettings.selectedDiagram].scale - ox) + Diagrams[ProjectSettings.selectedDiagram].origin.x,
                        ((y * Diagrams[ProjectSettings.selectedDiagram].scale) - oy) + Diagrams[ProjectSettings.selectedDiagram].origin.y);
                    if (bbox.width === 0) bbox.width = 1;
                    if (bbox.height === 0) bbox.height = 1;
                    bbox.normalize();
                    rect.attr(bbox.toJSON());
                    evt.data.bbox = bbox;
                } else if (evt.buttons === 1 && (evt.shiftKey) && rect) {
                    rect.remove();
                }
            },
            'element:pointerdown': (cellView, evt) => {
                if (evt.button === 0 && ProjectSettings.selectedCells.length > 1 && ProjectSettings.selectedCells.find(elem => elem.id === cellView.model.id) && !(evt.ctrlKey)) {
                    const cells = graph.getCellsBBox(ProjectSettings.selectedCells);
                    if (cells) {
                        const bbox = new joint.g.Rect(
                            cells.x * Diagrams[ProjectSettings.selectedDiagram].scale + Diagrams[ProjectSettings.selectedDiagram].origin.x,
                            cells.y * Diagrams[ProjectSettings.selectedDiagram].scale + Diagrams[ProjectSettings.selectedDiagram].origin.y,
                            cells.width * Diagrams[ProjectSettings.selectedDiagram].scale,
                            cells.height * Diagrams[ProjectSettings.selectedDiagram].scale
                        )
                        const rect = joint.V('rect', {
                            'stroke': 'orange',
                            'fill': 'none',
                            'stroke-width': 3
                        });
                        rect.attr(bbox.toJSON());
                        rect.appendTo(paper.svg);
                        evt.data = {
                            rect,
                            bbox,
                            ox: bbox.x,
                            oy: bbox.y
                        };
                    }
                }
            },
            'element:pointermove': (cellView, evt) => {
                if (evt.button === 0 && ProjectSettings.selectedCells.length !== 0 &&
                    ProjectSettings.selectedCells.find(elem => elem.id === cellView.model.id)) {
                    const {rect, bbox, ox, oy} = evt.data;
                    if (rect && bbox && ox && oy) {
                        const newBbox = new joint.g.Rect(
                            (bbox.x + evt.originalEvent.movementX),
                            (bbox.y + evt.originalEvent.movementY),
                            bbox.width,
                            bbox.height,
                        )
                        newBbox.normalize();
                        rect.attr(newBbox.toJSON());
                        evt.data.bbox = newBbox;
                    }
                }
            },
            'blank:pointerup': (evt) => {
                Diagrams[ProjectSettings.selectedDiagram].origin = {
                    x: paper.translate().tx, y: paper.translate().ty
                };
                this.drag = undefined;
                if (evt.button === 0 && (!(evt.shiftKey))) {
                    const {
                        rect,
                        bbox
                    } = evt.data;
                    if (rect && bbox) {
                        rect.remove();
                        const area = new joint.g.Rect(
                            ((bbox.x) - Diagrams[ProjectSettings.selectedDiagram].origin.x)
                            / Diagrams[ProjectSettings.selectedDiagram].scale,
                            ((bbox.y) - Diagrams[ProjectSettings.selectedDiagram].origin.y)
                            / Diagrams[ProjectSettings.selectedDiagram].scale,
                            bbox.width / Diagrams[ProjectSettings.selectedDiagram].scale,
                            bbox.height / Diagrams[ProjectSettings.selectedDiagram].scale);
                        paper.findViewsInArea(area).forEach((elem) => {
                            ProjectSettings.selectedCells.push(elem.model);
                            if (typeof elem.model.id === "string") {
                                this.highlightedCells.push(elem.model.id);
                                highlightCell(elem.model.id, '#ff9037');
                            }
                        });
                    }
                }
            },
            'link:pointerclick': (linkView) => {
                ProjectSettings.selectedLink = linkView.model.id;
                addLinkTools(linkView,
                    this.props.performTransaction, this.props.updateElementPanel);
            },
            'link:pointerup': (cellView) => {
                const id = cellView.model.id;
                let link = cellView.model;
                link.findView(paper).removeRedundantLinearVertices();
                this.props.performTransaction(...updateVertices(id, link.vertices()));
            }
        });
    }

    render() {
        return (<div
            style={{cursor: this.props.error ? "not-allowed" : "inherit", opacity: this.props.error ? "0.5" : "1"}}>
            <div
                className={"canvas"}
                id={"canvas"}
                ref={this.canvasRef}
                style={{
                    pointerEvents: this.props.error ? "none" : "auto"
                }}
                onDragOver={(event) => {
                    if (!this.props.error) event.preventDefault();
                }}
                onMouseMove={(event) => {
                    if (this.drag && !(this.props.error)) {
                        paper.translate(event.nativeEvent.offsetX - this.drag.x, event.nativeEvent.offsetY - this.drag.y);
                    }
                }
                }
                onDrop={(event) => {
                    let queries: string[] = [];
                    const data = JSON.parse(event.dataTransfer.getData("newClass"));
                    const matrixDimension = Math.ceil(Math.sqrt(data.id.length));
                    data.id.forEach((id: string, i: number) => {
                        let cls = new graphElement({id: id});
                        drawGraphElement(cls, ProjectSettings.selectedLanguage, ProjectSettings.representation);
                        const point = paper.clientToLocalPoint({x: event.clientX, y: event.clientY});
                        if (data.id.length > 1) {
                            const x = i % matrixDimension;
                            const y = Math.floor(i / matrixDimension);
                            cls.set('position', {x: (point.x + (x * 200)), y: (point.y + (y * 200))});
                            ProjectElements[id].position[ProjectSettings.selectedDiagram] = {
                                x: (point.x + (x * 200)),
                                y: (point.y + (y * 200))
                            };
                        } else {
                            cls.set('position', {x: point.x, y: point.y});
                            ProjectElements[id].position[ProjectSettings.selectedDiagram] = {
                                x: point.x,
                                y: point.y
                            };
                        }
                        ProjectElements[id].hidden[ProjectSettings.selectedDiagram] = false;
                        cls.addTo(graph);
                        this.props.updateElementPanel();
                        queries.push(
                            ...restoreHiddenElem(id, cls, true, true, true),
                            updateProjectElementDiagram(ProjectSettings.selectedDiagram, id));
                    });
                    this.props.performTransaction(...queries);
                    if (ProjectSettings.representation === Representation.COMPACT) setRepresentation(ProjectSettings.representation);
                }}
            />
            <NewLinkModal
                projectLanguage={this.props.projectLanguage}
                modal={this.state.modalAddLink}
                sid={this.sid}
                tid={this.tid}
                close={(selectedLink: string) => {
                    this.setState({modalAddLink: false});
                    if (selectedLink && this.sid && this.tid) this.saveNewLink(selectedLink);
                    else {
                        this.newLink = false;
                        unHighlightSelected(this.highlightedCells);
                        this.highlightedCells = [];
                    }
                }}/>
            <NewElemModal
                projectLanguage={this.props.projectLanguage}
                modal={this.state.modalAddElem}
                close={(conceptName: { [key: string]: string }, pkg: PackageNode) => {
                    this.setState({modalAddElem: false});
                    if (conceptName && pkg) {
                        const id = createNewConcept(this.newConceptEvent, conceptName, this.props.projectLanguage, pkg);
                        this.props.updateElementPanel();
                        this.props.performTransaction(updateProjectElement(true, id),
                            updateProjectElementDiagram(ProjectSettings.selectedDiagram, id));
                    } else {
                        this.newConceptEvent = {x: 0, y: 0}
                    }
                }}/>
        </div>);
    }
}