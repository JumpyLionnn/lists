import { Request, Response } from "express";
import { List } from "db";

export function setupGetListRoute(){
    return async (req: Request, res: Response) => {
        console.log("Get list request.");

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Get list user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const lists = await List.findAll({
            where: {
                creatorId: userPayload.id
            }
        });

        res.status(200).send({
            lists: lists
        });
        console.log("List get succeeded.");
    };
}