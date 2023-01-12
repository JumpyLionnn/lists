<script lang="ts">
    import IconButton from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";

    async function getLists(){
        return (await api.get("lists")).json();
    }

    const listsPromise = getLists();

    let clicked = "";
    let name = "";

    let lists: {name: string}[] = [];
    listsPromise
        .then((data) => {
            lists = data.lists;
        });


    async function add(){
        const res = await api.post("lists/create", {
            body: {
                name: name
            }
        });
        name = "";
        if(res.ok){
            const data = await res.json();
            lists.push(data.list);
            lists = lists;
        }
    }
</script>


<div>
    {#await listsPromise}
        <span>loading...</span>
    {:then data} 
        <div>
            <Textfield variant="filled" type="text" bind:value={name} label="New list name" />
            <IconButton class="material-icons" on:click={add}>add</IconButton>
        </div>
        <List class="demo-list">
            {#each lists as list}
                <Item on:action={() => (clicked = list.name)}>
                    <Text>{list.name}</Text>
                </Item>
            {/each}
        </List>
       
    {/await}
</div>