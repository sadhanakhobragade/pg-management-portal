import js from "@eslint/js";

import globals from "globals";

import reactHooks from "eslint-plugin-react-hooks";

import reactRefresh from "eslint-plugin-react-refresh";

import tseslint from "typescript-eslint";
import eslintPluginReact from 'eslint-plugin-react';


export default tseslint.config(

 { ignores: ["dist"] },

 {

 files: ["**/*.{js,jsx}"],
 extends: [js.configs.recommended, eslintPluginReact.configs.recommended], 

 languageOptions: {
        ecmaVersion: 2020,
       sourceType: "module",
      globals: globals.browser,
     parserOptions: {
     ecmaFeatures: {
     jsx: true,
 },
 },
},
 plugins: {
react: eslintPluginReact,
"react-hooks": reactHooks,

"react-refresh": reactRefresh,

},

 rules: {
  "react/prop-types": "off", 

   "react/react-in-jsx-scope": "off",

 ...reactHooks.configs.recommended.rules,

"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

 },


},



// 2. ORIGINAL TYPESCRIPT/TSX CONFIG (Preserved for compatibility)
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ["**/*.{ts,tsx}"],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//     plugins: {
//       "react-hooks": reactHooks,
//       "react-refresh": reactRefresh,
//     },
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       "@typescript-eslint/no-unused-vars": "off",
//       "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
//     },
//   },

);