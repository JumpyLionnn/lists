<script lang="ts">
    import Textfield from "@smui/textfield";
    import Drawer, { AppContent, Content } from '@smui/drawer';
    import List from "@smui/list";
    import * as api from "$lib/api";
	import Button, { Label } from "@smui/button";
	import type { ListData, ItemData } from "$lib/models";
    import ListSelection from "$lib/components/ListsSelection.svelte";
    import MembersList from "$lib/components/MembersList.svelte";
	import { onDestroy, onMount } from "svelte";
	import ListItem from "$lib/components/ListItem.svelte";
	import RemoveItemDialog from "$lib/components/dialogs/RemoveItemDialog.svelte";

    let selectedList: ListData | null = null;

    onMount(() => {
        api.notifier.addListener("item:add", addItem);
        api.notifier.addListener("item:remove", removeItem);
    });

    onDestroy(() => {
        api.notifier.removeListener("item:add", addItem);
        api.notifier.removeListener("item:remove", removeItem);
    });

    async function onListSelected(list: ListData){
        selectedList = list
        const res = await api.get("lists/items", {
            query: {
                listId: selectedList.id
            }
        });
        
        if(res.ok){
            const data = await res.json();
            items = data.items;
        }
    }

    let itemName = "";
    let items: ItemData[] = [];

    async function onItemAddClicked(){
        if(selectedList === null){
            console.error("selected list is null while add item clicked!");
            return;
        }
        const res = await api.post("lists/items/create", {
            body: {
                listId: selectedList.id,
                content: itemName
            }
        });
        itemName = "";
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
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.id === data.item.id){
                items.splice(i, 1);
                items = items;
                break;
            }
        }
    }
</script>

<style lang="postcss">
    .drawer-container {
        border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    }
</style>
<RemoveItemDialog bind:this={removeItemDialog} on:remove={onRemoveItem} />
<div class="h-full">
    <div class="drawer-container h-full overflow-hidden flex relative">
        <Drawer class="overflow-hidden">
            <Content>
                <ListSelection on:change={(e) => {onListSelected(e.detail)}}></ListSelection>
            </Content>
        </Drawer>
    
        <AppContent class="flex-auto">
            {#if selectedList !== null}
                <div class="h-full overflow-hidden flex relative">
                    <AppContent class="flex-auto h-full">
                        <div class="p-4 h-full flex flex-col">
                            <h2 class="text-3xl">{selectedList.name}</h2>
                            <div class="flex items-center gap-4">
                                <Textfield variant="filled" type="text" bind:value={itemName} label="Item name" />
                                <Button variant="raised" on:click={onItemAddClicked}>
                                    <Label>Add</Label>
                                </Button>
                            </div>
                            <div class="grow overflow-auto">
                                <List nonInteractive>
                                    {#each items as item}
                                        <ListItem item={item} on:remove={onTryRemoveItem}/>
                                    {/each}
                                </List>
                            </div>
                        </div>
                    </AppContent>
                    <Drawer class="overflow-hidden">
                        <Content>
                            <MembersList listId={selectedList.id}/>
                        </Content>
                    </Drawer>
                </div>
            {/if}
        </AppContent>
    </div>
</div>