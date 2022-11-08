import * as path from "path";

function withGlobal<T>(key: string, value?: unknown): T | undefined {
    const fullKey = `__hackbase_${key}`;
    if (typeof value == "undefined") {
        return (globalThis as unknown as Record<string, unknown>)[fullKey] as T;
    }

    (globalThis as unknown as Record<string, unknown>)[fullKey] = value;
}
(globalThis as unknown as Record<string, unknown>)["hackbase_with_global"] = withGlobal;

withGlobal("path_relative_to_file", (baseDir: string, relativePath: string) => {
    return path.join(baseDir, relativePath);
});
