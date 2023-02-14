import nodeAdapter from "@sveltejs/adapter-node";
import staticAdapter from "@sveltejs/adapter-static";
import vercelAdapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";
import dotenv from "dotenv";
dotenv.config();

let adapter;
if(process.env.PUBLIC_PLATFORM === "mobile"){
	adapter = staticAdapter({
		pages: "build/mobile",
		fallback: "200.html"
	});
}
else if(process.env.PUBLIC_PLATFORM === "vercel"){
	adapter = vercelAdapter({
		runtime: "nodejs18.x",		
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
