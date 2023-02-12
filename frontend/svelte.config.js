import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';


const isMobileBuild = process.env.PUBLIC_MOBILE_BUILD === "true" ? true : false;
let adapter;
if(isMobileBuild){
	adapter = staticAdapter({
		pages: "build/mobile",
		fallback: "200.html"
	});
}
else{
	adapter = nodeAdapter({
		out: "build/browser"
	});
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter
	}
};

export default config;
