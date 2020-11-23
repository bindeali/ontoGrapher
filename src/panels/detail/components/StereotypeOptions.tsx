import React from 'react';
import {Form} from "react-bootstrap";
import * as LocaleMain from "../../../locale/LocaleMain.json";
import {Stereotypes} from "../../../config/Variables";
import {getName} from "../../../function/FunctionEditVars";
import {Shapes} from "../../../config/Shapes";

interface Props {
	readonly: boolean;
	content: boolean;
	value: string;
	onChange: Function;
	projectLanguage: string;
}

interface State {

}

export default class StereotypeOptions extends React.Component<Props, State> {

	render() {
		return (<tr>
			<td>
				<Form inline>
					<Form.Control size="sm" as="select"
								  value={this.props.value}
								  disabled={this.props.readonly}
								  onChange={(event) => this.props.onChange(event.currentTarget.value)}>
						<option key={""} value={""}>{this.props.readonly ?
							(this.props.content ? LocaleMain.noStereotypeUML : LocaleMain.noStereotypeData) :
							(this.props.content ? LocaleMain.setStereotypeUML : LocaleMain.setStereotypeData)}</option>
						{Object.keys(Stereotypes).filter(stereotype => this.props.content ? stereotype in Shapes : !(stereotype in Shapes)).map((stereotype) => (
							<option key={stereotype}
									value={stereotype}>{getName(stereotype, this.props.projectLanguage)}</option>))}
					</Form.Control>
				</Form>
			</td>
		</tr>);
	}
}