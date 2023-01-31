<script lang="ts">
	import type { ItemData } from "$lib/models";
	import IconButton from "@smui/icon-button";
    import {Item, Text} from "@smui/list";
	import { createEventDispatcher } from "svelte";

    export let item: ItemData;

    const dispacher = createEventDispatcher();

    function onRemoveButtonClicked(){
        dispacher("remove", {
            item
        });
    }
</script>

<Item class="flex justify-between items-center hover:bg-gray-200 group py-7">
    <Text>{item.content}</Text>
    <IconButton class="material-icons hidden group-hover:block text-red-500 hover:text-red-600" on:click={onRemoveButtonClicked}>delete</IconButton>
</Item>