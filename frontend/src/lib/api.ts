import { env } from "$env/dynamic/public";

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
        mode: "cors"
    });
}

async function post(path: string, options?: PostOptions){
    const url = baseUrl + path + getQueryString(options?.query);
    return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options?.body)
    });
}



export {
    get,
    post
};

export type { 
    GetOptions,
    QueryParams 
};
