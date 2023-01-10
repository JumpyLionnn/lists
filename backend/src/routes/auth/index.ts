import { Router } from "express";
import { setupSignupRoute } from "./signup";
import { setupLoginRoute } from "./login";
import { setupCheckAuthRoute } from "./check-auth";
import { setupLogoutRoute } from "./logout";

export function setupAuthRoutes(){
    const router = Router();

    router.post("/signup", setupSignupRoute());
    router.post("/login", setupLoginRoute());
    router.post("/logout", setupLogoutRoute());
    router.get("/check-auth", setupCheckAuthRoute());

    return router;
}