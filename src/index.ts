import { DatabaseEngine } from "./lib/database/engine";
import "./lib/globals";

import { debug } from "./lib/meta/debug";
import { rel } from "./lib/meta/path";

async function main() {
    const engine = await DatabaseEngine.create({
        path: rel!`../db/`
    });

    const cars = await engine.collection<{ _id: string, name: string }>("Car");
    debug!(cars.count());

}

main();
