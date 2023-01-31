import { Request, Response } from "express";
import { disconnectMember } from '../../sockets';

export function setupLogoutRoute(){
    return async (req: Request, res: Response) => {
        console.log("Logout request.");
        
        res.clearCookie("auth-token");

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Join list user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        disconnectMember(userPayload.id);

        res.status(200).send();
        console.log("Logout was successful.");
    };
}