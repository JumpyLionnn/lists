<script lang="ts">
    import {loggedIn, logout} from "$lib/api";
    import Button, { Label } from "@smui/button";
    import { goto } from "$app/navigation";

    function homePage(){
        goto("/");
    }

    function loginPage(){
        goto("/login");
    }

    function signupPage(){
        goto("/signup");
    }
</script>


<nav class="flex justify-between p-3">
    <div class="flex items-center">
        <Button color="secondary" on:click={homePage}>
            <Label>Lists (name needed)</Label>
        </Button>
    </div>
    <div class="flex items-center gap-4">
        {#if $loggedIn}
        <span>Welcome to lists</span>
        <Button on:click={logout} variant="outlined">
            <Label>Logout</Label>
        </Button>
        {:else}
        <Button on:click={loginPage} variant="outlined">
            <Label>Login</Label>
        </Button>
        <Button on:click={signupPage} variant="raised">
            <Label>Signup</Label>
        </Button>
        {/if}
    </div>
</nav>