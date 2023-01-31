import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { List, ListMember, User } from "db";

interface GetMembersData {
    listId: string;
}

export function setupGetMembersRoute(){

    const getMembersDataSchema: JSONSchemaType<GetMembersData> = {
        type: "object",
        properties: {
            listId: {
                type: "string",
                errorMessage: "Invalid list id.",
            }
        },
        required: ["listId"],
        additionalProperties: false
    };

    const validateGetMembersData = compileSchema(getMembersDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Get list members request.");

        const validationSuccess = validateGetMembersData(req.query);
        if (!validationSuccess) {
            console.log("Get members request faild. invalid data.");
            const message = validateGetMembersData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to get members.";
            res.status(400).send({error: message });
            return;
        }
        let listId: number;
        if(typeof req.query.listId === "string"){
            listId = parseInt(req.query.listId);
            if(isNaN(listId)){
                console.log("Get members request faild. invalid data.");
                res.status(400).send({error: "Invalid list id." });
                return;
            }
        }
        else{
            console.log("Get members request faild. invalid data.");
            res.status(400).send({error: "Invalid list id." });
            return;
        }


        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Get list members user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const list = await List.findByPk(listId);
        if(list === null){
            console.log(`Get members faild. There is no list with id='${listId}'.`);
            res.status(400).send({error: "The list does not exist."});
            return;
        }

        const member = await ListMember.findOne({
            where: {
                userId: userPayload.id,
                listId: list.id
            }
        });

        if(member === null){
            console.log(`Get members faild. The user with the id ${userPayload.id} is not a member of the list with id='${list.id}'.`);
            res.status(400).send({error: "You are not a memeber of this list."});
            return;
        }

        const members = await list.getMembers({
            include: {
                model: User,
                as: "user"
            }
        })

        res.status(200).send({
            members: members.map((member) => ({
                userId: member.user!.id,
                username: member.user!.username
            }))
        });
        console.log("Members get succeeded.");
    };
}