import { env } from "$env/dynamic/public";
import { writable, type Writable, get as getStore } from "svelte/store";
import EventEmitter from "events";

const secure = env.PUBLIC_SERVER_SECURE === "true" ? true : false;
const protocolSuffix =  (secure ? "s" : "") + "://";
const serverUrl = env.PUBLIC_SERVER_URL ?? "";
const baseUrl = serverUrl + (serverUrl.endsWith("/") ? "" : "/");
const httpUrl = "http" + protocolSuffix + baseUrl;
const socketUrl = "ws" + protocolSuffix + baseUrl;

interface QueryParams{
    [key: string]: string | number;
}

interface GetOptions{
    query?: QueryParams;
}

interface PostOptions{
    body?: {[key: string]: unknown};
    query?: QueryParams;
}

function getQueryString(queryParams?: QueryParams){
    if(!queryParams){
        return "";
    }
    
    const stringifiedParams: {[key: string]: string} = {};
    Object.keys(queryParams).forEach(function(key) {
        stringifiedParams[key] = queryParams[key].toString();
    });
    const query = new URLSearchParams(stringifiedParams);
    const queryString = query.toString();
    if(queryString.length === 0){
        return "";
    }
    else{
        return "?" + queryString;
    }
}

async function get(path: string, options?: GetOptions){
    const url = httpUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    });
}

async function post(path: string, options?: PostOptions){
    const url = httpUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options?.body)
    });
}

async function patch(path: string, options?: PostOptions){
    const url = httpUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "PATCH",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options?.body)
    });
}

async function del(path: string, options?: PostOptions){
    const url = httpUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options?.body)
    });
}

const notifier = new EventEmitter();
let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const loggedIn: Writable<boolean | null> = writable(null);
function recreateSocket(){
    if(socket !== null){
        if(socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING){
            console.warn("logged in state changed to true but socket was already connected.");
            return;
        }
        else{
            socket.close();
        }
    }
    socket = new WebSocket(socketUrl + "listen");
    socket.onopen = () => {
        if(reconnectTimeout !== null){
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
            notifier.emit("reconnected");
            console.log("Reconnected successfully!");
        }
    }
    socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        notifier.emit(message.type, message.data);
    };
    socket.onclose = (event: CloseEvent) => {
        if(event.code !== 1001){
            console.error("Socket disconnected, making a reconnection attempt in 5 seconds...");
            reconnectTimeout = setTimeout(() => {
                if(socket !== null){
                    socket.close();
                }
                recreateSocket();
            }, 5000);
        }
    };
    socket.onerror = (error) => {
        console.error("socket error:",error);
    };
}
loggedIn.subscribe((value) => {
    if(value){
        recreateSocket();
    }
    else{
        socket?.close();
        socket = null;
        return;
    }
});

function sendEvent<T>(event: string, data?: T): void {
    if(socket && socket.readyState === socket.OPEN) {
        const eventData: {type: string, data?: T} = {
            type: event
        };
        if(data !== undefined) {
            eventData["data"] = data;
        }
        socket.send(JSON.stringify(eventData));
    }
    else {
        console.warn("Tried to send event but the socket was not connected");
    }
}

function isSocketConnected(): boolean {
    return socket !== null && socket.readyState === socket.OPEN;
}

(async () => {
    loggedIn.set((await (await get("check-auth")).json()).loggedIn);
})();

async function login(email: string, password: string){
    if(getStore(loggedIn)){
        console.error("Tried to login when the client is already logged in");
    }

    const response = await post("login", {
        body: {
            email: email,
            password: password
        }
    });

    if(response.ok){
        loggedIn.set(true);
        return {
            error: null,
            success: true
        }
    }
    else{
        const data = await response.json();
        return {
            error: data.error ?? "",
            success: false
        };
    }
    
}

async function logout(){
    if(!getStore(loggedIn)){
        console.error("Tried to logout when the client is not logged in");
    }
    const res = await post("logout");
    if(res.ok){
        loggedIn.set(false);
    }
}



export {
    get,
    post,
    patch,
    del,
    login,
    logout,
    isSocketConnected,
    sendEvent,
    loggedIn,
    notifier
};

export type { 
    GetOptions,
    QueryParams 
};
