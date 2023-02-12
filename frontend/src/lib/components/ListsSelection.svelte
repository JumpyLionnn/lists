<script lang="ts">
    import Button, { Label } from "@smui/button";
    import CreateListDialog from "$lib/components/dialogs/CreateListDialog.svelte";
    import JoinListDialog from "$lib/components/dialogs/JoinListDialog.svelte";
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";
	import { createEventDispatcher } from "svelte";
	import type { ListData } from "$lib/models";

    const dispacher = createEventDispatcher();

    async function getLists(){
        return (await api.get("lists")).json();
    }

    const listsPromise = getLists();

    let createListDialog: CreateListDialog;
    let joinListDialog: JoinListDialog;

    let lists: ListData[] = [];
    let selectedListIndex = -1;
    listsPromise
        .then((data) => {
            lists = data.lists;
        });
    
    function openCreateListDialog(){
        createListDialog.open();
    }
    
    function onCreateList(event: CustomEvent<{name: string}>){
        add(event.detail.name);
    }

    async function onListSelected(index: number){
        dispacher("change", lists[index]);
    }

    async function add(name: string){
        const res = await api.post("lists/create", {
            body: {
                name: name
            }
        });
        if(res.ok){
            const data = await res.json();
            lists.push(data.list);
            lists = lists;
        }
    }

    function openJoinListDialog(){
        joinListDialog.open();
    }
    
    function onJoinList(event: CustomEvent<{list: ListData}>): void {
        const list = event.detail.list;
        lists.push(list);
        lists = lists;
    }
</script>

<CreateListDialog bind:this={createListDialog} on:create={onCreateList}/>
<JoinListDialog bind:this={joinListDialog} on:join={onJoinList}/>

<div class="overflow-auto pb-4 h-full">
    <List bind:selectedIndex={selectedListIndex} >
        {#each lists as list, i}
            <Item on:SMUI:action={() => onListSelected(i)}>
                <Text>{list.name}</Text>
            </Item>
        {/each}
    </List>
    <div class="flex flex-col items-center gap-4">
        <Button variant="raised" class="w-5/6" on:click={openCreateListDialog}>
            <Label>Create a List</Label>
        </Button>
        <Button variant="raised" class="w-5/6" on:click={openJoinListDialog}>
            <Label>Join a List</Label>
        </Button>
    </div>
</div>
