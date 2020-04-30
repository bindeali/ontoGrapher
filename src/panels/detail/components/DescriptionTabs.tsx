import React from 'react';
import {Form, Tab, Tabs} from 'react-bootstrap';
import {Languages} from "../../../config/Variables";

interface Props {
    descriptions: { [key: string]: string };
    readOnly: boolean;
}

export default class DescriptionTabs extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (<Tabs id={"descriptionTabs"}>
            {Object.keys(this.props.descriptions).map((lang, i) =>
                <Tab eventKey={i} title={Languages[lang]}>
                    <Form.Control
                        as={"textarea"}
                        rows={3}
                        disabled={this.props.readOnly}
                        value={this.props.descriptions[lang]}
                    />
                </Tab>
            )}
        </Tabs>);
    }
}