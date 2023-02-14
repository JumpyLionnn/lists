import { env } from "$env/dynamic/public";

const mobile = env.PUBLIC_PLATFORM === "mobile" ? true : false;

export function isMobile() {
    return mobile;
}