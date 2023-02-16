<script lang="ts">
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";
	import type { ListData, MemberData } from "$lib/models";
	import { onDestroy, onMount } from 'svelte';

    export let list: ListData;

    onMount(() => {
        api.notifier.on("list:join", addMember);
        api.notifier.addListener("reconnected", loadMembersData);
    });

    onDestroy(() => {
        api.notifier.removeListener("list:join", addMember);
        api.notifier.removeListener("reconnected", loadMembersData);
    });

    let members: MemberData[] = [];
    async function loadMembersData(){
        const res = await api.get("lists/members", {
            query: {
                listId: list.id
            }
        });
        if(res.ok){
            const data = await res.json();
            members = data.members;
        }
    }

    $: if (list) {
        loadMembersData();
    }

    
    function addMember(data: {member: MemberData}){
        members.push(data.member);
        members = members;
    }
</script>

<div class="inline-flex flex-col h-full w-full">
    <TopAppBar variant="static" color="primary">
        <Row>
            <Section>
                <Title>Members</Title>
            </Section>
        </Row>
    </TopAppBar>
    <div class="grow">
        <h2 class="text-center text-xl">Join code: {list.joinCode}</h2>
        <List>
            {#each members as member}
                <Item>
                    <Text>{member.username}</Text>
                </Item>
            {/each}
        </List>
    </div>
</div>