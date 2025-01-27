import React from "react";
import { Nav } from "react-bootstrap";
import { Locale } from "../../../config/Locale";
import { AppSettings } from "../../../config/Variables";

interface Props {
  validate: Function;
}

export default class MenuPanelValidate extends React.Component<Props> {
  render() {
    return (
      <div className={"inert"}>
        <Nav.Link onClick={() => this.props.validate()}>
          {Locale[AppSettings.interfaceLanguage].validate}
        </Nav.Link>
      </div>
    );
  }
}
