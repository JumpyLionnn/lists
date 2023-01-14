import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { List } from 'db';

interface AddItemData {
    listId: number;
    content: string;
}

export function setupAddItemRoute(){
    const addItemDataSchema: JSONSchemaType<AddItemData> = {
        type: "object",
        properties: {
            content: {
                type: "string",
                minLength: 1,
                maxLength: 300,
                errorMessage: "Invalid list item. List items must be 1-300 characters."
            },
            listId: {
                type: "integer",
                nullable: false,
                errorMessage: "Invalid list id."
            }
        },
        required: ["content", "listId"],
        additionalProperties: false
    };

    const validateAddItemData = compileSchema(addItemDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Add item request.");
        const data: AddItemData = req.body;
        const validationSuccess = validateAddItemData(data);
        if (!validationSuccess) {
            console.log("Add item request faild. invalid data.");
            const message = validateAddItemData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to add item.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Add item user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const list = await List.findByPk(data.listId);
        if(list === null){
            console.log(`Add item faild. There is no list with id='${data.listId}'.`);
            res.status(400).send({error: "The list does not exist."});
            return;
        }

        if(list.creatorId !== userPayload.id){
            console.log(`Add item faild. The user with the id ${userPayload.id} does not own the list with id='${list.id}'.`);
            res.status(400).send({error: "You dont own the list."});
            return;
        }

        const item = await list.createItem({
            content: data.content
        });

        res.status(201).send({
            item: item
        });
        console.log("Item creation succeeded.");
    };
}