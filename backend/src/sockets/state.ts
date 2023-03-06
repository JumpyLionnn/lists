import { WebSocketServer, WebSocket } from "ws";
import ObjectCollection from "./objectCollection";
import { MemberSocket } from "./memberSocket";

export const lists: Map<number, ObjectCollection<MemberSocket, "userId">> = new Map();
export const members: Map<number, MemberSocket> = new Map();
export const sockets: Map<string, WebSocket> = new Map();