
import { serialize, deserialize } from "bson";
import { debug } from "@meta/debug";
import { Platform } from "../platform";

export interface DatabaseEngineOptions {
    path: string;
}

export class Collection<T extends { _id: string }>{
    private data: Record<string, T> = {};

    private constructor(private path: string) {

    }

    public static async create<T extends { _id: string }>(path: string) {
        const collection = new Collection<T>(path);
        await collection.load();
        return collection;
    }

    protected async load() {
        if (!Platform.fs.exists(this.path)) {
            await this.commit();
            return;
        }

        const data = await Platform.fs.readFile(this.path);
        this.data = deserialize(data);
    }

    public add(data: T) {
        this.data[data._id] = data;
    }

    public delete(id: string) {
        delete this.data[id];
    }

    public get(id: string) {
        return this.data[id];
    }

    public find(filter?: (data: T) => boolean) {
        if (!filter) {
            return Object.values(this.data);
        }

        return Object.values(this.data).filter(filter);
    }

    public findOne(filter: (data: T) => boolean) {
        return Object.values(this.data).find(filter);
    }

    public count(filter?: (data: T) => boolean) {
        if (!filter) {
            return Object.keys(this.data).length;
        }
        return Object.values(this.data).filter(filter).length;
    }

    public async commit() {
        const serialized = serialize(this.data);
        await Platform.fs.writeFile(this.path, serialized);
    }
}

export class DatabaseEngine {
    private constructor(
        private options: DatabaseEngineOptions
    ) {

    }

    public static async create(options: DatabaseEngineOptions) {
        const engine = new DatabaseEngine(options);
        await engine.init();

        return engine;
    }

    protected async init() {
        debug!("ensuring db fs");

        if (!Platform.fs.exists(this.options.path)) {
            debug!("db fs doesnt exist. creating");
            await Platform.fs.mkdir(this.options.path, { recursive: true });
        } else {
            debug!("db fs exists");
            const stat = await Platform.fs.stat(this.options.path);
            if (!stat.isDirectory()) {
                throw new Error("db location is not a directory");
            }
        }

        debug!("ready");
    }

    public async collection<T extends { _id: string }>(name: string) {
        return Collection.create<T>(Platform.path.join(this.options.path, `${name}.db`));
    }
}
