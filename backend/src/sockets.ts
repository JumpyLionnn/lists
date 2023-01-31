import { WebSocket, WebSocketServer } from "ws";
import { Server as HttpServer, IncomingMessage, IncomingHttpHeaders } from "http";
import { Server as HttpsServer } from "https";
import * as cookie from "cookie";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { List, ListMember } from "db";

class MemberSocket {
    public sockets: Set<string>;
    public userId: number;
    public listIds: number[];

    constructor(socketId: string, userId: number, listIds: number[]) {
        this.sockets = new Set([socketId]);
        this.userId = userId;
        this.listIds = listIds;
    }

    public send(data: string){
        for (const socketId of this.sockets) {
            const socket = sockets.get(socketId);
            if(socket){
                socket.send(data);
            }
            else{
                console.error(`socket id ${socketId} was registered but the socket does not exist.`);
            }
        }
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
        if(!this.indices.has(object[this.propertyName])){
            this.objects.push(object);
            this.indices.set(object[this.propertyName], this.objects.length - 1);
        }
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

    get size(){
        return this.objects.length;
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
const sockets: Map<string, WebSocket> = new Map();

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
        let socketId = crypto.randomUUID();
        while(sockets.has(socketId)){
            socketId = crypto.randomUUID();
        }
        console.debug(`Socket joined with id of '${socketId}' and user id of ${userId}.`);
        sockets.set(socketId, socket);
        

        const listIds = userLists.map((list) => list.id);

        let member = members.get(userId);
        if(member !== undefined){
            member.sockets.add(socketId);
        }
        else{
            member = new MemberSocket(socketId, userId, listIds);
            members.set(userId, member);
        }
        
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
            if(member!.sockets.size === 1){
                // this is the last socket remaining
                members.delete(member!.userId);
                for (let i = 0; i < listIds.length; i++) {
                    const id = listIds[i];
                    const collection = lists.get(id)!;
                    if(collection.size === 1){
                        // this is the last member remaining in the list
                        lists.delete(id);
                    }
                    else{
                        collection.remove(member!.userId);
                    }
                }
            }
            else{
                member!.sockets.delete(socketId);
            }
        });
    });
}

export function sendMessageToListExcept<T>(listId: number, userId: number, eventName: string, data: T){
    const collection = lists.get(listId);
    const eventData = JSON.stringify({type: eventName, data: data});
    if(collection){
        for (const member of collection) {
            if(member.userId !== userId){
                member.send(eventData);
            }
        }
    }
    else{
        console.log(`Sending a message to ${listId} but the no members are connected to the list.`);
    }
}

export function sendMessageToList<T>(listId: number, eventName: string, data: T){
    const collection = lists.get(listId);
    const eventData = JSON.stringify({type: eventName, data: data});
    if(collection){
        for (const member of collection) {
            member.send(eventData);
        }
    }
}

export function joinListGroup(listId: number, userId: number){
    const collection = lists.get(listId);
    if(collection){
        const member = members.get(userId);
        if(member){
            collection.add(member);
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