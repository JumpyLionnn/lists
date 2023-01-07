<script lang="ts">
    async function get(){
        const response = await fetch("http://localhost:3000/get");
        
        if(response.ok){
            return response.text();
        }
        throw new Error(await response.text());
    }
    let serverResponse = get();
</script>


<h1>Welcome to SvelteKit</h1>
{#await serverResponse}
	<p>waiting for the server to respond...r</p>
{:then text}
	<p>{text}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
