<script lang="ts">
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";
	import type { MemberData } from "$lib/models";
	import { onDestroy, onMount } from 'svelte';

    export let listId: number;

    onMount(() => {
        api.notifier.on("list:join", addMember);
    });

    onDestroy(() => {
        api.notifier.removeListener("list:join", addMember);
    });

    async function getMembers(){
        return (await api.get("lists/members", {
            query: {
                listId: listId
            }
        })).json();
    }

    const membersPromise = getMembers();

    let members: MemberData[] = [];
    membersPromise
        .then((data) => {
            members = data.members;
        });
    
    function addMember(data: {member: MemberData}){
        members.push(data.member);
        members = members;
    }
</script>

<div class="inline-flex flex-col h-full w-full">
    <TopAppBar variant="static" color="secondary">
        <Row>
            <Section>
                <Title>Members</Title>
            </Section>
        </Row>
    </TopAppBar>
    <div class="grow">
        <List>
            {#each members as member, i}
                <Item>
                    <Text>{member.username}</Text>
                </Item>
            {/each}
        </List>
    </div>
</div>