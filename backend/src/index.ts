import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { createRequestLogger, init as initLogger } from "./logging";
import { init as initDatabase } from "./db";
import { setupAuthRoutes } from './routes/auth';
import { authRequired, init as initAuthProtector } from "middlewares/auth";
import assert from 'assert';

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

    app.use("/", setupAuthRoutes());

    console.info("Routes have been created successfully.");
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.info(`Listening on port ${port}.`);
    });
}

function initCore(){
    dotenv.config();
    initLogger();
}

initCore();
main();