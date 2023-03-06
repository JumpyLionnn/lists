import { List, ListMember } from "db";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { lists, members, sockets } from "./state";
import ObjectCollection from "./objectCollection";
import * as crypto from "crypto";
import { MemberSocket } from "./memberSocket";

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

    socket.on("close", () => {
        if (member!.sockets.size === 1) {
            // this is the last socket remaining
            members.delete(member!.userId);
            for (let i = 0; i < listIds.length; i++) {
                const id = listIds[i];
                const collection = lists.get(id)!;
                if (collection.size === 1) {
                    // this is the last member remaining in the list
                    lists.delete(id);
                }
                else {
                    collection.remove(member!.userId);
                }
            }
        }
        else {
            member!.sockets.delete(socketId);
        }
        console.log(`Socket ${socketId} disconnected.`);
    });
}


function generateSocketUUID(): string {
    let uuid = crypto.randomUUID();
    while (sockets.has(uuid)) {
        uuid = crypto.randomUUID();
    }
    return uuid;
}

export default connectionHandler;