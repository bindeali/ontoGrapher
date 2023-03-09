import React from "react";
import { AppSettings, WorkspaceLinks } from "../../../../config/Variables";
import { getLabelOrBlank } from "../../../../function/FunctionGetVars";
import { getVocabularyShortLabel } from "@opendata-mvcr/assembly-line-shared";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { CacheSearchVocabularies } from "../../../../datatypes/CacheSearchResults";
import _ from "underscore";
import { getOtherConnectionElementID } from "../../../../function/FunctionLink";
import { Representation } from "../../../../config/Enum";
import Connection from "./Connection";
import { CacheConnection } from "../../../../types/CacheConnection";

interface Props {
  connection: CacheConnection;
  projectLanguage: string;
  update?: Function;
  elemID: string;
  selected: boolean;
  selection: string[];
  updateSelection?: (ids: string[]) => void;
  performTransaction: (...queries: string[]) => void;
}

export default class ConnectionCache extends React.Component<Props> {
  getVocabularyLabel(vocabulary: string): string {
    return vocabulary in CacheSearchVocabularies
      ? getLabelOrBlank(
          CacheSearchVocabularies[vocabulary].labels,
          this.props.projectLanguage
        )
      : "";
  }

  transferConnectionToEvent(event: DragEvent) {
    const add =
      AppSettings.representation === Representation.FULL
        ? [this.props.connection.target.iri]
        : [this.props.connection.target.iri, this.props.connection.link];
    event?.dataTransfer?.setData(
      "newClass",
      JSON.stringify({
        id: _.uniq(
          this.props.selection
            .filter((link) => link in WorkspaceLinks)
            .map((link) => getOtherConnectionElementID(link, this.props.elemID))
        ),
        iri: _.uniq(
          this.props.selection
            .filter((link) => !(link in WorkspaceLinks))
            .concat(...add)
        ),
      })
    );
  }

  render() {
    return (
      <OverlayTrigger
        placement={"left"}
        overlay={
          <Popover id={"termDetailPopover"}>
            <Popover.Header as="h3">
              {getLabelOrBlank(
                this.props.connection.target.labels,
                this.props.projectLanguage
              )}
              &nbsp;
              <Badge className={"wrap"} bg={"secondary"}>
                {this.getVocabularyLabel(
                  this.props.connection.target.vocabulary
                )}
              </Badge>
            </Popover.Header>
            <Popover.Body>
              {
                this.props.connection.target.definitions[
                  this.props.projectLanguage
                ]
              }
            </Popover.Body>
          </Popover>
        }
      >
        {
          <Connection
            onDragStart={(event: DragEvent) => {
              if (this.props.update) this.transferConnectionToEvent(event);
            }}
            onDragEnd={() => {
              if (this.props.update) this.props.update();
            }}
            onClick={() => {
              if (this.props.updateSelection)
                this.props.updateSelection(
                  AppSettings.representation === Representation.FULL
                    ? [this.props.connection.target.iri]
                    : [
                        this.props.connection.target.iri,
                        this.props.connection.link,
                      ]
                );
            }}
            selected={this.props.selected}
            link={this.props.connection.link}
            direction={this.props.connection.direction === "target"}
            selectedLanguage={this.props.projectLanguage}
            backgroundColor={"white"}
            performTransaction={this.props.performTransaction}
            elementLabel={
              <span>
                {getLabelOrBlank(
                  this.props.connection.target.labels,
                  this.props.projectLanguage
                )}
                &nbsp;
                <Badge bg={"secondary"}>
                  {getVocabularyShortLabel(
                    this.props.connection.target.vocabulary
                  )}
                </Badge>
              </span>
            }
            readOnly={true}
          />
        }
      </OverlayTrigger>
    );
  }
}
