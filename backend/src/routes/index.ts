import { Router } from "express";
import { setupAuthRoutes } from "./auth";
import { authRequired } from 'middlewares/auth';
import { setupCreateListRoute } from "./createList";
import { setupGetListRoute } from "./getLists";
import { setupAddItemRoute } from "./addItem";
import { setupGetItemsRoute } from "./getItems";
import { setupJoinListRoute } from "./joinList";
import { setupGetMembersRoute } from "./getMembers";
import { setupRemoveItemRoute } from "./removeItem";
import { setupUpdateItemRoute } from "./updateItem";
import { setupToggleItemRoute } from "./toggleItem";

export function setupRoutes(){
    const router = Router();

    // routes that doesnt require authentication
    router.use(setupAuthRoutes());

    router.use(authRequired());
    // routes that require authentication
    router.post("/lists/create", setupCreateListRoute());
    router.post("/lists/join", setupJoinListRoute());
    router.get("/lists", setupGetListRoute());
    router.post("/lists/items/create", setupAddItemRoute());
    router.delete("/lists/items/remove", setupRemoveItemRoute());
    router.patch("/lists/items/update", setupUpdateItemRoute());
    router.patch("/lists/items/toggle", setupToggleItemRoute());
    router.get("/lists/items", setupGetItemsRoute());
    router.get("/lists/members", setupGetMembersRoute());


    return router;
}