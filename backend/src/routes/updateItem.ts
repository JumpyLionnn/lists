import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { List, ListItem, ListMember } from 'db';
import { sendMessageToList } from '../sockets';

interface UpdateItemData {
    itemId: number;
    content: string;
}

export function setupUpdateItemRoute(){
    const updateItemDataSchema: JSONSchemaType<UpdateItemData> = {
        type: "object",
        properties: {
            content: {
                type: "string",
                minLength: 1,
                maxLength: 300,
                transform: ["trim"],
                errorMessage: "Invalid list item content. List items must be 1-300 characters."
            },
            itemId: {
                type: "integer",
                nullable: false,
                errorMessage: "Invalid item id."
            }
        },
        required: ["content", "itemId"],
        additionalProperties: false
    };

    const validateUpdateItemData = compileSchema(updateItemDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Update item request.");
        const data: UpdateItemData = req.body;
        const validationSuccess = validateUpdateItemData(data);
        if (!validationSuccess) {
            console.log("Update item request faild. invalid data.");
            const message = validateUpdateItemData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to update item.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Update item user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const item = await ListItem.findByPk(data.itemId);
        if(item === null){
            console.log(`Update item faild. There is no item with id='${data.itemId}'.`);
            res.status(400).send({error: "The list does not exist."});
            return;
        }

        const member = await ListMember.findOne({
            where: {
                listId: item.listId,
                userId: userPayload.id
            }
        });

        if(member === null){
            console.log(`Update item faild. The user with the id ${userPayload.id} is not a member of the list with id='${item.listId}'.`);
            res.status(400).send({error: "You are not a member of this list."});
            return;
        }

        item.content = data.content;
        await item.save();

        const responseData = {
            item: item
        };
        sendMessageToList(item.listId, "item:update", responseData);

        res.status(201).send(responseData);
        console.log("Item update succeeded.");
    };
}