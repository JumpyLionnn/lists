import { Request, Response } from "express";
import { List } from "db";
import {JSONSchemaType, compileSchema} from "validation";
import { ListMember } from '../db/models/listMember';

interface JoinListData {
    listId: number;
}

export function setupJoinListRoute(){
    
    const joinListDataSchema: JSONSchemaType<JoinListData> = {
        type: "object",
        properties: {
            listId: {
                type: "integer",
                errorMessage: "Invalid list id.",
            }
        },
        required: ["listId"],
        additionalProperties: false
    };

    const validateJoinListData = compileSchema(joinListDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Join list request.");

        const data: JoinListData = req.body;
        const validationSuccess = validateJoinListData(data);
        if (!validationSuccess) {
            console.log("Join list request faild. invalid data.");
            const message = validateJoinListData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to join list.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Join list user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const list = await List.findByPk(data.listId);
        if(list === null){
            console.log(`Join list faild. There is no list with id='${data.listId}'.`);
            res.status(400).send({error: "The list does not exist."});
            return;
        }

        const existingMember = await ListMember.findOne({
            where: {
                userId: userPayload.id,
                listId: list.id
            }
        });

        if(existingMember !== null){
            console.log(`Join list faild. The user with the id ${userPayload.id} is already a member of the list with id='${list.id}'.`);
            res.status(400).send({error: "You are already a memeber of this list."});
            return;
        }
        
        const member = await list.createMember({
            userId: userPayload.id
        });

        res.status(200).send({
            member: member,
            list: list
        });
        console.log("List join succeeded.");
    };
}