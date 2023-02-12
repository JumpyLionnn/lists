<script lang="ts">
    import { loggedIn } from "$lib/api";
    import { isMobile } from "$lib/platform";
	import HomePage from "./HomePage.svelte";
	import DesktopListsPage from "$lib/components/desktop/ListsPage.svelte";
	import MobileListsPage from "$lib/components/mobile/ListsPage.svelte";
	import Redirect from "$lib/components/Redirect.svelte";
</script>

{#if $loggedIn}
    {#if isMobile()}
        <MobileListsPage />
    {:else}
        <DesktopListsPage />
    {/if}
{:else}
    {#if isMobile()}
        <Redirect route="/login" />
    {:else}
        <HomePage />
    {/if}
{/if}



