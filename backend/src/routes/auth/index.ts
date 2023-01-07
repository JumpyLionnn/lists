import { Router } from "express";
import { setupSignupRoute } from "./signup";

export function setupAuthRoutes(){
    const router = Router();

    router.post("/signup", setupSignupRoute());

    return router;
}