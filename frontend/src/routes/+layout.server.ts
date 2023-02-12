import type { ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { isMobile } from '$lib/platform';

let load: LayoutServerLoad;
if(isMobile()){
    // Will be mobile app
    load = (() => ({isMobile: true})) satisfies LayoutServerLoad;
}
else{
    
    load = ((loadData: ServerLoadEvent) => {
        const userAgent = loadData.request.headers.get("user-agent");
        let isMobileDevice = false;
        if(userAgent !== null) {
            isMobileDevice = /iPhone|webOS|iPad|iPod|Android|BlackBerry|Windows Phone|Opera Mini|IEMobile/i.test(userAgent);
        }
        return {
            isMobileDevice
        };
    }) satisfies LayoutServerLoad;
}

export {load};


export const prerender = isMobile();
