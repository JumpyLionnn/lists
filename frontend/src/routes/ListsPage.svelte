<script lang="ts">
    import Textfield from "@smui/textfield";
    import Drawer, { AppContent, Content } from '@smui/drawer';
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";
	import Button, { Label } from "@smui/button";
	import type { ListData, ItemData } from "$lib/models";
    import ListSelection from "$lib/components/ListsSelection.svelte";

    let selectedList: ListData | null = null;

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
        if(res.ok){
            const data = await res.json();
            items.push(data.item);
            items = items;
        }
    }
</script>

<style lang="postcss">
    .drawer-container {
        border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    }
</style>

<div class="h-full">
    <div class="drawer-container h-full overflow-hidden flex relative">
        <Drawer class="overflow-hidden">
            <Content>
                <ListSelection on:change={(e) => {onListSelected(e.detail)}}></ListSelection>
            </Content>
        </Drawer>
    
        <AppContent class="flex-auto">
            {#if selectedList !== null}
                <div class="p-4">
                    <h2 class="text-3xl">{selectedList.name}</h2>
                    <div class="flex items-center gap-4">
                        <Textfield variant="filled" type="text" bind:value={itemName} label="Item name" />
                        <Button variant="raised" on:click={onItemAddClicked}>
                            <Label>Add</Label>
                        </Button>
                    </div>
                    <List class="demo-list" nonInteractive>
                        {#each items as item}
                            <Item>
                                <Text>{item.content}</Text>
                            </Item>
                        {/each}
                    </List>
                </div>
            {/if}
        </AppContent>
    </div>
</div>