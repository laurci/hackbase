import { Controller } from "@meta/controller";
import { debug } from "@meta/debug";
import { Model } from "@meta/model";

export class Car extends Controller derives Model {

    _id!: string;

    name!: string;

    hello() {
        debug!("Hello from Car");
    }

}


