import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import {JSONSchemaType, compileSchema} from "validation";
import { User } from "db";

interface SignUpData {
    email: string;
    password: string;
    username: string;
}

export function setupSignupRoute(){
    const signUpDataSchema: JSONSchemaType<SignUpData> = {
        type: "object",
        properties: {
            email: {
                type: "string",
                format: "email",
                errorMessage: "Invalid email. Please enter a valid email."
            },
            password: {
                type: "string",
                minLength: 1,
                maxLength: 50,
                errorMessage: "Invalid password. Passwords must be 1-50 characters."
            },
            username: {
                type: "string",
                minLength: 1,
                maxLength: 50,
                errorMessage: "Invalid username. Usernames must be 1-50 characters."
            }
        },
        required: ["email", "password", "username"],
        additionalProperties: false
    };

    const validateSignUpData = compileSchema(signUpDataSchema);

    return async (req: Request, res: Response) => {
        console.log("Signup request.");
        const data: SignUpData = req.body;
        const validationSuccess = validateSignUpData(data);
        if (!validationSuccess) {
            console.log("Signup request invalid data.");
            const message = validateSignUpData.errors?.find((error) => error.message !== undefined)?.message ?? "Unable to signup.";
            res.status(400).send({error: message });
            return;
        }
    
        const existingUser = await User.findOne({
            where: {
                email: data.email
            }
        });
        if (existingUser !== null) {
            console.log("Signup request faild. This email is already in use.");
            res.status(400).send({error: "This email is already in use. Please try a different one." });
            return;
        }
    
        const hashedPassword = await bcrypt.hash(data.password, 10)
            .catch((error) => {
                console.error(`Unable to hash a password: ${error}.`);
                res.status(400).send({error: "Signup failed." });
            });
    
        if (!hashedPassword) {
            // error was reported in the catch block
            return;
        }
    
        await User.create({
            email: data.email,
            password: hashedPassword,
            username: data.username
        });
        
        console.log("Signup was successful.");
        res.status(200).send();
    };
}