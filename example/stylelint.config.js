"use strict";

module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-idiomatic-order",
    "./node_modules/prettier-stylelint/config",
  ],
  rules: { "no-empty-source": null, "selector-list-comma-newline-after": null },
};
