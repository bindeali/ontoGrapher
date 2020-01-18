import React from 'react';
import {DiagramEngine} from 'storm-react-diagrams';
import {OntoDiagramModel} from "./OntoDiagramModel.js";
import {NodeCommonModel} from "../components/common-node/NodeCommonModel";
import {NodeCommonFactory} from "../components/common-node/NodeCommonFactory";
import {NodeCommonPortFactory} from "../components/common-node/NodeCommonPortFactory";
import {LinkCommonFactory} from "../components/common-link/LinkCommonFactory";
import {LinkCommonModel} from "../components/common-link/LinkCommonModel";
import {LabelCommonFactory} from "../components/common-label/LabelCommonFactory";
import {OntoDiagramWidget} from "./OntoDiagramWidget";
import {Defaults} from "../config/Defaults";
import {Locale} from "../config/locale/Locale";
import {
    StereotypePool,
    StereotypePoolPackage,
    default as Variables,
    globalCount,
    ClassPackage, HiddenRelationships, HiddenInstances
} from "../config/Variables";
import {SourceData} from "../components/misc/SourceData";
import {Class} from "../components/misc/Class";


export class DiagramCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.readOnly = false;
        this.engine = new DiagramEngine();
        this.engine.setDiagramModel(new OntoDiagramModel(this.props, this));
        this.registerFactories();
        this.engine.getDiagramModel().setOffset(Defaults.offset.x,Defaults.offset.y);
    }

    registerFactories() {
        this.engine.registerNodeFactory(new NodeCommonFactory(this.engine.getDiagramModel()));
        this.engine.registerLinkFactory(new LinkCommonFactory());
        this.engine.registerLabelFactory(new LabelCommonFactory());
        this.engine.registerPortFactory(new NodeCommonPortFactory());
    }

    updatePanel() {
        let selected = this.engine.getDiagramModel().getSelectedItems();
        for (let i = 0; i < selected.length; i++) {
            if (!selected[i].selected) {
                selected.splice(i, 1);
            }
        }
        if (selected.length === 1) {
            this.props.handleChangePanelObject(selected[0]);
        } else if (selected[0] instanceof NodeCommonModel) {
            this.props.handleChangePanelObject(selected[0]);
        } else {
            this.props.handleChangePanelObject(null);
        }

    }

    setReadOnly(value: boolean){
        this.readOnly = value;
    }

    nullPanel() {
        this.props.handleChangePanelObject(null);
    }

    serialize() {
        let saveData = JSON.stringify(this.engine.getDiagramModel().serializeDiagram());
        return saveData;
    }

    showContextMenu(event: MouseEvent, link: LinkCommonModel) {
        event.preventDefault();
        this.props.showContextMenu(event.clientX, event.clientY, link);

    }
    /*
    export() {
        const rdf = require('rdf-ext');
        const SerializerNtriples = require('@rdfjs/serializer-ntriples');

        let dataset = rdf.dataset();
        let diagram = this.engine.getDiagramModel().serializeDiagram();
        for (let node of diagram.nodes) {
            dataset.add(rdf.quad(rdf.namedNode(node.rdf), rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), rdf.namedNode("http://www.w3.org/2002/07/owl#Class")));
            dataset.add(rdf.quad(rdf.namedNode(node.rdf), rdf.namedNode("http://www.w3.org/2000/01/rdf-schema#label"), rdf.literal(node.stereotype)));
        }
        const serializerNtriples = new SerializerNtriples();
        const input = dataset.toStream();
        const output = serializerNtriples.import(input);
        output.on('data', ntriples => {
            console.log(ntriples.toString());
        });
    }
    */
    deserialize(diagramSerialization: string) {
        let diagram = (function(raw) {
            try {
                return JSON.parse(raw);
            } catch (err) {
                console.log(err);
                return false;
            }
        })(diagramSerialization);
        if (!diagram){
            let err =  Error(Locale.loadUnsuccessful);
            console.log(err);
            return false;
        }
        try {
            this.registerFactories();
            let model = new OntoDiagramModel(this.props, this);
            model.deSerializeDiagram(diagram, this.engine);
            this.engine.setDiagramModel(model);
        } catch (err) {
            console.log(err);
            return false;
        }
        this.forceUpdate();
        return true;
    }

    setName(str: string) {
        this.props.setName(str);
    }

    render() {
        return (
            <div
                onDrop={event => {
                    try {
                        const data = JSON.parse(event.dataTransfer.getData("newNode"));
                        const points = this.engine.getRelativeMousePoint(event);
                        if (data.newNode){
                            let name = Locale.untitled + " " + data.stereotype.name;
                            let cls = new Class(data.stereotype, name);
                            let node = new NodeCommonModel(name, cls, data.stereotype, this.engine.getDiagramModel());
                            ClassPackage[Locale.root].push(cls);
                            node.x = points.x;
                            node.y = points.y;
                            this.engine.getDiagramModel().addNode(node);
                        } else {
                            let cls = data.class;
                            let name = data.class.name;
                            if (data.modelClass){
                                let node = new NodeCommonModel(name, undefined, cls, this.engine.getDiagramModel());
                                node.x = points.x;
                                node.y = points.y;
                                this.engine.getDiagramModel().addNode(node);
                            } else {
                                if (cls.id in HiddenInstances){
                                    let node = this.engine.getNodeFactory("common").getNewInstance();
                                    node.setParent(this.engine.getDiagramModel());
                                    node.model = this.engine.getDiagramModel();
                                    node.deSerialize(HiddenInstances[cls.id], this.engine);
                                    node.setHeight();
                                    for (let port in node.getPorts()){
                                        node.getPorts()[port].model = this.engine.getDiagramModel();
                                    }
                                    node.x = points.x;
                                    node.y = points.y;
                                    this.engine.getDiagramModel().addNode(node);
                                    delete HiddenInstances[cls.id];
                                    let nodes = this.engine.getDiagramModel().getNodes();
                                    for (let rel in HiddenRelationships){
                                        let link = HiddenRelationships[rel];
                                        if (link.getTargetNode().getID() in nodes && link.getSourceNode().getID() in nodes){
                                            this.engine.getDiagramModel().addLink(link);
                                            link = this.engine.getDiagramModel().getLinks()[link.getID()];
                                            let sourcePort = nodes[link.getSourceNode().getID()].getPorts()[link.getSourcePort().getName()];
                                            let targetPort = nodes[link.getTargetNode().getID()].getPorts()[link.getTargetPort().getName()];
                                            link.setSourcePort(sourcePort);
                                            link.setTargetPort(targetPort);
                                            link.updateLocationAfterPaste(points.x, points.y, cls.id === sourcePort.getNode().getID() ? "source" : "target");
                                        }
                                        delete HiddenRelationships[rel];
                                    }
                                }
                            }
                        }
                        this.forceUpdate();
                    } catch(err) {
                        console.log(err);
                    }
                }}
                onDragOver={event => {
                    event.preventDefault();
                }}>
                <OntoDiagramWidget
                    diagramEngine={this.engine}
                    allowLooseLinks={false}
                    smartRouting={false}
                    deleteKeys={this.readOnly ? [] : [46]}
                />
            </div>
        );
    }
}
;