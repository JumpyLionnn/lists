import { PUBLIC_MOBILE_BUILD } from "$env/static/public";

const mobile = PUBLIC_MOBILE_BUILD === "true" ? true : false;

export function isMobile() {
    return mobile;
}