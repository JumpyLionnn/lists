import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { User } from "db";
import assert from 'assert';

export function setupLoginRoute() {
    assert(process.env.PASSWORD_JWT_SECRET, "Please provide the password jwt secret in the .env file.");
    passport.use("login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void) => {
        console.log("Password login request.");
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            console.log("Password login faild, unable to find the user.");
            done(null, false, { message: "Email or password invalid." });
            return;
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            done(null, user);
        }
        else {
            console.log("Password login faild, passwords do not match.");
            done(null, false, { message: "Email or password invalid." });
            return;
        }
    }));

    return async (req: Request, res: Response, next: (...values: any) => void) => {
        passport.authenticate("login", (err, user, info) => {
            if(!user){
                if(info){
                    res.status(400).send({error: info.message});
                }
                else{
                    console.error(`Password login error: ${err}.`);
                }
                return;
            }

            req.login(
                user,
                { session: false },
                async (error) => {
                    if (error) {
                        console.error(`Password login error: ${error} in 'req.login'.`);
                    }
                    const token = jwt.sign({ id: user.id }, process.env.PASSWORD_JWT_SECRET!);

                    res.cookie("auth-token", token, { httpOnly: true, secure: true, sameSite: 'none' });
                    res.status(200).send();
                    console.log("Password login was successful.");
                }
            );
        })(req, res, next);
    }
}