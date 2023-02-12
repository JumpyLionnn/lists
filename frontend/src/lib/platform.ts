import { env } from "$env/dynamic/public";

const mobile = env.PUBLIC_MOBILE_BUILD === "true" ? true : false;

export function isMobile() {
    return mobile;
}