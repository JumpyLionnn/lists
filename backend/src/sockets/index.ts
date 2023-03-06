import { WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { getUserId } from "./verifyUser";
import connectionHandler from "./connection";

function init(server: HttpServer | HttpsServer): void {
    const wsServer = new WebSocketServer({
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

    wsServer.on("connection", connectionHandler);
}

export { sendMessageToList, joinListGroup, disconnectMember } from "./operations";
export default init;