import React from 'react';
import {Button, Form, Tab} from 'react-bootstrap';
import TableList from "../../../components/TableList";
import IRILink from "../../../components/IRILink";
import {getStereotypeOrVocabElem} from "../../../function/FunctionGetVars";
import * as LocaleMain from "../../../locale/LocaleMain.json";
import * as LocaleMenu from "../../../locale/LocaleMenu.json";
import {Stereotypes} from "../../../config/Variables";
import {getName} from "../../../function/FunctionEditVars";
import DescriptionTabs from "../components/DescriptionTabs";
import LabelTable from "../components/LabelTable";

interface Props {
    eventKey: number;
    changes: Function;
    projectLanguage: string;
    headers: { [key: string]: { [key: string]: string } };
    readOnly: boolean;
    id: string;
}

interface State {
    inputTypes: string[];
    inputLabels: { [key: string]: string };
    inputDescriptions: { [key: string]: string };
    inputSchemes: { [key: string]: string };
    formNewStereotype: string;
}

export default class ElemDescription extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Tab eventKey={this.props.eventKey} title={LocaleMain.description}>
                <h5>{this.props.headers.stereotype[this.props.projectLanguage]}</h5>
                <TableList>
                    {this.state.inputTypes.map(iri =>
                        <tr key={iri}>
                            <td>
                                <IRILink
                                    label={getStereotypeOrVocabElem(iri).labels[this.props.projectLanguage]}
                                    iri={iri}/>
                                &nbsp;
                                {this.state.inputTypes.length === 1 && !(this.props.readOnly) ? "" :
                                    <button className={"buttonlink"} onClick={() => {
                                        let result = this.state.inputTypes;
                                        result.splice(result.indexOf(iri), 1);
                                        this.setState({
                                            inputTypes: result
                                        });
                                        this.props.changes();
                                    }}>
                                        {LocaleMenu.deleteProjectName}</button>}
                            </td>
                        </tr>
                    )}
                    {this.props.readOnly ? <tr>
                        <td>
                            <Form inline>
                                <Form.Control size="sm" as="select" value={this.state.formNewStereotype}
                                              onChange={(event) => {
                                                  this.setState({formNewStereotype: event.currentTarget.value})
                                              }}>
                                    {Object.keys(Stereotypes).map((stereotype) => (
                                        <option key={stereotype}
                                                value={stereotype}>{getName(stereotype, this.props.projectLanguage)}</option>))}
                                </Form.Control>
                                <Button size="sm" onClick={() => {
                                    let result = this.state.inputTypes;
                                    if (!(this.state.inputTypes.includes(this.state.formNewStereotype))) {
                                        result.push(this.state.formNewStereotype);
                                        this.setState({
                                            inputTypes: result,
                                            formNewStereotype: Object.keys(Stereotypes)[0]
                                        })
                                        this.props.changes();
                                    }

                                }}>{LocaleMain.add}</Button>
                            </Form>
                        </td>
                    </tr> : ""}
                </TableList>

                <h5>{<IRILink label={this.props.headers.labels[this.props.projectLanguage]}
                              iri={"http://www.w3.org/2004/02/skos/core#prefLabel"}/>}</h5>
                <LabelTable labels={this.state.inputLabels} readOnly={this.props.readOnly}/>
                <h5>{<IRILink label={this.props.headers.inScheme[this.props.projectLanguage]}
                              iri={"http://www.w3.org/2004/02/skos/core#inScheme"}/>}</h5>
                <LabelTable labels={this.state.inputSchemes} readOnly={this.props.readOnly}/>
                {Object.keys(this.state.inputDescriptions).length > 0 ?
                    <h5>{<IRILink label={this.props.headers.definition[this.props.projectLanguage]}
                                  iri={"http://www.w3.org/2004/02/skos/core#definition"}/>}</h5> : ""}
                <DescriptionTabs descriptions={this.state.inputDescriptions} readOnly={this.props.readOnly}/>
            </Tab>
        );
    }
}