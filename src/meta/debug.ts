import { createPrinter, FunctionMacro, getBuildConfig, getCurrentProgram, findAncestor, isStringLiteral, MacroCallExpressionNode, NodeFactory, SourceFile, isFunctionLike, isClassDeclaration, Node, getLineAndCharacterOfPosition } from "compiler";
import * as path from "path";

const ENABLE_KEY = "debug.enable";

const printer = createPrinter();
function getNodeText(node: Node, sourceFile: SourceFile) {
    return printer.printNode(4 /* EmitHint.Unspecified */, node, sourceFile);
}

function createLog(factory: NodeFactory, sourceFile: SourceFile, node: MacroCallExpressionNode) {
    const baseDir = getCurrentProgram().getCurrentDirectory();
    const fileName = path.relative(baseDir, sourceFile.fileName);

    let intro = `[debug][${fileName}`;

    const topFn = findAncestor(node, isFunctionLike);
    if (topFn && topFn.name) {
        const fnNAme = printer.printNode(4 /* EmitHint.Unspecified */, topFn.name, sourceFile);
        const topClass = findAncestor(topFn, isClassDeclaration);
        if (topClass && topClass.name) {
            const className = getNodeText(topClass.name, sourceFile);
            intro += `:${className}.${fnNAme}`;
        } else {
            intro += `:${fnNAme}`;
        }
    }

    intro += "]";

    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createIdentifier("console"),
            "log",
        ),
        [],
        [
            factory.createStringLiteral(intro),
            ...node.arguments.flatMap((arg) => {
                if (isStringLiteral(arg)) return [arg];
                const argText = getNodeText(arg, sourceFile);

                return [
                    factory.createStringLiteral(`${argText} =`, false),
                    arg
                ];
            })
        ]
    )
}

export macro function debug(this: FunctionMacro, ..._args: unknown[]) {
    this.transform(({ node, factory, sourceFile }) => {
        const buildConfig = getBuildConfig();

        if (!buildConfig[ENABLE_KEY]) {
            return node.remove();
        }


        return node.replace(createLog(factory, sourceFile, node));
    });
}
