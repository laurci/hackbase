import { DeriveMacro } from "compiler";


export abstract class Model {
}

export macro function deriveModel(this: DeriveMacro<Model>) {
    console.log("derive");
}
