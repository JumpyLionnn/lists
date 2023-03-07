<script lang="ts">
	import { cooldownWritable } from "$lib/cooldown";
    import * as api from "$lib/api";



    const actionStore = cooldownWritable(0, 5000);

    function handleAction() {
        actionStore.update(x => x + 1);
    }

    actionStore.subscribe(() => {
        if(api.isSocketConnected()){
            api.sendEvent("action");
        }
    });
</script>

<svelte:window on:keydown={handleAction} on:keyup={handleAction} on:mousemove={handleAction} on:mousedown={handleAction} on:mouseup={handleAction} on:wheel={handleAction}/>