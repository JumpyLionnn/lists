<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/desktop/Header.svelte";
    import { isMobile } from "$lib/platform";
    import type { PageData } from './$types';
    export let data: PageData;
</script>

{#if isMobile()}
   <slot></slot> 
{:else}
    {#if data.isMobileDevice}
        <h1>Please use the mobile app</h1>
    {:else}
        <div class="flex flex-col h-full"> 
            <Header />
            <div class="flex-grow overflow-hidden">
                <slot></slot>
            </div>
        </div>
    {/if}
{/if}
