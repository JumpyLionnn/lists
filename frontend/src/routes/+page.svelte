<script lang="ts">
    import * as api from "$lib/api";

</script>



<h1>Home</h1>
{#if api.isLoggedIn()}
    <span>Welcome to lists!</span>
{:else}
    <a href="/signup">signup</a>
    <a href="/login">login</a>
{/if}
