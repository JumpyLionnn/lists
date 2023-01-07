import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { init as initLogger } from "./logging";
import { init as initDatabase } from "./db";

async function main(){
    console.info("Starting the server.");
    const app = express();
    
    app.use(cors());

    await initDatabase();

    app.get('/get', (req, res) => {
        res.send("hello from the server");
    });
    
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