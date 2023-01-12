<script lang="ts">
    import { loggedIn } from "$lib/api";
	import HomePage from "./HomePage.svelte";
	import ListsPage from "./ListsPage.svelte";
</script>

{#if $loggedIn}
    <ListsPage />
{:else}
    <HomePage />
{/if}



