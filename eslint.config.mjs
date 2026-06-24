import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // React Compiler rules that conflict with established React patterns in this codebase
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      // Allow _ prefixed variables to be unused (intentional discard pattern)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" },
      ],
      // Dynamic user-uploaded images cannot safely use next/image without configuring all domains
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
