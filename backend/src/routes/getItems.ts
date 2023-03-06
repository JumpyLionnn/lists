import { Request, Response } from "express";
import { List, ListMember } from "db";
import {JSONSchemaType, compileSchema} from "validation";

interface GetItemsData {
    listId: string;
}

export function setupGetItemsRoute(){
    
    const getItemsDataSchema: JSONSchemaType<GetItemsData> = {
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

    const validateGetItemsData = compileSchema(getItemsDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Get items request.");

        const validationSuccess = validateGetItemsData(req.query);
        if (!validationSuccess) {
            console.log("Get items request faild. invalid data.");
            const message = validateGetItemsData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to get items.";
            res.status(400).send({error: message });
            return;
        }
        let listId: number;
        if(typeof req.query.listId === "string"){
            listId = parseInt(req.query.listId);
            if(isNaN(listId)){
                console.log("Get items request faild. invalid data.");
                res.status(400).send({error: "Invalid list id." });
                return;
            }
        }
        else{
            console.log("Get items request faild. invalid data.");
            res.status(400).send({error: "Invalid list id." });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Get items user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const list = await List.findByPk(listId);
        if(list === null){
            console.log(`Get items faild. There is no list with id='${listId}'.`);
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
            console.log(`Get items faild. The user with the id ${userPayload.id} is not a member of the list with id='${list.id}'.`);
            res.status(400).send({error: "You are not a memeber of this list."});
            return;
        }

        const items = await list.getItems();

        res.status(200).send({
            items: items
        });
        console.log("Items get succeeded.");
    };
}