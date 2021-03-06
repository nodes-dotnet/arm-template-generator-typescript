import { Component, Fragment } from "react";
import ArmTemplate from "../../models/ArmTemplate";
import Resource, { ResourceType } from "../../models/Resource";
import StorageAccount from "../../models/Resources/StorageAccount";
import React = require("react");
import Select from "../Inputs/Select";
import { StorageAccountForm } from "./Resources/StorageAccountForm";
import Parameter from "../../models/Parameter";
import StorageAccountBlobServiceForm from "./Resources/StorageAccountBlobServiceForm";
import StorageAccountBlobService from "../../models/Resources/StorageAccountBlobService";
import StorageAccountBlobContainer from "../../models/Resources/StorageAccountBlobContainer";
import StorageAccountBlobContainerForm from "./Resources/StorageAccountBlobContainerForm";
import ApplicationInsights from "../../models/Resources/ApplicationInsights";
import ApplicationInsightsForm from "./Resources/ApplicationInsightsForm";

interface ResourceFormProps {
    template: ArmTemplate;
    resource?: Resource;
    onSubmit: (resources: Resource[], parameters: { [index: string]: Parameter }) => ArmTemplate;
}

class ResourceFormState {
    type: ResourceType;
}

export class ResourceForm extends Component<ResourceFormProps, ResourceFormState> {
    constructor(props: ResourceFormProps) {
        super(props);

        this.typeSelected = this.typeSelected.bind(this);

        this.state = this.buildState(props);
    }

    buildState(props: ResourceFormProps): ResourceFormState {
        let state = new ResourceFormState();
        state.type = ResourceType.None;

        if(props.resource) {
            switch(props.resource.type) {
                case ApplicationInsights.resourceType:
                    state.type = ResourceType.ApplicationInsights;
                    break;
                case StorageAccount.resourceType:
                    state.type = ResourceType.StorageAccount;
                    break;
                case StorageAccountBlobService.resourceType:
                    state.type = ResourceType.StorageAccountBlobService;
                    break;
                case StorageAccountBlobContainer.resourceType:
                    state.type = ResourceType.StorageAccountBlobContainer;
                    break;
            }
        }

        return state;
    }

    componentDidUpdate(prevProps: ResourceFormProps): void {
        let prevResource: string, curResource: string;

        prevResource = prevProps.resource && prevProps.resource.getName() ? prevProps.resource.getName() : "";
        curResource = this.props.resource && this.props.resource.getName() ? this.props.resource.getName() : "";

        if(prevResource === curResource) {
            return;
        }

        this.setState(this.buildState(this.props));
    }

    typeSelected(option: string): void {
        if(option === "") {
            this.setState({
                type: ResourceType.None
            });
        } else {
            let key = option as keyof typeof ResourceType;

            this.setState({
                type: ResourceType[key]
            });
        }
    }

    render(): JSX.Element {
        const types: string[] = [
            ResourceType[ResourceType.None],
            ResourceType[ResourceType.ApplicationInsights],
            ResourceType[ResourceType.StorageAccount],
            ResourceType[ResourceType.StorageAccountBlobService],
            ResourceType[ResourceType.StorageAccountBlobContainer]
        ];

        let value: string = this.state.type ? ResourceType[this.state.type] : ResourceType[ResourceType.None];

        return <Fragment>
            <h3>Type</h3>
            <div className="input-group">
                <Select onOptionSelect={this.typeSelected} hideEmpty={true} value={value} values={types}></Select>
            </div>

            {this.state.type === ResourceType.ApplicationInsights && <ApplicationInsightsForm template={this.props.template} resource={this.props.resource as ApplicationInsights} onSave={this.props.onSubmit} showLocation={ApplicationInsights.needLocation()}></ApplicationInsightsForm>}
            {this.state.type === ResourceType.StorageAccount && <StorageAccountForm template={this.props.template} resource={this.props.resource as StorageAccount} onSave={this.props.onSubmit} showLocation={StorageAccount.needLocation()}></StorageAccountForm>}
            {this.state.type === ResourceType.StorageAccountBlobService && <StorageAccountBlobServiceForm template={this.props.template} resource={this.props.resource as StorageAccountBlobService} onSave={this.props.onSubmit} showLocation={StorageAccountBlobService.needLocation()}></StorageAccountBlobServiceForm>}
            {this.state.type === ResourceType.StorageAccountBlobContainer && <StorageAccountBlobContainerForm template={this.props.template} resource={this.props.resource as StorageAccountBlobContainer} onSave={this.props.onSubmit} showLocation={StorageAccountBlobContainer.needLocation()}></StorageAccountBlobContainerForm>}
        </Fragment>
    }
}