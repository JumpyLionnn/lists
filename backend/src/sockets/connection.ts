import { List, ListMember } from "db";
import { IncomingMessage } from "http";
import { RawData, WebSocket } from "ws";
import { lists, members, sockets } from "./state";
import ObjectCollection from "./objectCollection";
import * as crypto from "crypto";
import { MemberSocket } from "./memberSocket";
import { handleAction, onDisconnect, registerMemberStatus } from "./memberStatusRefresher";

async function connectionHandler(socket: WebSocket, request: IncomingMessage, userId: number): Promise<void> {
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

    let socketId = generateSocketUUID();
    console.debug(`Socket joined with id of '${socketId}' and user id of ${userId}.`);
    sockets.set(socketId, socket);

    const listIds = userLists.map((list) => list.id);

    let member = members.get(userId);
    if (member !== undefined) {
        member.sockets.add(socketId);
    }
    else {
        member = new MemberSocket(socketId, userId, listIds);
        members.set(userId, member);
    }

    for (let i = 0; i < listIds.length; i++) {
        const id = listIds[i];
        const collection = lists.get(id);
        if (collection) {
            collection.add(member);
        }
        else {
            const collection = new ObjectCollection<MemberSocket, "userId">("userId");
            collection.add(member);
            lists.set(id, collection);
        }
    }
    registerMemberStatus(member);
    socket.on("message", registerMessageHandler(socket, member));

    socket.on("close", () => {
        if(member === undefined){
            console.error("Socket closed and member is undefined");
            return;
        }
        onDisconnect(member);
        if (member.sockets.size === 1) {
            // this is the last socket remaining
            members.delete(member.userId);
            for (let i = 0; i < listIds.length; i++) {
                const id = listIds[i];
                const collection = lists.get(id)!;
                if (collection.size === 1) {
                    // this is the last member remaining in the list
                    lists.delete(id);
                }
                else {
                    collection.remove(member.userId);
                }
            }
        }
        else {
            member.sockets.delete(socketId);
        }
        console.log(`Socket ${socketId} disconnected.`);
    });
}

function registerMessageHandler(socket: WebSocket, member: MemberSocket): (data: RawData) => void {
    return (data: RawData) => {
        if(Array.isArray(data)) {
            return;
        }
        const str = data.toString();
        let jsonData: unknown;
        try {
            jsonData = JSON.parse(str);
        }
        catch {
            return;
        }
        if(typeof jsonData === "object" && jsonData !== null && "type" in jsonData && typeof jsonData.type === "string") {
            switch (jsonData.type) {
                case "action":
                    handleAction(member);
                    break;
                default:
                    break;
            }
        }
    };
}

function generateSocketUUID(): string {
    let uuid = crypto.randomUUID();
    while (sockets.has(uuid)) {
        uuid = crypto.randomUUID();
    }
    return uuid;
}

export default connectionHandler;