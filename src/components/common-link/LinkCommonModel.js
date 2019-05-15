import React from 'react';
import {DefaultLabelModel, DefaultLinkModel, DiagramEngine} from 'storm-react-diagrams';
import {OntoDiagramModel} from "../../diagram/OntoDiagramModel";
import {Locale} from "../../config/Locale";
import * as _ from "lodash";
import {LanguagePool} from "../../config/Variables";
import {LinkPool} from "../../config/LinkVariables";
import {Constraint} from "../misc/Constraint";

export class LinkCommonModel extends DefaultLinkModel {
    width: number;
    color: string;
    curvyness: number;
    linkType: string;
    model: OntoDiagramModel;
    descriptor: boolean;
    dashed: boolean;
    sourceCardinality: string;
    targetCardinality: string;
    linkEnd: string;
    labeled: boolean;

    constructor(model: OntoDiagramModel) {
        super();
        this.type = "link-common";
        this.width = 3;
        this.curvyness = 0;
        this.model = model;
        this.descriptor = false;
        this.dashed = false;
        this.names = {};
        this.notes = {};
        this.constraints = [];
        this.color = "black";
        this.sourceCardinality = Locale.none;
        this.targetCardinality = Locale.none;
        for (let language in LanguagePool) {
            if (this.names[language] === undefined) {
                this.names[language] = "";
            }
        }
        if (this.model instanceof OntoDiagramModel) {
            this.linkType = this.model.selectedLink;
            this.addLabel(this.model.firstCardinality === Locale.none ? "" : this.model.firstCardinality);
            this.addLabel("");
            this.addLabel(this.model.secondCardinality === Locale.none ? "" : this.model.secondCardinality);
            this.addLabel("");
            if (LinkPool[this.linkType][1]){
                this.addDescriptorLabel();
            }
            this.linkEnd = LinkPool[this.linkType][0];
            this.labeled = LinkPool[this.linkType][1];
            this.dashed = LinkPool[this.linkType][2];
            this.constraints = LinkPool[this.linkType][3];
        }
        this.addListener({
            selectionChanged: event => {
                this.model.updatePanel();
            },
            entityRemoved: event => {
                this.model.nullPanel();
            }
        });
    }

    addDescriptorLabel() {
        let labelText = "«" + this.linkType.toLowerCase() + "»";
        this.labels[1].setLabel(labelText);
        this.descriptor = true;
    }

    createConstraint(constraint: Constraint){
        this.constraints.push(constraint);
    }

    removeConstraint(constraint: Constraint){
        this.constraints.splice(this.constraints.indexOf(constraint),1);
    }

    removeConstraintByIndex(index: number){
        this.constraints.splice(index,1);
    }

    setDashedLine() {
        this.dashed = true;
    }

    serialize() {
        return _.merge(super.serialize(), {
            width: this.width,
            color: this.color,
            curvyness: this.curvyness,
            linkType: this.linkType,
            name: this.name,
            names: this.names,
            sourceCardinality: this.sourceCardinality,
            targetCardinality: this.targetCardinality,
            dashed: this.dashed,
            notes: this.notes,
            constraints: this.constraints,
            descriptor: this.descriptor,
            linkEnd: this.linkEnd,
            labeled: this.labeled
        });
    }

    deSerialize(ob, engine: DiagramEngine) {
        super.deSerialize(ob, engine);
        this.color = ob.color;
        this.width = ob.width;
        this.curvyness = ob.curvyness;
        this.linkType = ob.linkType;
        this.name = ob.name,
        this.names = ob.names;
        this.sourceCardinality = ob.sourceCardinality;
        this.targetCardinality = ob.targetCardinality;
        this.dashed = ob.dashed;
        this.notes = ob.notes;
        this.constraints = [];
        for (let constraint of ob.constraints){
            this.constraints.push(new Constraint(constraint.statement,constraint.linkType));
        }
        this.descriptor = ob.descriptor;
        this.linkEnd = ob.linkEnd;
        this.labeled = ob.labeled;
    }

    setLabel(str: string) {
        if (this.labels.length >= 1) {
            let newLabel = new DefaultLabelModel();
            newLabel.setLabel(str);
            this.labels = [newLabel];
        } else {
            this.addLabel(str);
        }
    }

    setNameLanguage(language: string) {
        this.labels[3].setLabel(this.names[language]);
    }

    setFirstCardinality(str: string) {
        this.labels[0].setLabel(str);
    }

    setName(str: string, language: string) {
        this.names[language] = str;
    }


    setSecondCardinality(str: string) {
        this.labels[2].setLabel(str);
    }

    getSourceCardinality(){
        return this.sourceCardinality;
    }

    getTargetCardinality(){
        return this.targetCardinality;
    }

    getLinktype(){
        return this.linkType;
    }

    getName(language: string){
        return this.names[language];
    }

    getSourceNode(){
        return this.getSourcePort().getParent();
    }

    getTargetNode(){
        return this.getTargetPort().getParent();
    }
}
