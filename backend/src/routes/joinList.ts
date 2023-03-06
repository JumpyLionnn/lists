import { Request, Response } from "express";
import { List, ListMember } from "db";
import {JSONSchemaType, compileSchema} from "validation";
import { sendMessageToList } from 'sockets';
import { Op } from "sequelize";

interface JoinListData {
    joinCode: string;
}

export function setupJoinListRoute(){
    
    const joinListDataSchema: JSONSchemaType<JoinListData> = {
        type: "object",
        properties: {
            joinCode: {
                type: "string",
                maxLength: 6,
                minLength: 6,
                errorMessage: "Invalid list join code.",
            }
        },
        required: ["joinCode"],
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
        
        const list = await List.findOne({
            where: {
                joinCode: {
                    [Op.eq]: data.joinCode
                }
            }
        });

        if(list === null){
            console.log(`Join list faild. There is no list with join code='${data.joinCode}'.`);
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

        sendMessageToList(list.id, "list:join", {
            member: {
                userId: member.userId,
                username: (await member.getUser()).username
            }
        });

        res.status(200).send({
            member: member,
            list: list
        });
        console.log("List join succeeded.");
    };
}