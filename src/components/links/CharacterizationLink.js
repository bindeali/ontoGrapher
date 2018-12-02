import React from 'react';
import {CommonLinkWidget} from "../common-link/CommonLinkWidget";




export class CharacterizationLinkWidget extends CommonLinkWidget {
    constructor(props){
        super(props);
        this.props.link.addDescriptorLabel();
    }
}