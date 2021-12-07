import React from "react";
import {
  AppSettings,
  Diagrams,
  WorkspaceElements,
  WorkspaceLinks,
} from "../../config/Variables";
import { Locale } from "../../config/Locale";
import { addDiagram } from "../../function/FunctionCreateVars";
import { updateCreateDiagram } from "../../queries/update/UpdateDiagramQueries";
import { Representation } from "../../config/Enum";

interface Props {
  update: Function;
  performTransaction: (...queries: string[]) => void;
}

interface State {}

export default class DiagramAdd extends React.Component<Props, State> {
  addDiagram() {
    const index =
      Diagrams.push(
        addDiagram(
          Locale[AppSettings.interfaceLanguage].untitled,
          true,
          Representation.COMPACT,
          Diagrams.length
        )
      ) - 1;
    Object.keys(WorkspaceElements).forEach(
      (elem) => (WorkspaceElements[elem].hidden[index] = true)
    );
    Object.keys(WorkspaceLinks).forEach(
      (link) => (WorkspaceLinks[link].vertices[index] = [])
    );
    this.props.performTransaction(updateCreateDiagram(index));
    this.props.update();
  }

  render() {
    return (
      <div className={"diagramTab"}>
        <button
          className={"buttonlink nounderline"}
          onClick={() => {
            this.addDiagram();
          }}
        >
          <span role="img" aria-label={""}>
            ➕
          </span>
        </button>
      </div>
    );
  }
}
