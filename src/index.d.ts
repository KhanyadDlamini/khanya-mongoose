declare module "khanya-mongoose" {
    export function connect(uri: string, options?: object): Promise<any>;
    export function model(name: string, schema: any): any;
    export class Schema {
        constructor(definition: any, options?: any);
    }
}
