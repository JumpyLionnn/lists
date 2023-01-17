import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { createRequestLogger, init as initLogger } from "./logging";
import { init as initDatabase } from "./db";
import { authRequired, init as initAuthProtector } from "middlewares/auth";
import assert from 'assert';
import { setupRoutes } from './routes/index';
import { init as initWebSockets } from "sockets";

async function main(){
    console.info("Starting the server.");
    const app = express();
    
    assert(process.env.FRONTEND, "Please provide the frontend url in the .env file.");
    app.use(cors({credentials: true, origin: process.env.FRONTEND!}));
    app.use(createRequestLogger());
    app.use(express.json());
    app.use(cookieParser());

    await initDatabase();

    console.info("Setting up routes...");

    initAuthProtector();
    app.get("/secure", authRequired(), (req, res) => {
        res.send("You made it into the secure route");
    });

    app.use("/", setupRoutes());

    console.info("Routes have been created successfully.");
    
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.info(`Listening on port ${port}.`);
    });

    initWebSockets(server);
}

function initCore(){
    dotenv.config();
    initLogger();
}

initCore();
main();