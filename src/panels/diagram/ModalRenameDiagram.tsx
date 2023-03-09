import React, { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { Locale } from "../../config/Locale";
import { AppSettings, Diagrams } from "../../config/Variables";
import {
  updateCreateDiagram,
  updateDiagram,
} from "../../queries/update/UpdateDiagramQueries";

type Props = {
  diagram: string;
  modal: boolean;
  close: () => void;
  update: () => void;
  performTransaction: (...queries: string[]) => void;
};

const formInputID = "modalRenameDiagramInput";

export const ModalRenameDiagram: React.FC<Props> = (props: Props) => {
  const [diagramName, setDiagramName] = useState<string>("");

  const renameDiagram: () => void = () => {
    if (diagramName.length > 0) {
      const queries = [];
      Diagrams[props.diagram].name = diagramName;
      if (!Diagrams[props.diagram].saved) {
        Diagrams[props.diagram].saved = true;
        queries.push(updateCreateDiagram(props.diagram));
      }
      queries.push(updateDiagram(props.diagram));
      props.performTransaction(...queries);
      props.update();
    } else
      console.warn(
        `Attempted to rename diagram ${props.diagram} to an empty string.`
      );
  };

  return (
    <Modal
      centered
      show={props.modal}
      keyboard
      onEscapeKeyDown={() => props.close()}
      onEntering={() => {
        setDiagramName(Diagrams[props.diagram].name);
        const elem = document.getElementById(formInputID);
        if (elem) elem.focus();
      }}
    >
      <Modal.Header>
        <Modal.Title>
          Přejmenovat diagram{" "}
          {props.diagram in Diagrams && Diagrams[props.diagram].name}
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <InputGroup hasValidation>
            <Form.Control
              required
              type="text"
              value={diagramName}
              onChange={(evt) => setDiagramName(evt.currentTarget.value)}
            />
            <Form.Control.Feedback type="invalid">
              Prosíme, vyberte název.
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="light"
            className="plainButton"
            onClick={() => {
              renameDiagram();
              props.close();
            }}
          >
            {Locale[AppSettings.interfaceLanguage].confirm}
          </Button>
          <Button
            variant="light"
            className="plainButton"
            onClick={() => {
              props.close();
            }}
          >
            {Locale[AppSettings.interfaceLanguage].close}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
