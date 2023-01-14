import { Router } from "express";
import { setupAuthRoutes } from "./auth";
import { authRequired } from 'middlewares/auth';
import { setupCreateListRoute } from "./createList";
import { setupGetListRoute } from "./getLists";
import { setupAddItemRoute } from "./addItem";
import { setupGetItemsRoute } from "./getItems";

export function setupRoutes(){
    const router = Router();

    // routes that doesnt require authentication
    router.use(setupAuthRoutes());

    router.use(authRequired());
    // routes that require authentication
    router.post("/lists/create", setupCreateListRoute());
    router.get("/lists", setupGetListRoute());
    router.post("/lists/items/create", setupAddItemRoute());
    router.get("/lists/items", setupGetItemsRoute());


    return router;
}