export declare class DataManager extends Core {
    constructor(environment: string, token?: string);

    list(options?: filterOptions): Promise<DataManagerList>;

    get(dataManagerID: string): Promise<DataManagerResource>;
}

export declare class Accounts extends Core {

}

declare class Core {
    constructor(url: string);

    newRequest(): any;
}

declare class DataManagerList extends ListResource {
    constructor(resource: any, name?: string, traversal?: any);

    create(dataManager: any): Promise<DataManagerResource>;
}

declare class DataManagerResource extends ListResource {

    setTitle(value: string): DataManagerResource;

    getTitle(): string;

    setDescription(value: string): DataManagerResource;

    getDescription(): string;

    setConfig(value: any): DataManagerResource;

    getconfig(): any;

    setHexColor(value: string): DataManagerResource;

    getHexColor(): string;

    setLocales(value: Array<string>): DataManagerResource;

    getLocales(): Array<string>
}

declare class ListResource extends Resource {
    constructor(resource: any, name?: string, traversal?: any);

    getAllItems(): Array<Resource>

    getItem(n: number): Resource;

    getFirstItem(): Resource;

    hasFirstLink(): boolean;

    followFirstLink(): Promise<ListResource>;

    hasNextLink(): boolean;

    followNextLink(): Promise<ListResource>;

    hasPrevLink(): boolean;

    followPrevLink(): Promise<ListResource>;
}

declare class Resource {
    constructor(resource: any, traversal?: any);

    newRequest(): any;

    isDirty(): boolean;

    reset(): void;

    save(): Promise<Resource>

    del(): Promise<void>;

    hasLink(link: string): boolean;

    getLink(link: string): any;

    get(properties: any): any;

    set(resource: any): Resource;

    getProperty(property: string): any;

    setProperty(property: string, value: any): Resource;
}

interface filterOptions {
    size?: number,
    page?: number,
    sort?: Array<string>,
    filter?: any
}

