"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * app.ts
 * Configura a aplicação Express, middlewares, rotas e Swagger.
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger setup
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API Cadastro de Clientes",
        version: "1.0.0",
        description: "API para cadastro de clientes, produtos e pedidos"
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }]
};
const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/api", routes_1.default);
app.get("/", (req, res) => res.send("API Cadastro de Clientes"));
exports.default = app;
