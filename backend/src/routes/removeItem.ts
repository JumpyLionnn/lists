import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { ListItem, ListMember } from "db";
import { sendMessageToList } from "sockets";

interface RemoveItemData {
    itemId: number;
}

export function setupRemoveItemRoute(){
    const removeItemDataSchema: JSONSchemaType<RemoveItemData> = {
        type: "object",
        properties: {
            itemId: {
                type: "integer",
                nullable: false,
                errorMessage: "Invalid item id."
            }
        },
        required: ["itemId"],
        additionalProperties: false
    };

    const validateRemoveItemData = compileSchema(removeItemDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Remove item request.");
        const data: RemoveItemData = req.body;
        const validationSuccess = validateRemoveItemData(data);
        if (!validationSuccess) {
            console.log("Remove item request faild. invalid data.");
            const message = validateRemoveItemData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to remove item.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Remove item user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const item = await ListItem.findByPk(data.itemId);
        if(item === null){
            console.log(`Remove item faild. There is no item with id='${data.itemId}'.`);
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
            console.log(`Remove item faild. The user with the id ${userPayload.id} is not a member of the list with id='${item.listId}'.`);
            res.status(400).send({error: "You are not a member of this list."});
            return;
        }

        await item.destroy();

        const responseData = {
            item: item
        };
        sendMessageToList(item.listId, "item:remove", responseData);

        res.status(201).send(responseData);
        console.log("Item removal succeeded.");
    };
}