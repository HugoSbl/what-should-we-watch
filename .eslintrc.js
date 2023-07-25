module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    "plugin:vue/recommended",
    "plugin:vue/vue3-essential",
    "eslint:recommended",

    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/attribute-hyphenation": "off", //not necessary with vue 3
    "vue/no-v-model-argument": "off", //not necessary with vue 3
    "prettier/prettier": "off",
    "vue/no-v-html": "off", // only used with trusted content : tvMaze API show summary
    "vue/require-default-prop": "off", // lot of v-if verifications made through the presence of value into an object
    "vue/multi-word-component-names": "off", // in order to keep index.vue as a landing page without modyfing the name
    "vue/component-name-in-template-casing": "off", // let me name my components as I want to
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    requireConfigFile: false,
    parser: "@babel/eslint-parser",
  },
};
