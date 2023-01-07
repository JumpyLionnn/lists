<script lang="ts">
    import * as api from "$lib/api";

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
                console.log("Signup success.");
            }
            else{
                const data = await response.json();
                submitDisabled = false;
                error = data.error ?? null;
            }
        });
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
    </div>
    
</div>