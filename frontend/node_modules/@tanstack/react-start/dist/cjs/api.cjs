"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startApiRoutes = require("@tanstack/start-api-routes");
Object.keys(startApiRoutes).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startApiRoutes[k]
  });
});
//# sourceMappingURL=api.cjs.map
