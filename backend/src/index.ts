import express from "express";
import cors from "cors";


async function main(){
    console.info("Starting the server.");
    const app = express();
    
    app.use(cors());

    app.get('/get', (req, res) => {
        res.send("hello from the server");
    });
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.info(`Listening on port ${port}.`);
    });
}

main();