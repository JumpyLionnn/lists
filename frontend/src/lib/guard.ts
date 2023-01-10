import { goto } from "$app/navigation";
import * as api from "$lib/api";

export function authRequired(){
    if(!api.isLoggedIn()){
        goto("/login");
    }
}


export function authForbidden(){
    if(api.isLoggedIn()){
        goto("/");
    }
}