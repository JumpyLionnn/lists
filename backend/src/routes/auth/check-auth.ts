import { Request, Response } from "express";
import passport from "passport";

export function setupCheckAuthRoute() {   
    return async (req: Request, res: Response, next: (...values: any) => void) => {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if(!user){
                res.send({
                    loggedIn: false
                });
                return;
            }
            res.send({
                loggedIn: true
            }); 
        })(req, res, next);
    }
}