"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsSsr = require("@tanstack/start-server-functions-ssr");
Object.keys(startServerFunctionsSsr).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerFunctionsSsr[k]
  });
});
//# sourceMappingURL=server-functions-ssr.cjs.map
