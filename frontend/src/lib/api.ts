import { env } from "$env/dynamic/public";
import { writable, type Writable, get as getStore } from "svelte/store";
import EventEmitter from "events";

const secure = env.PUBLIC_SERVER_SECURE === "true" ? true : false;
const protocolSuffix =  (secure ? "s" : "") + "://";
const baseUrl = env.PUBLIC_SERVER_URL + (env.PUBLIC_SERVER_URL.endsWith("/") ? "" : "/");
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

const notifier = new EventEmitter();
let socket: WebSocket | null = null;
const loggedIn: Writable<boolean | null> = writable(null);
loggedIn.subscribe((value) => {
    if(value){
        if(socket && (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING)){
            console.warn("logged in state changed to true but socket was already connected");
            return;
        }
        socket = new WebSocket(socketUrl + "listen");
        socket.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            notifier.emit(message.type, message.data);
        };
        socket.onerror = (error) => {
            console.error(error);
        };
    }
    else{
        socket?.close();
        socket = null;
        return;
    }
});
loggedIn.set((await (await get("check-auth")).json()).loggedIn);

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
    login,
    logout,
    loggedIn,
    notifier
};

export type { 
    GetOptions,
    QueryParams 
};
