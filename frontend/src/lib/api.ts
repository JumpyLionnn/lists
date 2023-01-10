import { env } from "$env/dynamic/public";
import { writable, type Writable, get as getStore } from "svelte/store";

const baseUrl = env.PUBLIC_SERVER_URL + (env.PUBLIC_SERVER_URL.endsWith("/") ? "" : "/");

interface QueryParams{
    [key: string]: string;
}

interface GetOptions{
    query?: QueryParams;
}

interface PostOptions{
    body?: {[key: string]: unknown};
    query?: QueryParams;
}

function getQueryString(queryParams?: QueryParams){
    const query = new URLSearchParams(queryParams ?? {});
    const queryString = query.toString();
    if(queryString.length === 0){
        return "";
    }
    else{
        return "?" + queryString;
    }
}

async function get(path: string, options?: GetOptions){
    const url = baseUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "include"
    });
}

async function post(path: string, options?: PostOptions){
    const url = baseUrl + path + getQueryString(options?.query);
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

const loggedIn: Writable<boolean | null> = writable(null);
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
    loggedIn
};

export type { 
    GetOptions,
    QueryParams 
};
