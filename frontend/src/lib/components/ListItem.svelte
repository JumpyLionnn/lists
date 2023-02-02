<script lang="ts">
	import { ClassList } from "$lib/classList";
	import type { ItemData } from "$lib/models";
	import IconButton from "@smui/icon-button";
	import Checkbox from "@smui/checkbox";
    import {Item} from "@smui/list";
	import { createEventDispatcher } from "svelte";
    import * as api from "$lib/api";

    export let item: ItemData;

    let contentInput: HTMLInputElement;
    let previousContent: string;

    let itemClassList = new ClassList("flex", "justify-between", "items-center", "hover:bg-gray-200", "group", "py-7");
    let removeButtonClassList = new ClassList("material-icons", "group-hover:block", "text-red-500", "hover:text-red-600", "hidden");

    const dispacher = createEventDispatcher();

    function onRemoveButtonClicked(){        
        dispacher("remove", {
            item
        });
    }

    function onContentChange(){
        contentInput.blur();
        item.content = item.content.trim();
        if(item.content.length === 0){
            console.log(item.content);
            item.content = previousContent;
            return;
        }
        api.patch("lists/items/update", {
            body: {
                itemId: item.id,
                content: item.content
            }
        });
    }

    function onInputFocused(){
        previousContent = item.content;
        itemClassList.add("bg-gray-200");
        removeButtonClassList.replace("hidden", "block");
    }

    function onInputBlured(){
        itemClassList.remove("bg-gray-200");
        removeButtonClassList.replace("block", "hidden");
    }

    function onCheckedChange(event: CustomEvent<any>){
        const checked = (<HTMLInputElement>event.target).checked;
        api.patch("lists/items/toggle", {
            body: {
                itemId: item.id,
                checked: checked
            }
        });
    }
</script>
<style>
    input{
        outline: 0;
    }
</style>

<Item class={$itemClassList}>
    <Checkbox on:change={onCheckedChange} bind:checked={item.checked} />
    <input type="text" name="content" class={"appearance-none w-full border-y-2 border-transparent border-solid bg-transparent focus:border-b-black"} class:line-through={item.checked} bind:this={contentInput} bind:value={item.content} on:change={onContentChange} on:focus={onInputFocused} on:blur={onInputBlured}>
    <IconButton class={$removeButtonClassList} on:click={onRemoveButtonClicked}>delete</IconButton>
</Item>