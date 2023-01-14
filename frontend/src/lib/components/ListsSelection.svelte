<script lang="ts">
    import IconButton from "@smui/icon-button";
    import CreateListDialog from "$lib/components/dialogs/CreateListDialog.svelte";
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
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
</script>

<CreateListDialog bind:this={createListDialog} on:create={onCreateList}/>

<div class="inline-flex flex-col h-full w-full">
    <TopAppBar variant="static" color="primary">
        <Row>
            <Section>
                <Title>Your lists</Title>
                <IconButton class="material-icons" on:click={openCreateListDialog}>add</IconButton>
            </Section>
        </Row>
    </TopAppBar>
    <div class="grow">
        <List bind:selectedIndex={selectedListIndex} >
            {#each lists as list, i}
                <Item on:SMUI:action={() => onListSelected(i)}>
                    <Text>{list.name}</Text>
                </Item>
            {/each}
        </List>
    </div>
</div>