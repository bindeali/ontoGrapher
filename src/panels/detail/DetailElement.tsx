import React from "react";
import {ResizableBox} from "react-resizable";
import {
	Diagrams,
	Languages,
	Links,
	ProjectElements,
	ProjectLinks,
	ProjectSettings,
	Schemes,
	Stereotypes,
	VocabularyElements
} from "../../config/Variables";
import {getLabelOrBlank, getLinkOrVocabElem} from "../../function/FunctionGetVars";
import {Accordion, Button, Card} from "react-bootstrap";
import TableList from "../../components/TableList";
import IRILink from "../../components/IRILink";
import LabelTable from "./components/LabelTable";
import DescriptionTabs from "./components/DescriptionTabs";
import {spreadConnections} from "../../function/FunctionGraph";
import {graph} from "../../graph/Graph";
import StereotypeOptions from "./components/StereotypeOptions";
import {Shapes} from "../../config/visual/Shapes";
import {Locale} from "../../config/Locale";
import {drawGraphElement, unHighlightCell} from "../../function/FunctionDraw";
import AltLabelTable from "./components/AltLabelTable";
import ConnectionTable from "./components/ConnectionTable";
import {Representation} from "../../config/Enum";
import {updateProjectElement} from "../../queries/UpdateElementQueries";

interface Props {
	projectLanguage: string;
	save: (id: string) => void;
	performTransaction: (...queries: string[]) => void;
	handleWidth: Function;
	error: boolean;
	updateDetailPanel: Function;
}

interface State {
	id: string,
	inputTypeType: string;
	inputTypeData: string;
	inputAltLabels: { label: string, language: string }[];
	inputDefinitions: { [key: string]: string };
	selectedLabel: { [key: string]: string };
	newAltInput: string;
	changes: boolean;
}

export default class DetailElement extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			id: "",
			inputTypeType: "",
			inputTypeData: "",
			inputAltLabels: [],
			inputDefinitions: {},
			selectedLabel: {},
			newAltInput: "",
			changes: false
		}
		this.checkSpreadConnections = this.checkSpreadConnections.bind(this);
		this.updateStereotype = this.updateStereotype.bind(this);
	}

	prepareDetails(id?: string) {
		id ? this.setState({
			id: id,
			selectedLabel: ProjectElements[id].selectedLabel,
			inputTypeType: VocabularyElements[ProjectElements[id].iri].types.find(type => type in Stereotypes && type in Shapes) || "",
			inputTypeData: VocabularyElements[ProjectElements[id].iri].types.find(type => type in Stereotypes && !(type in Shapes)) || "",
			inputAltLabels: VocabularyElements[ProjectElements[id].iri].altLabels,
			inputDefinitions: VocabularyElements[ProjectElements[id].iri].definitions,
			newAltInput: "",
			changes: false
		}) : this.setState({id: ""});
	}

	getConnections(to: boolean): string[] {
		return to ? ProjectElements[this.state.id].connections.filter(conn => ProjectLinks[conn] && ProjectLinks[conn].active &&
			(ProjectSettings.representation === Representation.FULL ? ProjectLinks[conn].iri in Links : (!(ProjectLinks[conn].iri in Links)) ||
				(ProjectLinks[conn].iri in Links && Links[ProjectLinks[conn].iri].inScheme.startsWith(ProjectSettings.ontographerContext)))
			&& getLinkOrVocabElem(ProjectLinks[conn].iri)) :
			Object.keys(ProjectLinks).filter(conn => ProjectLinks[conn] && ProjectLinks[conn].target === this.state.id &&
				ProjectLinks[conn].active && getLinkOrVocabElem(ProjectLinks[conn].iri) &&
				(ProjectSettings.representation === Representation.FULL ? ProjectLinks[conn].iri in Links : (!(ProjectLinks[conn].iri in Links) ||
					(ProjectLinks[conn].iri in Links && Links[ProjectLinks[conn].iri].inScheme.startsWith(ProjectSettings.ontographerContext)))));
	}

	checkSpreadConnections(to: boolean): boolean {
		if (this.state) {
			let cell = graph.getElements().find(elem => elem.id === this.state.id);
			if (cell) {
				let connections = this.getConnections(to);
				return to ? connections.length !==
					(graph.getConnectedLinks(cell)
						.filter(link => ProjectLinks[link.id] && ProjectLinks[link.id].source === this.state.id).length) :
					connections.length !==
					graph.getConnectedLinks(cell)
						.filter(link => ProjectLinks[link.id] && ProjectLinks[link.id].target === this.state.id).length;
			} else return false;
		} else return false;
	}

	save() {
		let elem = graph.getElements().find(elem => elem.id === (this.state.id));
		if (this.state.id in ProjectElements) {
			VocabularyElements[ProjectElements[this.state.id].iri].altLabels = this.state.inputAltLabels;
			VocabularyElements[ProjectElements[this.state.id].iri].definitions = this.state.inputDefinitions;
			ProjectElements[this.state.id].selectedLabel = this.state.selectedLabel;
			if (elem) drawGraphElement(elem, this.props.projectLanguage, ProjectSettings.representation);
			this.props.save(this.state.id);
			this.setState({changes: false});
			this.prepareDetails(this.state.id);
			this.props.performTransaction(updateProjectElement(true, this.state.id));
		}
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
		if ((prevState.changes !== this.state.changes && this.state.changes)) {
			this.save();
		}
	}

	updateStereotype(newStereotype: string, type: boolean) {
		const otherStereotype = type ? this.state.inputTypeData : this.state.inputTypeType;
		const stereotypes = VocabularyElements[ProjectElements[this.state.id].iri].types.filter(stereotype => !(stereotype in Stereotypes));
		if (newStereotype !== "") stereotypes.push(newStereotype);
		if (otherStereotype !== "") type ? stereotypes.push(otherStereotype) : stereotypes.unshift(otherStereotype);
		VocabularyElements[ProjectElements[this.state.id].iri].types = stereotypes;
		this.setState({
			changes: true
		})
		type ? this.setState({inputTypeType: newStereotype}) : this.setState({inputTypeData: newStereotype});
	}

	render() {
		return (this.state.id !== "" && this.state.id in ProjectElements) && (<ResizableBox
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
			<div>
				<button className={"buttonlink close nounderline"} onClick={() => {
					unHighlightCell(this.state.id);
					this.props.updateDetailPanel();
				}}><span role="img" aria-label={""}>➖</span></button>
				<h3><IRILink
					label={this.state.id ? getLabelOrBlank(VocabularyElements[ProjectElements[this.state.id].iri].labels, this.props.projectLanguage) : ""}
					iri={ProjectElements[this.state.id].iri}/></h3>
				<Accordion defaultActiveKey={"0"}>
					<Card>
						<Card.Header>
							<Accordion.Toggle as={Button} variant={"link"} eventKey={"0"}>
								{Locale[ProjectSettings.viewLanguage].description}
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey={"0"}>
							<Card.Body>
								<h5>{<IRILink label={Locale[ProjectSettings.viewLanguage].detailPanelPrefLabel}
											  iri={"http://www.w3.org/2004/02/skos/core#prefLabel"}/>}</h5>
								<LabelTable labels={VocabularyElements[ProjectElements[this.state.id].iri].labels}
											default={this.state.selectedLabel[this.props.projectLanguage]}
											selectAsDefault={
												(label: string) => {
													let res = this.state.selectedLabel;
													res[this.props.projectLanguage] = label;
													this.setState({selectedLabel: res, changes: true})
												}}/>
								<h5>{<IRILink label={Locale[ProjectSettings.viewLanguage].detailPanelAltLabel}
											  iri={"http://www.w3.org/2004/02/skos/core#altLabel"}/>}</h5>
								<AltLabelTable labels={this.state.inputAltLabels}
											   readOnly={Schemes[VocabularyElements[ProjectElements[this.state.id].iri].inScheme].readOnly}
											   onEdit={
												   (textarea: string, lang: string, i: number) => {
													   let res = this.state.inputAltLabels;
													   let resL = this.state.selectedLabel;
													   if (textarea === "") {
														   if (res[i].label === this.state.selectedLabel[this.props.projectLanguage]) {
															   resL[this.props.projectLanguage] =
																   VocabularyElements[ProjectElements[this.state.id].iri].labels[this.props.projectLanguage];
														   }
														   res.splice(i, 1);
													   } else {
														   if (res[i].label === this.state.selectedLabel[this.props.projectLanguage]) {
															   resL[this.props.projectLanguage] = lang === this.props.projectLanguage ? textarea : "";
														   }
														   res[i] = {label: textarea, language: lang};
													   }
													   this.setState({
														   inputAltLabels: res,
														   selectedLabel: resL,
														   changes: true
													   });
												   }
											   } default={this.state.selectedLabel[this.props.projectLanguage]}
											   selectAsDefault={(lang: string, i: number) => {
												   let res = this.state.selectedLabel;
												   res[this.props.projectLanguage] = this.state.inputAltLabels[i].label;
												   this.setState({selectedLabel: res, changes: true});
											   }} addAltLabel={(label: string) => {
									if (label !== "" || this.state.inputAltLabels.find(alt => alt.label === label)) {
										let res = this.state.inputAltLabels;
										res.push({label: label, language: this.props.projectLanguage});
										this.setState({inputAltLabels: res, changes: true});
									}
								}}/>
								<h5>{<IRILink label={Locale[ProjectSettings.viewLanguage].detailPanelStereotype}
											  iri={"http://www.w3.org/2000/01/rdf-schema#type"}/>}</h5>
								<TableList>
									<StereotypeOptions
										readonly={Schemes[VocabularyElements[ProjectElements[this.state.id].iri].inScheme].readOnly}
										content={true}
										projectLanguage={this.props.projectLanguage}
										onChange={(value: string) => this.updateStereotype(value, true)}
										value={this.state.inputTypeType}/>
									<StereotypeOptions
										readonly={Schemes[VocabularyElements[ProjectElements[this.state.id].iri].inScheme].readOnly}
										content={false}
										projectLanguage={this.props.projectLanguage}
										onChange={(value: string) => this.updateStereotype(value, false)}
										value={this.state.inputTypeData}/>
								</TableList>
								<h5>{<IRILink label={Locale[ProjectSettings.viewLanguage].detailPanelInScheme}
											  iri={"http://www.w3.org/2004/02/skos/core#inScheme"}/>}</h5>
								<LabelTable
									labels={Schemes[VocabularyElements[ProjectElements[this.state.id].iri].inScheme].labels}
									iri={VocabularyElements[ProjectElements[this.state.id].iri].inScheme}/>
								{Object.keys(Languages).length > 0 ?
									<h5>{<IRILink label={Locale[ProjectSettings.viewLanguage].detailPanelDefinition}
												  iri={"http://www.w3.org/2004/02/skos/core#definition"}/>}</h5> : ""}
								<DescriptionTabs
									descriptions={this.state.inputDefinitions}
									readOnly={Schemes[VocabularyElements[ProjectElements[this.state.id].iri].inScheme].readOnly}
									onEdit={(event: React.ChangeEvent<HTMLSelectElement>, language: string) => {
										let res = this.state.inputDefinitions;
										res[language] = event.currentTarget.value;
										this.setState({inputDefinitions: res});
									}}
									onFocusOut={() => {
										this.setState({changes: true});
									}}
								/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header>
							<Accordion.Toggle as={Button} variant={"link"} eventKey={"1"}>
								{Locale[ProjectSettings.viewLanguage].connections}
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey={"1"}>
							<Card.Body>
								<ConnectionTable
									connections={this.getConnections(true)}
									projectLanguage={this.props.projectLanguage} to={true}
									button={<Button className={"buttonlink center"}
													onClick={() => {
														this.props.performTransaction(...spreadConnections(this.state.id, true));
														this.forceUpdate();
													}}>
										{Locale[ProjectSettings.viewLanguage].spreadConnections}
									</Button>}
									showButton={this.checkSpreadConnections(true)}/>
								<ConnectionTable
									connections={this.getConnections(false)}
									projectLanguage={this.props.projectLanguage} to={false}
									button={<Button className={"buttonlink center"}
													onClick={() => {
														this.props.performTransaction(...spreadConnections(this.state.id, false));
														this.forceUpdate();
													}}>
										{Locale[ProjectSettings.viewLanguage].spreadConnections}
									</Button>}
									showButton={this.checkSpreadConnections(false)}/>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card>
						<Card.Header>
							<Accordion.Toggle as={Button} variant={"link"} eventKey={"2"}>
								{Locale[ProjectSettings.viewLanguage].diagramTab}
							</Accordion.Toggle>
						</Card.Header>
						<Accordion.Collapse eventKey={"2"}>
							<Card.Body>
								<TableList headings={[Locale[ProjectSettings.viewLanguage].diagram]}>
									{ProjectElements[this.state.id].diagrams.filter(diag => Diagrams[diag] && Diagrams[diag].active).map((diag, i) =>
										<tr key={i}>
											<td>{Diagrams[diag].name}</td>
										</tr>
									)}
								</TableList>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		</ResizableBox>);
	}
}
