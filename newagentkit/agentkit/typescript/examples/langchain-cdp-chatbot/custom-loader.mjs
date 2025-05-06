import { createRequire } from "module";
const require = createRequire(import.meta.url);

export function resolve(specifier, context, defaultResolve) {
  if (specifier === "jose") {
    return {
      url: require.resolve("jose"),
    };
  }
  return defaultResolve(specifier, context, defaultResolve);
}