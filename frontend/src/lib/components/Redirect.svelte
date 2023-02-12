<script lang="ts">
    import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    export let route: string;

    onMount(() => {
        goto(route, {
            replaceState: true
        });
    })
</script>