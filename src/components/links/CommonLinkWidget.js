import {DefaultLinkWidget, Toolkit} from "storm-react-diagrams";
import React from "react";

export class CommonLinkWidget extends DefaultLinkWidget {

    getAngle(px1, py1, px2, py2) {
        const x = px2-px1;
        const y = py2-py1;
        const hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
        let cos = x/hypotenuse;
        let radian = Math.acos(cos);
        let angle = 180/(Math.PI/radian);
        if (y<0) {
            angle = -angle;
        } else if ((y == 0) && (x<0)) {
            angle = 180;
        }
        return angle;
    }

    generateEnd(pointIndex: number): JSX.Element {
        let x = this.props.link.points[pointIndex].x;
        let y = this.props.link.points[pointIndex].y;
        const pointOne = this.props.link.points[pointIndex-1];
        const pointTwo = this.props.link.points[pointIndex];
        let angle = 0;
        if (pointOne != null){
            angle = this.getAngle(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y);
        }


        return (
            <g key={"point-" + this.props.link.points[pointIndex].id}>
                <circle
                    onMouseLeave={() => {
                        this.setState({ selected: false });
                    }}
                    onMouseEnter={() => {
                        this.setState({ selected: true });
                    }}
                    data-id={this.props.link.points[pointIndex].id}
                    data-linkid={this.props.link.id}
                    cx={x}
                    cy={y}
                    r={5}
                    opacity={.5}
                    className={
                        "point " +
                        this.bem("__point") +
                        (this.props.link.points[pointIndex].isSelected() ? this.bem("--point-selected") : "")
                    }
                />


            </g>
        );
    }
    /*
    <polygon
                    x={this.props.link.points[pointIndex].x-20}
                    y={this.props.link.points[pointIndex].y+12}
                    transform={`rotate(${angle}, ${this.props.link.points[pointIndex].x}, ${this.props.link.points[pointIndex].y})`}
                    points={`${this.props.link.points[pointIndex].x - 10},${this.props.link.points[pointIndex].y - 8} ${this.props.link.points[pointIndex].x+3},${this.props.link.points[pointIndex].y} ${this.props.link.points[pointIndex].x - 10},${this.props.link.points[pointIndex].y + 8}`}
                />

     */

    generatePoint(pointIndex: number): JSX.Element {
        let x = this.props.link.points[pointIndex].x;
        let y = this.props.link.points[pointIndex].y;

        return (
            <g key={"point-" + this.props.link.points[pointIndex].id}>
                <circle
                    onMouseLeave={() => {
                        this.setState({ selected: false });
                    }}
                    onMouseEnter={() => {
                        this.setState({ selected: true });
                    }}
                    data-id={this.props.link.points[pointIndex].id}
                    data-linkid={this.props.link.id}
                    cx={x}
                    cy={y}
                    r={5}
                    opacity={.5}
                    className={
                        "point " +
                        this.bem("__point") +
                        (this.props.link.points[pointIndex].isSelected() ? this.bem("--point-selected") : "")
                    }
                />
            </g>
        );
    }

    render() {
        const { diagramEngine } = this.props;
        if (!diagramEngine.nodesRendered) {
            return null;
        }

        //ensure id is present for all points on the path
        var points = this.props.link.points;
        var paths = [];

        if (this.isSmartRoutingApplicable()) {
            // first step: calculate a direct path between the points being linked
            const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

            const routingMatrix = diagramEngine.getRoutingMatrix();
            // now we need to extract, from the routing matrix, the very first walkable points
            // so they can be used as origin and destination of the link to be created
            const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);

            if (smartLink) {
                const { start, end, pathToStart, pathToEnd } = smartLink;

                // second step: calculate a path avoiding hitting other elements
                const simplifiedPath = this.pathFinding.calculateDynamicPath(
                    routingMatrix,
                    start,
                    end,
                    pathToStart,
                    pathToEnd
                );

                paths.push(
                    //smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
                    this.generateLink(
                        Toolkit.generateDynamicPath(simplifiedPath),
                        {
                            onMouseDown: event => {
                                this.addPointToLink(event, 1);
                            }
                        },
                        "0"
                    )
                );
            }
        }

        // true when smart routing was skipped or not enabled.
        // See @link{#isSmartRoutingApplicable()}.
        if (paths.length === 0) {
            if (points.length === 2) {
                var isHorizontal = Math.abs(points[0].x - points[1].x) > Math.abs(points[0].y - points[1].y);
                var xOrY = isHorizontal ? "x" : "y";

                //draw the smoothing
                //if the points are too close, just draw a straight line
                var margin = 50;
                if (Math.abs(points[0][xOrY] - points[1][xOrY]) < 50) {
                    margin = 5;
                }

                var pointLeft = points[0];
                var pointRight = points[1];

                //some defensive programming to make sure the smoothing is
                //always in the right direction
                if (pointLeft[xOrY] > pointRight[xOrY]) {
                    pointLeft = points[1];
                    pointRight = points[0];
                }

                paths.push(
                    this.generateLink(
                        Toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness),
                        {
                            onMouseDown: event => {
                                this.addPointToLink(event, 1);
                            }
                        },
                        "0"
                    )
                );

                // draw the link as dangeling
                //if (this.props.link.targetPort === null) {
                //    paths.push(this.generatePoint(1));
                //}
                paths.push(this.generateEnd(1));
            } else {
                //draw the multiple anchors and complex line instead
                for (let j = 0; j < points.length - 1; j++) {
                    paths.push(
                        this.generateLink(
                            Toolkit.generateLinePath(points[j], points[j + 1]),
                            {
                                "data-linkid": this.props.link.id,
                                "data-point": j,
                                onMouseDown: (event: MouseEvent) => {
                                    this.addPointToLink(event, j + 1);
                                }
                            },
                            j
                        )
                    );
                }

                //render the circles
                for (var i = 1; i < points.length - 1; i++) {
                    paths.push(this.generatePoint(i));
                }
                paths.push(this.generateEnd(points.length - 1));

                if (this.props.link.targetPort === null) {
                    paths.push(this.generateEnd(points.length - 1));
                }
            }
        }

        this.refPaths = [];
        return (
            <g {...this.getProps()}>
                {paths}
                {_.map(this.props.link.labels, labelModel => {
                    return this.generateLabel(labelModel);
                })}
            </g>
        );
    }
}