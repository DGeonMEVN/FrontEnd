/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

// module.exports = {
//   root: true,
//   parser: '@babel/eslint-parser',
//
//   // "parser": "babel-eslint",  // extends: [
//   //   "plugin:vue/vue3-essential",
//   //   "eslint:recommended",
//   //   "@vue/eslint-config-prettier",
//   // ],
//   // rules: {
//   //   "vue/multi-word-component-names": "off",
//   // },
//   "extends": ["prettier", "eslint:recommended", "plugin:prettier/recommended"],
//   "plugins": ["prettier"],
//   "rules": {
//     "prettier/prettier": "error",
//   },
//   env: {
//     node: true,
//   }
// };

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    "no-unused-vars": "off",
    "vue/multi-word-component-names": ["error", {
      "ignores" : ["default", "Table"]
    }]//컴포넌트 이름이 규약(카멜)에 위배되서 나오는 오류로써, Table 처럼 컴포넌트 명을 추가해줘야 한다
  },
}
