<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import * as api from "$lib/api";
	import { goto } from '$app/navigation';

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
            goto("/");
        }
        else{
            error = response.error ?? null;
        }
    }
</script>

<style lang="postcss">
    .error{
        color: crimson;
    }
</style>

<div class="flex flex-col justify-center items-center gap-2">
    <h2 class="text-4xl">Login</h2>
    <div class="flex flex-col gap-3">
        <Textfield variant="filled" type="email" bind:value={email} label="Email">
            
        </Textfield>

        <Textfield variant="filled" type="password" bind:value={password} label="Password">
            
        </Textfield>
        {#if error !== null}
            <div class="error">{error}</div>
        {/if}
        <div class="flex flex-col items-center">
            <Button on:click={login} disabled={submitDisabled} variant="raised" class="px-8">
                <Label>
                    login
                </Label>
            </Button>
            <p>
                Don't have an account? <a href="/signup">Signup here!</a>
            </p>
        </div>
        
    </div>
    
</div>