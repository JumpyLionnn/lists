<script lang="ts">
    import Textfield from "@smui/textfield";
    import Accordion, { Panel, Header, Content as AccordionContent } from '@smui-extra/accordion';
    import List from "@smui/list";
    import * as api from "$lib/api";
	import Button, { Label } from "@smui/button";
	import type { ListData, ItemData } from "$lib/models";
	import { onDestroy, onMount } from "svelte";
	import ListItem from "$lib/components/ListItem.svelte";
	import RemoveItemDialog from "$lib/components/dialogs/RemoveItemDialog.svelte";
	import IconButton, { Icon } from "@smui/icon-button";

    export let list: ListData;

    let itemName = "";
    let items: ItemData[] = [];
    let checkedItems: ItemData[] = [];

    async function loadListData(){
        items = [];
        checkedItems = [];
        const res = await api.get("lists/items", {
            query: {
                listId: list.id
            }
        });
        
        if(res.ok){
            const data = await res.json();
            for (const item of data.items) {
                if(item.checked){
                    checkedItems.push(item);
                }
                else{
                    items.push(item);
                }
            }
            items = items;
            checkedItems = checkedItems;
        }
    }
    loadListData();

    onMount(() => {
        api.notifier.addListener("item:add", addItem);
        api.notifier.addListener("item:update", updateItem);
        api.notifier.addListener("item:toggle", toggleItem);
        api.notifier.addListener("item:remove", removeItem);
    });

    onDestroy(() => {
        api.notifier.removeListener("item:add", addItem);
        api.notifier.removeListener("item:update", updateItem);
        api.notifier.removeListener("item:toggle", toggleItem);
        api.notifier.removeListener("item:remove", removeItem);
    });

    

    async function onItemAddClicked(){
        if(list === null){
            console.error("selected list is null while add item clicked!");
            return;
        }
        await api.post("lists/items/create", {
            body: {
                listId: list.id,
                content: itemName
            }
        });
        itemName = "";
    }

    function removeItemFromList(list: ItemData[], id: number){
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if(item.id === id){
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    function updateItemFromList(list: ItemData[], newItem: ItemData){
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if(item.id === newItem.id){
                list[i] = newItem;
                return true;
            }
        }
        return false;
    }

    function addItem(data: {item: ItemData}){
            items.push(data.item);
            items = items;
    }

    let removeItemDialog: RemoveItemDialog;

    function onTryRemoveItem(event: CustomEvent<{item: ItemData}>){
        const item = event.detail.item;
        removeItemDialog.open(item);
    }

    function onRemoveItem(event: CustomEvent<{item: ItemData}>){
        api.del("lists/items/remove", {
            body: {
                itemId: event.detail.item.id
            }
        });
    }

    function removeItem(data: {item: ItemData}){
        if(removeItemFromList(items, data.item.id)){
            items = items;
            return;
        }

        if(removeItemFromList(checkedItems, data.item.id)){
            checkedItems = checkedItems;
            return;
        }
    }

    function updateItem(data: {item: ItemData}){
        if(updateItemFromList(items, data.item)){
            items = items;
            return;
        }

        if(updateItemFromList(checkedItems, data.item)){
            checkedItems = checkedItems;
            return;
        }
    }

    let checkedItemsPanelOpen = true;

    function toggleItem(data: {item: ItemData}){
        if(data.item.checked){
            removeItemFromList(items, data.item.id);
            checkedItems.push(data.item);
        }
        else{
            removeItemFromList(checkedItems, data.item.id);
            items.push(data.item);
        }
        checkedItems = checkedItems;
        items = items;
    }
</script>

<RemoveItemDialog bind:this={removeItemDialog} on:remove={onRemoveItem} />
<div class="h-full flex flex-col">
    <div class="flex items-center gap-4 p-3">
        <Textfield variant="filled" class="w-full" type="text" bind:value={itemName} label="Item name" />
        <Button variant="raised" on:click={onItemAddClicked}>
            <Label>Add</Label>
        </Button>
    </div>
    <div class="h-auto grow overflow-auto">
        <List nonInteractive>
            {#each items as item}
                <ListItem item={item} on:remove={onTryRemoveItem}/>
            {/each}
        </List>

        {#if checkedItems.length > 0}
            <Accordion>
                <Panel open={checkedItemsPanelOpen}>
                    <Header>
                        Checked items
                        <IconButton slot="icon" toggle pressed={checkedItemsPanelOpen}>
                            <Icon class="material-icons" on>expand_less</Icon>
                            <Icon class="material-icons">expand_more</Icon>
                        </IconButton>
                    </Header>
                    <AccordionContent>
                        <List nonInteractive>
                            {#each checkedItems as item}
                                <ListItem item={item} on:remove={onTryRemoveItem}/>
                            {/each}
                        </List>
                    </AccordionContent>
                </Panel>
            </Accordion>
        {/if}
    </div>
</div>
