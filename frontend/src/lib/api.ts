import { env } from '$env/dynamic/public';

const baseUrl = env.PUBLIC_SERVER_URL + (env.PUBLIC_SERVER_URL.endsWith("/") ? "" : "/");

interface QueryParams{
    [key: string]: string;
}

interface GetOptions{
    query?: QueryParams;
}

async function get(path: string, options?: GetOptions){
    const query = new URLSearchParams(options?.query ?? {});
    const queryString = query.toString();
    const url = baseUrl + path + (queryString.length === 0 ? "" : "?" + queryString);
    return fetch(url, {
        method: "GET",
        mode: "cors"
    });
}



export {
    get,
};

export type { 
    GetOptions,
    QueryParams 
};
