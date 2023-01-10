<script lang="ts">
    import * as api from "$lib/api";
	import { goto } from '$app/navigation';
    import { authForbidden } from "$lib/guard";
    authForbidden();

    let email: string = "";
    let password: string = "";

    let error: string | null = null;

    let submitDisabled = false;

    async function login(){
        error = null;
        submitDisabled = true;

        const response = await api.login(email, password);
        submitDisabled = false;

        if(response.success){
            await api.get("secure");
            goto("/");
        }
        else{
            error = response.error ?? null;
        }
    }
</script>

<style lang="scss">
    .error{
        color: crimson;
    }

    #form{
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
</style>

<div>
    <h2>Login</h2>
    <div id="form">
        <input type="email" placeholder="email" bind:value={email}>
        <input type="password" placeholder="password" bind:value={password}>
        {#if error !== null}
            <div class="error">{error}</div>
        {/if}
        <button on:click={login} disabled={submitDisabled}>login</button>
        <p>
            Don't have an account? <a href="/signup">Signup here!</a>
        </p>
    </div>
    
</div>