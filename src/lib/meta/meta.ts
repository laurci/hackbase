import { Expression, NodeFactory } from "compiler";

export function getGlobalAccessExpression(factory: NodeFactory, name: string) {
    return factory.createCallExpression(
        factory.createIdentifier("hackbase_with_global"),
        [],
        [factory.createStringLiteral(name)]
    )
}

export function getGlobalInvokeExpression(factory: NodeFactory, name: string, args: Expression[] = []) {
    return factory.createCallExpression(
        getGlobalAccessExpression(factory, name),
        [],
        args
    )
}
