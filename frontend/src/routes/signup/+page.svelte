<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import * as api from "$lib/api";
	import { authForbidden } from "$lib/guard";
	import { goto } from "$app/navigation";
    authForbidden();

    let username: string = "";
    let email: string = "";
    let password: string = "";
    let confirmPassword: string = "";

    let error: string | null = null;

    let submitDisabled = false;

    async function signup(){
        error = null;
        if(password !== confirmPassword){
            error = "Password and confirm password do not match. Please try again.";
            return;
        }

        submitDisabled = true;
        const signupPromise = api.post("signup", {
            body: {
                username: username,
                email: email,
                password: password
            }
        });

        signupPromise.then(async (response) => {
            if(response.ok){
                submitDisabled = false;
                goto("login");
            }
            else{
                const data = await response.json();
                submitDisabled = false;
                error = data.error ?? null;
            }
        });
    }
</script>

<style lang="postcss">
    .error{
        color: crimson;
    }
</style>

<div class="flex flex-col justify-center items-center h-full gap-2">
    <h2 class="text-4xl">Signup</h2>
    <form class="flex flex-col gap-3" autocomplete="off" autosave="off">
        <Textfield variant="filled" type="text" bind:value={username} label="Username">
            
        </Textfield>
        <Textfield variant="filled" type="email" bind:value={email} label="Email"  autocomplete="off" autosave="off">
            
        </Textfield>

        <Textfield variant="filled" type="password" bind:value={password} label="Password">
            
        </Textfield>
        <Textfield variant="filled" type="password" bind:value={confirmPassword} label="Confirm password">
            
        </Textfield>
        {#if error !== null}
            <div class="error">{error}</div>
        {/if}
        <div class="flex flex-col items-center">
            <Button on:click={signup} disabled={submitDisabled} variant="raised" class="px-8">
                <Label>
                    signup
                </Label>
            </Button>
            <p>
                Already have an account? <a href="/login">Login here!</a>
            </p>
        </div>
        
    </form>
    
</div>

<!-- <div>
    <h2>Signup</h2>
    <div id="form">
        <input type="text" placeholder="username" bind:value={username}>
        <input type="email" placeholder="email" bind:value={email}>
        <input type="password" placeholder="password" bind:value={password}>
        <input type="password" placeholder="confirm password" bind:value={confirmPassword}>
        {#if error !== null}
            <div class="error">{error}</div>
        {/if}
        <button on:click={signup} disabled={submitDisabled}>signup</button>
        <p>
            Already have an account? <a href="/login">Login here!</a>
        </p>
    </div>
    
</div> -->