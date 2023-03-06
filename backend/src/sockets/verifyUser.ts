import { IncomingHttpHeaders } from "http";
import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";

function verifyJwt(token: string): Promise<string | jwt.JwtPayload | null>{
    return new Promise((resolve) => {
        jwt.verify(token, process.env.PASSWORD_JWT_SECRET!, (error, decoded) => {
            if(error !== null){
                resolve(null);
            }
            else{
                resolve(decoded ?? null);
            }
        })
    });
}

export async function getUserId(headers: IncomingHttpHeaders) {
    if(!headers.cookie){
        return null;
    }

    const cookies = cookie.parse(headers.cookie);
    if(!cookies){
        return null;
    }

    const payload = await verifyJwt(cookies["auth-token"]);
    if(payload === null){
        return null;
    }

    if(typeof payload === "string"){
        return null;
    }

    if(payload.id){
        return <number>payload.id;
    }
    else{
        return null;
    }
}