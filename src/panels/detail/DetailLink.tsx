import React from 'react';
import {
    CardinalityPool,
    Languages,
    Links,
    ProjectElements,
    ProjectLinks,
    ProjectSettings,
    Schemes,
    VocabularyElements
} from "../../config/Variables";
import {Form} from "react-bootstrap";
import TableList from "../../components/TableList";
import * as LocaleMain from "../../locale/LocaleMain.json";
import * as LocaleMenu from "../../locale/LocaleMenu.json";
import IRIlabel from "../../components/IRIlabel";
import IRILink from "../../components/IRILink";
import {ResizableBox} from "react-resizable";
import {graph} from "../../graph/Graph";
import DescriptionTabs from "./components/DescriptionTabs";
import {getLabelOrBlank, getLinkOrVocabElem} from "../../function/FunctionGetVars";
import {updateConnections, updateProjectLink} from "../../interface/TransactionInterface";
import {getUnderlyingFullConnections, setLabels, unHighlightAll} from "../../function/FunctionGraph";
import {parsePrefix} from "../../function/FunctionEditVars";
import {Cardinality} from "../../datatypes/Cardinality";
import {LinkType, Representation} from "../../config/Enum";

interface Props {
    projectLanguage: string;
    headers: { [key: string]: { [key: string]: string } }
    save: Function;
    handleChangeLoadingStatus: Function;
    handleWidth: Function;
    error: boolean;
}

interface State {
    id: string,
    iri: string,
    sourceCardinality: string;
    targetCardinality: string;
    changes: boolean;
    readOnly: boolean;
}

export default class DetailLink extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            id: "",
            iri: Object.keys(Links)[0],
            sourceCardinality: "0",
            targetCardinality: "0",
            changes: false,
            readOnly: false
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevState !== this.state && (this.state.changes)) {
            this.save();
        }
    }

    prepareLinkOptions() {
        let result: JSX.Element[] = [];
        if (ProjectSettings.representation === Representation.FULL) {
            for (let iri in Links) {
                if (Links[iri].type === LinkType.DEFAULT)
                    result.push(<option key={iri}
                                        value={iri}>{getLabelOrBlank(Links[iri].labels, this.props.projectLanguage)}</option>)
            }
        } else if (ProjectSettings.representation === Representation.COMPACT) {
            for (let iri in VocabularyElements) {
                if ((VocabularyElements[iri].types.includes(parsePrefix("z-sgov-pojem", "typ-vztahu")
                )))
                    result.push(<option
                        value={iri}>{getLabelOrBlank(Links[iri].labels, this.props.projectLanguage)}</option>)
            }
        }
        return result;
    }

    prepareDetails(id: string) {
        let sourceCard = ProjectLinks[id].sourceCardinality;
        let targetCard = ProjectLinks[id].targetCardinality;
        this.setState({
            sourceCardinality: "0",
            targetCardinality: "0"
        });
        CardinalityPool.forEach((card, i) => {
            if (sourceCard.getString() === card.getString()) {
                this.setState({sourceCardinality: i.toString(10)});
            }
            if (targetCard.getString() === card.getString()) {
                this.setState({targetCardinality: i.toString(10)});
            }
        })
        this.setState({
            id: id,
            iri: ProjectLinks[id].iri,
            changes: false,
            readOnly: Schemes[VocabularyElements[ProjectElements[ProjectLinks[id].source].iri].inScheme].readOnly
        });
    }

    save() {
        if (this.state.id in ProjectLinks) {
            if (ProjectSettings.representation === Representation.FULL) {
                this.props.handleChangeLoadingStatus(true, LocaleMain.updating, false);
                ProjectLinks[this.state.id].sourceCardinality = CardinalityPool[parseInt(this.state.sourceCardinality, 10)];
                ProjectLinks[this.state.id].targetCardinality = CardinalityPool[parseInt(this.state.targetCardinality, 10)];
                ProjectLinks[this.state.id].iri = this.state.iri;
                updateProjectLink(ProjectSettings.contextEndpoint, this.state.id).then((result) => {
                    if (result) {
                        let link = graph.getLinks().find(link => link.id === this.state.id);
                        if (link) {
                            setLabels(link, getLinkOrVocabElem(this.state.iri).labels[this.props.projectLanguage])
                        }
                        this.setState({changes: false});
                        this.props.save();
                        updateConnections(ProjectSettings.contextEndpoint, this.state.id).then(result => {
                            if (result) {
                                this.props.handleChangeLoadingStatus(false, "", false);
                            } else {
                                this.props.handleChangeLoadingStatus(false, LocaleMain.errorUpdating, true);
                            }
                        })
                    } else {
                        this.props.handleChangeLoadingStatus(false, LocaleMain.errorUpdating, true);
                    }
                })
            } else {
                this.props.handleChangeLoadingStatus(true, LocaleMain.updating, false);
                ProjectLinks[this.state.id].sourceCardinality = CardinalityPool[parseInt(this.state.sourceCardinality, 10)];
                ProjectLinks[this.state.id].targetCardinality = CardinalityPool[parseInt(this.state.targetCardinality, 10)];
                let link = graph.getLinks().find(link => link.id === this.state.id);
                if (link) {
                    setLabels(link, getLinkOrVocabElem(this.state.iri).labels[this.props.projectLanguage])
                    let underlyingConnections = getUnderlyingFullConnections(link);
                    if (underlyingConnections) {
                        let sourceCard = CardinalityPool[parseInt(this.state.sourceCardinality, 10)];
                        let targetCard = CardinalityPool[parseInt(this.state.targetCardinality, 10)];
                        ProjectLinks[underlyingConnections.src].sourceCardinality = new Cardinality(sourceCard.getFirstCardinality(), sourceCard.getFirstCardinality());
                        ProjectLinks[underlyingConnections.src].targetCardinality = new Cardinality(sourceCard.getSecondCardinality(), sourceCard.getSecondCardinality());
                        ProjectLinks[underlyingConnections.tgt].sourceCardinality = new Cardinality(targetCard.getFirstCardinality(), targetCard.getFirstCardinality());
                        ProjectLinks[underlyingConnections.tgt].targetCardinality = new Cardinality(targetCard.getSecondCardinality(), targetCard.getSecondCardinality());
                        updateProjectLink(ProjectSettings.contextEndpoint, underlyingConnections.src);
                        updateProjectLink(ProjectSettings.contextEndpoint, underlyingConnections.tgt);
                        updateConnections(ProjectSettings.contextEndpoint, underlyingConnections.src);
                        updateConnections(ProjectSettings.contextEndpoint, underlyingConnections.tgt);
                    }
                }
                this.setState({changes: false});
                this.props.save();
                this.props.handleChangeLoadingStatus(false, "", false);
            }
        }
    }

    render() {
        return this.state.id !== "" && (<ResizableBox
            width={300}
            height={1000}
            axis={"x"}
            handleSize={[8, 8]}
            resizeHandles={['sw']}
            onResizeStop={() => {
                let elem = document.querySelector(".details");
                if (elem) this.props.handleWidth(elem.getBoundingClientRect().width);
            }}
            className={"details" + (this.props.error ? " disabled" : "")}>
            <div className={(this.props.error ? " disabled" : "")}>
                <button className={"buttonlink close nounderline"} onClick={() => {
                    unHighlightAll();
                    this.setState({id: ""});
                    this.props.handleWidth(0);
                }}><span role="img" aria-label={""}>➖</span></button>
                <h3><IRILink label={getLinkOrVocabElem(this.state.iri).labels[this.props.projectLanguage]}
                             iri={this.state.iri}/></h3>
                <TableList headings={[LocaleMenu.linkInfo, ""]}>
                    <tr>
                        <td>
                            <span>{LocaleMain.sourceCardinality}</span>
                        </td>
                        <td>
                            {(!this.state.readOnly) ? <Form.Control as="select" value={this.state.sourceCardinality}
                                                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                                        this.setState({
                                                                            sourceCardinality: event.currentTarget.value,
                                                                            changes: true
                                                                        });
                                                                    }
                                                                    }>
                                {CardinalityPool.map((card, i) =>
                                    (<option key={i} value={i.toString(10)}>{card.getString()}</option>)
                                )}
                            </Form.Control> : CardinalityPool[parseInt(this.state.sourceCardinality, 10)].getString()}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <span>{LocaleMain.targetCardinality}</span>
                        </td>
                        <td>
                            {(!this.state.readOnly) ? <Form.Control as="select" value={this.state.targetCardinality}
                                                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                                        this.setState({
                                                                            targetCardinality: event.currentTarget.value,
                                                                            changes: true
                                                                        });
                                                                    }
                                                                    }>
                                {CardinalityPool.map((card, i) =>
                                    (<option key={i} value={i.toString(10)}>{card.getString()}</option>)
                                )}
                            </Form.Control> : CardinalityPool[parseInt(this.state.targetCardinality, 10)].getString()}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>{LocaleMain.linkType}</span>
                        </td>
                        {(ProjectSettings.representation === Representation.FULL && !(this.state.readOnly)) ? <td>
                                <Form.Control as="select" value={this.state.iri} onChange={(event) => {
                                    this.setState({
                                        iri: event.currentTarget.value,
                                        changes: true
                                    })
                                }}>
                                    {this.prepareLinkOptions()}
                                </Form.Control>
                            </td> :
                            <IRIlabel
                                label={getLabelOrBlank(getLinkOrVocabElem(this.state.iri).labels, this.props.projectLanguage)}
                                iri={this.state.iri}
                            />}
                    </tr>
                </TableList>
                <h5>{<IRILink label={this.props.headers.labels[this.props.projectLanguage]}
                              iri={"http://www.w3.org/2004/02/skos/core#prefLabel"}/>}</h5>
                <TableList>
                    {
                        Object.keys(getLinkOrVocabElem(this.state.iri).labels).map(lang => (
                            <tr>
                                <td>{getLinkOrVocabElem(this.state.iri).labels[lang]}</td>
                                <td>{Languages[lang]}</td>
                            </tr>
                        ))
                    }
                </TableList>
                <h5>{<IRILink label={this.props.headers.inScheme[this.props.projectLanguage]}
                              iri={"http://www.w3.org/2004/02/skos/core#inScheme"}/>}</h5>
                <TableList>
                    {Object.keys(Schemes[getLinkOrVocabElem(this.state.iri).inScheme].labels).map(lang => (
                        <tr>
                            <IRIlabel
                                label={Schemes[getLinkOrVocabElem(this.state.iri).inScheme].labels[lang]}
                                iri={getLinkOrVocabElem(this.state.iri).inScheme}/>
                            <td>{Languages[lang]}</td>
                        </tr>
                    ))}
                </TableList>

                {Object.keys(getLinkOrVocabElem(this.state.iri).definitions).length > 0 ?
                    <div>
                        <h5>{<IRILink label={this.props.headers.definition[this.props.projectLanguage]}
                                      iri={"http://www.w3.org/2004/02/skos/core#definition"}/>}</h5>
                        <DescriptionTabs descriptions={getLinkOrVocabElem(this.state.iri).definitions}
                                         readOnly={true}/>
                    </div> : ""}
            </div>
        </ResizableBox>);
    }
}