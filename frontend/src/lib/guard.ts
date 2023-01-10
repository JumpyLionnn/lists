import { goto } from "$app/navigation";
import {get as getStore} from "svelte/store";
import * as api from "$lib/api";

export function authRequired(){
    if(!getStore(api.loggedIn)){
        goto("/login");
    }
}


export function authForbidden(){
    if(getStore(api.loggedIn)){
        goto("/");
    }
}