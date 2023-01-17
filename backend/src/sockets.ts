import { WebSocket, WebSocketServer } from "ws";
import { Server as HttpServer, IncomingMessage, IncomingHttpHeaders } from "http";
import { Server as HttpsServer } from "https";
import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";
import { List, ListMember } from "db";

class MemberSocket {
    public socket: WebSocket;
    public userId: number;
    public listIds: number[];

    constructor(socket: WebSocket, userId: number, listIds: number[]) {
        this.socket = socket;
        this.userId = userId;
        this.listIds = listIds;
    }

    public send<T>(eventName: string, data: T){
        this.socket.send(JSON.stringify({type: eventName, data: data}));
    }
}

class ObjectCollection<T, Key extends keyof T>{
    private objects: T[] = [];
    private indices: Map<T[Key], number> = new Map();
    private propertyName: Key;
    constructor(propertyName: Key){
        this.propertyName = propertyName;
    }

    add(object: T) {
        this.objects.push(object);
        this.indices.set(object[this.propertyName], this.objects.length - 1);
    }

    remove(property: T[Key]) {
        if (this.indices.has(property)) {
            let index = this.indices.get(property)!;
            if(index === this.objects.length - 1){
                this.objects.pop();
            }
            else{
                this.objects[index] = this.objects.pop()!;
                this.indices.set(this.objects[index][this.propertyName], index);
            }
            this.indices.delete(property);
        }
    }

    [Symbol.iterator]() {
        let index = 0;
        let objects = this.objects;
        return {
            next() {
                if (index < objects.length) {
                    return { value: objects[index++], done: false };
                } else {
                    return { value: objects[index++], done: true };
                }
            }
        };
    }
}


const lists: Map<number, ObjectCollection<MemberSocket, "userId">> = new Map();
const members: Map<number, MemberSocket> = new Map();

let wsServer: WebSocketServer;

export function init(server: HttpServer | HttpsServer) {
    wsServer = new WebSocketServer({
        noServer: true,
        path: "/listen"
    });

    server.on("upgrade", async (request, socket, head) => {
        console.log("A connection is requesting an upgrade.");
        const userId = await getUserId(request.headers);
        if(userId === null){
            console.log("Upgrade faild. cannot verify jwt.");
            request.socket.destroy();
        }
        else{
            console.log("Connection upgrade success.");
            wsServer.handleUpgrade(request, socket, head, function done(ws) {
                wsServer.emit('connection', ws, request, userId);
            });
        }
    });

    wsServer.on("connection", async (socket: WebSocket, request: IncomingMessage, userId: number) => {
        const userLists = await List.findAll({
            include: [
                {
                    model: ListMember,
                    as: "members",
                    where: {
                        userId: userId
                    }
                }
            ]
        });

        const listIds = userLists.map((list) => list.id);

        const member = new MemberSocket(socket, userId, listIds);
        
        members.set(userId, member);
        for (let i = 0; i < listIds.length; i++) {
            const id = listIds[i];
            const collection = lists.get(id);
            if(collection){
                collection.add(member);
            }
            else{
                const collection = new ObjectCollection<MemberSocket, "userId">("userId");
                collection.add(member);
                lists.set(id, collection);
            }
        }

        socket.on("close", () => {
            members.delete(member.userId);
            for (let i = 0; i < listIds.length; i++) {
                const id = listIds[i];
                const collection = lists.get(id)!;
                collection.remove(member.userId);
            }
        });
    });
}

export function sendMessage<T>(listId: number, userId: number, eventName: string, data: T){
    const collection = lists.get(listId);
    if(collection){
        for (const member of collection) {
            if(member.userId !== userId){
                member.send(eventName, data);
            }
        }
    }
}

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

async function getUserId(headers: IncomingHttpHeaders) {
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