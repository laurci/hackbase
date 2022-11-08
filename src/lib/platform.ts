import * as fs from "fs";
import * as path from "path";

class PlatformFs {
    async readFile(path: string): Promise<Buffer> {
        return fs.promises.readFile(path);
    }

    async writeFile(path: string, data: Buffer) {
        return fs.promises.writeFile(path, data);
    }

    exists(path: string): boolean {
        return fs.existsSync(path);
    }

    mkdir(path: string, options?: fs.MakeDirectoryOptions) {
        return fs.promises.mkdir(path, options);
    }

    stat(path: string) {
        return fs.promises.stat(path);
    }
}

class PlatformPath {
    join(...paths: string[]) {
        return path.join(...paths);
    }
}

export const Platform = {
    fs: new PlatformFs(),
    path: new PlatformPath()
}
