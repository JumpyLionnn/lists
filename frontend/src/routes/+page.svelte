<script lang="ts">
    import {loggedIn, logout} from "$lib/api";
</script>



<h1>Home</h1>
{#if $loggedIn}
    <span>Welcome to lists!</span>
    <button on:click={logout}>Logout</button>
{:else}
    <a href="/signup">signup</a>
    <a href="/login">login</a>
{/if}
