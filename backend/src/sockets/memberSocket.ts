import { sockets } from "./state";

export class MemberSocket {
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
                console.warn(`socket id ${socketId} was registered but the socket does not exist.`);
            }
        }
    }

    public disconnectSockets(){
        for (const socketId of this.sockets) {
            const socket = sockets.get(socketId);
            if(socket){
                socket.close(1001);
            }
            else{
                console.warn(`socket id ${socketId} was registered but the socket does not exist.`);
            }
        }
    }
}