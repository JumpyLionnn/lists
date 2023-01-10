import { Request, Response } from "express";

export function setupLogoutRoute(){
    return async (req: Request, res: Response) => {
        console.log("Logout request.");
        
        res.clearCookie("auth-token");
        
        res.status(200).send();
        console.log("Logout was successful.");
    };
}