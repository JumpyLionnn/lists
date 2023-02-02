import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { List, ListItem, ListMember } from 'db';
import { sendMessageToList } from '../sockets';

interface ToggleItemData {
    itemId: number;
    checked: boolean;
}

export function setupToggleItemRoute(){
    const toggleItemDataSchema: JSONSchemaType<ToggleItemData> = {
        type: "object",
        properties: {
            checked: {
                type: "boolean",
                errorMessage: "Invalid list item checked state."
            },
            itemId: {
                type: "integer",
                nullable: false,
                errorMessage: "Invalid item id."
            }
        },
        required: ["checked", "itemId"],
        additionalProperties: false
    };

    const validateToggleItemData = compileSchema(toggleItemDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Toggle item request.");
        const data: ToggleItemData = req.body;
        const validationSuccess = validateToggleItemData(data);
        if (!validationSuccess) {
            console.log("Toggle item request faild. invalid data.");
            const message = validateToggleItemData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to toggle item.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Toggle item user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const item = await ListItem.findByPk(data.itemId);
        if(item === null){
            console.log(`Toggle item faild. There is no item with id='${data.itemId}'.`);
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
            console.log(`Toggle item faild. The user with the id ${userPayload.id} is not a member of the list with id='${item.listId}'.`);
            res.status(400).send({error: "You are not a member of this list."});
            return;
        }

        item.checked = data.checked;
        await item.save();

        const responseData = {
            item: item
        };
        sendMessageToList(item.listId, "item:toggle", responseData);

        res.status(201).send(responseData);
        console.log("Item toggle succeeded.");
    };
}