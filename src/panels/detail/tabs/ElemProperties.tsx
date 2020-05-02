import React from 'react';
import * as LocaleMain from "../../../locale/LocaleMain.json";
import * as LocaleMenu from "../../../locale/LocaleMenu.json";
import TableList from "../../../components/TableList";
// @ts-ignore
import {RIEInput} from "riek";
import {AttributeObject} from "../../../datatypes/AttributeObject";
import {AttributeTypePool, ProjectElements} from "../../../config/Variables";
import {Tab} from 'react-bootstrap';

interface Props {
    changes: Function;
    elemID: string;
}

interface State {
    inputProperties: AttributeObject[];
}

export default class ElemProperties extends React.Component<Props, State> {

    handleChangeNameProperty(event: { textarea: string }, pos: number) {
        let attrs = this.state.inputProperties;
        attrs[pos].name = event.textarea;
        this.setState({inputProperties: attrs});
        this.props.changes();
    }

    prepareDetails() {
        this.setState({
            inputProperties: ProjectElements[this.props.elemID].properties
        })
    }

    save() {
        ProjectElements[this.props.elemID].properties = this.state.inputProperties;
    }

    render() {
        return (
            <Tab eventKey={LocaleMain.properties} title={LocaleMain.properties}>
                <TableList headings={[LocaleMenu.title, LocaleMenu.attributeType, LocaleMenu.value]}>
                    {this.state.inputProperties.map((prop, i) => (<tr key={i}>
                        <td>
                            {AttributeTypePool[prop.type].name}
                        </td>
                        <td>
                            {AttributeTypePool[prop.type].array ? "[" + AttributeTypePool[prop.type].type + "]" : AttributeTypePool[prop.type].type}
                        </td>
                        <td>
                            <RIEInput
                                className={"rieinput"}
                                value={prop.name.length > 0 ? prop.name : "<blank>"}
                                change={(event: { textarea: string }) => {
                                    this.handleChangeNameProperty(event, i);
                                }}
                                propName="textarea"
                            />
                        </td>
                    </tr>))}
                </TableList>
            </Tab>
        );
    }
}