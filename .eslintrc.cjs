/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  "parser": "babel-eslint",  // extends: [
  //   "plugin:vue/vue3-essential",
  //   "eslint:recommended",
  //   "@vue/eslint-config-prettier",
  // ],
  // rules: {
  //   "vue/multi-word-component-names": "off",
  // },
  "extends": ["prettier", "eslint:recommended", "plugin:prettier/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
  },
  env: {
    node: true,
  }
};
