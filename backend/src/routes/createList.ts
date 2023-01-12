import { Request, Response } from "express";
import {JSONSchemaType, compileSchema} from "validation";
import { User } from "db";

interface CreateListData {
    name: string;
}

export function setupCreateListRoute(){
    const createListDataSchema: JSONSchemaType<CreateListData> = {
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength: 1,
                maxLength: 50,
                errorMessage: "Invalid list name. List names must be 1-50 characters."
            }
        },
        required: ["name"],
        additionalProperties: false
    };

    const validateCreateListData = compileSchema(createListDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Create list request.");
        const data: CreateListData = req.body;
        const validationSuccess = validateCreateListData(data);
        if (!validationSuccess) {
            console.log("Create list request faild. invalid data.");
            const message = validateCreateListData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to create list.";
            res.status(400).send({error: message });
            return;
        }

        const userPayload = <{ id: number } | undefined>req.user;
        if(!(userPayload && userPayload.id)){
            console.error("Create list user payload id is not defined.");
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const user = await User.findByPk(userPayload.id);
        if(user === null){
            console.error(`Create list user was not found with id '${userPayload.id}'.`);
            res.status(500).send({error: "Internal server error."});
            return;
        }

        const list = await user.createList({
            name: data.name
        });

        res.status(201).send({
            list: list
        });
        console.log("List creation succeeded.");
    };
}