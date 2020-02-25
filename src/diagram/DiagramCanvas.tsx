// @ts-nocheck
import React from 'react';
import * as joint from 'jointjs';
import {DiagramModel} from "./DiagramModel";

interface DiagramCanvasProps {
    model: DiagramModel;
}

interface DiagramPropsState {

}

export default class DiagramCanvas extends React.Component<DiagramCanvasProps, DiagramPropsState>{
    private readonly canvasRef: React.RefObject<HTMLDivElement>;
    private paper: joint.dia.Paper | undefined;

    constructor(props: DiagramCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(): void {
        const node = (this.canvasRef.current! as HTMLElement);

        this.paper = new joint.dia.Paper({
            el: node,
            model: this.props.model.getGraph(),
            width: "auto",
            height: "100vh",
            gridSize: 1,
            linkPinning: false,
            background: {
                color: 'rgba(0,0,0,0.1)'
            }
        });

        var uml = joint.shapes.uml;

        // @ts-ignore
        var classes = {
            mammal: new uml.Interface({
                position: { x:300  , y: 50 },
                size: { width: 240, height: 100 },
                name: 'Mammal',
                attributes: ['dob: Date'],
                methods: ['+ setDateOfBirth(dob: Date): Void','+ getAgeAsDays(): Numeric'],
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#feb662',
                        stroke: '#ffffff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#fdc886',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#fdc886',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-text': {
                        ref: '.uml-class-attrs-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    },
                    '.uml-class-methods-text': {
                        ref: '.uml-class-methods-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }

                }
            }),

            person: new uml.Abstract({
                position: { x:300  , y: 300 },
                size: { width: 260, height: 100 },
                name: 'Person',
                attributes: ['firstName: String','lastName: String'],
                methods: ['+ setName(first: String, last: String): Void','+ getName(): String'],
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#68ddd5',
                        stroke: '#ffffff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#9687fe',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#9687fe',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-text, .uml-class-attrs-text': {
                        fill: '#fff'
                    }
                }
            }),

            bloodgroup: new uml.Class({
                position: { x:20  , y: 190 },
                size: { width: 220, height: 100 },
                name: 'BloodGroup',
                attributes: ['bloodGroup: String'],
                methods: ['+ isCompatible(bG: String): Boolean'],
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#ff8450',
                        stroke: '#fff',
                        'stroke-width': 0.5,
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-text': {
                        ref: '.uml-class-attrs-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    },
                    '.uml-class-methods-text': {
                        ref: '.uml-class-methods-rect',
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }
                }
            }),

            address: new uml.Class({
                position: { x:630  , y: 190 },
                size: { width: 160, height: 100 },
                name: 'Address',
                attributes: ['houseNumber: Integer','streetName: String','town: String','postcode: String'],
                methods: [],
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#ff8450',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-text': {
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }
                }

            }),

            man: new uml.Class({
                position: { x:200  , y: 500 },
                size: { width: 180, height: 50 },
                name: 'Man',
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#ff8450',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    }
                }
            }),

            woman: new uml.Class({
                position: { x:450  , y: 500 },
                size: { width: 180, height: 50 },
                name: 'Woman',
                methods: ['+ giveABrith(): Person []'],
                attrs: {
                    '.uml-class-name-rect': {
                        fill: '#ff8450',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-attrs-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-rect': {
                        fill: '#fe976a',
                        stroke: '#fff',
                        'stroke-width': 0.5
                    },
                    '.uml-class-methods-text': {
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }
                }
            })


        };

        Object.keys(classes).forEach((key)=> {
            this.props.model.getGraph().addCell(classes[key]);
        });

        var relations = [
            new uml.Generalization({ source: { id: classes.man.id }, target: { id: classes.person.id }}),
            new uml.Generalization({ source: { id: classes.woman.id }, target: { id: classes.person.id }}),
            new uml.Implementation({ source: { id: classes.person.id }, target: { id: classes.mammal.id }}),
            new uml.Aggregation({ source: { id: classes.person.id }, target: { id: classes.address.id }}),
            new uml.Composition({ source: { id: classes.person.id }, target: { id: classes.bloodgroup.id }})
        ];

        Object.keys(relations).forEach((key)=> {
            this.props.model.getGraph().addCell(relations[key]);
        });

    }
    render(){
        return(<div className={"canvas"} ref={this.canvasRef} />);
    }
}