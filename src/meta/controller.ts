export type ModelCreateInput<T> = {
    [K in keyof T as T[K] extends (...args: unknown[]) => unknown ? never : K extends "_id" ? never : K]: T[K];
}


export class Controller {
    public constructor() {
        throw new Error("Cannot instantiate Controller of model. Use static create method instead");
    }

    public static create<T>(this: { new(): T }, data: ModelCreateInput<T>) {
        console.log("creating new instance", data);
    }
}
