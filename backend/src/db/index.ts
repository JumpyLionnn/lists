import assert from "assert";
import { Sequelize } from "sequelize";


let sequelize: Sequelize | null = null;

export async function init(): Promise<void> {
    assert(process.env.DATABASE_HOST, "Cannt connect to the database, DATABASE_HOST is missing in .env.");
    assert(process.env.DATABASE_PORT, "Cannt connect to the database, DATABASE_PORT is missing in .env.");
    assert(process.env.DATABASE_PASSWORD, "Cannt connect to the database, DATABASE_PASSWORD is missing in .env.");
    assert(process.env.DATABASE_USERNAME, "Cannt connect to the database, DATABASE_USERNAME is missing in .env.");
    assert(process.env.DATABASE_NAME, "Cannt connect to the database, DATABASE_NAME is missing in .env.");
    const port = parseInt(process.env.DATABASE_PORT);
    assert(!isNaN(port), "Cannt connect to the database, DATABASE_PORT is not a number.");

    sequelize = new Sequelize({
        database: process.env.DATABASE_NAME,
        dialect: "mysql",
        host: process.env.DATABASE_HOST,
        logging: (message: string) => { console.log(`Database: ${message}.`); },
        password: process.env.DATABASE_PASSWORD,
        port: port,
        username: process.env.DATABASE_USERNAME
    });

    console.info("Connecting to the database...");
    try {
        await sequelize.authenticate();
        console.info("Connection to the database has been established successfully.");
    }
    catch (error) {
        console.error(`Unable to connect to the database: ${error}`);
        return;
    }

    console.info("Initalizing models...");
    try {

        console.info("Models initialized successfully.");
    }
    catch (error) {
        console.error(`Faild to initalize the tables: ${error}`);
    }
}

export { sequelize };