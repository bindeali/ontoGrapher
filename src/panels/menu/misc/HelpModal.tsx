import React from 'react';
import {Button, Modal} from "react-bootstrap";
import {ProjectSettings} from "../../../config/Variables";
import {Locale} from "../../../config/Locale";
import HelpMain from "../help/HelpMain";
import {helpModal} from "../../../locale/help";

interface Props {
    modal: boolean;
    close: Function;
}

interface State {
    topic: string;
}

export default class HelpModal extends React.Component<Props, State> {
    private readonly topics: { [key: string]: { title: string, page: JSX.Element } }

    constructor(props: Props) {
        super(props);
        this.state = {
            topic: "main"
        }
        this.topics = {
            "main": {title: helpModal[ProjectSettings.viewLanguage].intro.title, page: <HelpMain/>}
        }
    }

    render() {
        return (<Modal centered show={this.props.modal} keyboard scrollable size={"lg"}
                       onEscapeKeyDown={() => this.props.close()}>
            <Modal.Header>
                <Modal.Title>{Locale[ProjectSettings.viewLanguage].help}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*<Form.Control as="select" onChange={(event) => this.setState({topic: event.currentTarget.value})}>*/}
                {/*    {Object.keys(this.topics).map(topic => <option key={topic} value={topic}>{this.topics[topic].title}</option>)}*/}
                {/*</Form.Control>*/}
                {this.topics[this.state.topic].page}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    this.props.close();
                }}>{Locale[ProjectSettings.viewLanguage].close}</Button>
            </Modal.Footer>
        </Modal>);
    }
}