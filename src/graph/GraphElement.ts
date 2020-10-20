import * as joint from "jointjs";

export var graphElement = joint.dia.Element.define('custom.graphElement', {
        attrs: {
            body: {
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFF'
            },
            label: {
                textVerticalAnchor: 'top',
                textAnchor: 'middle',
                y: 5,
                fontSize: 16
            },
            labelAttrs: {
                textVerticalAnchor: 'top',
                textAnchor: 'start',
                fontSize: 14,
                y: 25,
                x: 2
            },
            schemeColor: {
                ref: 'body',
                strokeWidth: 0,
                width: 3,
                refX: 1,
                refY: 1
            }
        }
    }, {
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label'
            },
            {
                tagName: 'text',
                selector: 'labelAttrs'
            },
            {
                tagName: 'rect',
                selector: 'schemeColor'
            }
        ]
    },
);
