import { Controller } from "../lib/meta/controller";
import { Model } from "../lib/meta/model";

export class Car extends Controller derives Model {

    _id!: string;

    name!: string;

    hello() {
        console.log("hello from car");
    }

}


