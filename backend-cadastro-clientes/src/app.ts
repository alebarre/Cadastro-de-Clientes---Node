/**
 * app.ts
 * Configura a aplicação Express, middlewares, rotas e Swagger.
 */
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

const swaggerSpec = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => res.send("API Cadastro de Clientes"));

export default app;
