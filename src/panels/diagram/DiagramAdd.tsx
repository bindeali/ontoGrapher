import React from 'react';
import {Diagrams, ProjectSettings} from "../../config/Variables";
import * as Locale from "../../locale/LocaleMain.json";
import {updateProjectSettings} from "../../interface/TransactionInterface";
import * as LocaleMain from "../../locale/LocaleMain.json";

interface Props {
	update: Function;
	error: boolean;
	handleChangeLoadingStatus: Function;
}

interface State {

}

export default class DiagramAdd extends React.Component<Props, State> {

	addDiagram() {
		this.props.handleChangeLoadingStatus(true, LocaleMain.updating, false);
		Diagrams.push({name: Locale.untitled, json: {}, active: true});
		updateProjectSettings(ProjectSettings.contextIRI, ProjectSettings.contextEndpoint).then(result => {
			if (result) {
				this.props.handleChangeLoadingStatus(false, "", false);
			} else {
				this.props.handleChangeLoadingStatus(false, "", true);
			}
		});
		this.props.update();
	}

	render() {
		return (<div className={"diagramTab" + (this.props.error ? " disabled" : "")}>
			<button className={"buttonlink nounderline"} onClick={() => {
				this.addDiagram();
			}}>
				<span role="img" aria-label={""}>➕</span>
			</button>
		</div>);
	}
}