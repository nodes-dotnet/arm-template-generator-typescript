import ResourceDependency from "./Resources/ResourceDependency";

export abstract class Resource {
    condition: string;
    type: string;
    name: string;
    location: string;
    apiVersion: string;
    tags: ResourceTags;
    dependsOn: string[];
    static resourceType: string = "";
    static displayName: string = "";

    constructor() {
        this.apiVersion = "2019-04-01";
    }

    static needLocation(): boolean {
        return true;
    }

    getName(): string {
        return this.name;
    }

    set setName(name: string) {
        this.name = name;
    }

    protected getResourceIdString(...parts: string[]) {
        if(parts.length > 0) {
            return "[resourceId('" + this.type + "', " + parts.join(", ") + ")]";
        } else {
            return "";
        }
    }

    abstract getResourceId(): string;

    setDependantResources(_allResources: Resource[]): void { }

    protected getNameForConcat(name: string, doNotAddApostrophes?: boolean): string {
        let finalName: string;

        if(name.startsWith("[") && name.endsWith("]")){
            finalName = name.substr(1, name.length - 2);
        } else if(!doNotAddApostrophes) {
            finalName = "'" + name + "'";
        } else {
            finalName = name;
        }

        return finalName;
    }

    //Its model for itself
    static getResourceDependencyModel(): ResourceDependency {
        return new ResourceDependency(this.displayName, this.resourceType, this.getAllRequiredResources());
    }

    //Is to be implemented by the extending classes
    static getDefault(_name: string, _resourceDependency: ResourceDependency): Resource[] {
        return [];
    }

    //All required resources' dependency model
    static getAllRequiredResources(): ResourceDependency[] {
        return [];
    }

    static allowedLocations: string[] = ["[resourceGroup().location]"];

    //Nothing to do in the base case
    setDependencies(_dependency: ResourceDependency, _resources: Resource[]): void {
        this.dependsOn = [];
    };
}

export enum ResourceType {
    None,
    ApplicationInsights,
    StorageAccount,
    StorageAccountBlobService,
    StorageAccountBlobContainer
}

export class ResourceTags {
    displayName: string;
}

export default Resource;