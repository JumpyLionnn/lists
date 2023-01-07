import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { init as initLogger } from "./logging";
import { init as initDatabase } from "./db";
import { setupAuthRoutes } from './routes/auth';

async function main(){
    console.info("Starting the server.");
    const app = express();
    
    app.use(cors());
    app.use(express.json());

    await initDatabase();

    console.info("Setting up routes...");

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