"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = decodeToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function decodeToken(token, SECRET_KEY) {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
}
//# sourceMappingURL=decodeToken.js.map