<script lang="ts">
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import List, {Item, Text} from "@smui/list";
    import * as api from "$lib/api";
	import { Status, type ListData, type MemberData } from "$lib/models";
	import { onDestroy, onMount } from 'svelte';

    export let list: ListData;

    onMount(() => {
        api.notifier.addListener("list:join", addMember);
        api.notifier.addListener("status", statusUpdate);
        api.notifier.addListener("reconnected", loadMembersData);
    });

    onDestroy(() => {
        api.notifier.removeListener("list:join", addMember);
        api.notifier.removeListener("reconnected", loadMembersData);
        api.notifier.removeListener("status", statusUpdate);

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

    function statusUpdate(data: {userId: number, status: Status}) {
        for (let i = 0; i < members.length; i++) {
            if(members[i].userId === data.userId){
                members[i].status = data.status;
                return;
            }            
        }
    }

    function getStatusColor(status: Status): "bg-green-400" | "bg-amber-400" | "bg-gray-400" {
        switch (status) {
            case Status.Online:
                return "bg-green-400";
            case Status.Idle:
                return "bg-amber-400";
            case Status.Offline:
                return "bg-gray-400";
        }
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
                    <div class="rounded-full transition-colors motion-reduce:transition-none duration-500 {getStatusColor(member.status)} w-2 h-2"></div>
                    <Text class="ml-2">{member.username}</Text>
                </Item>
            {/each}
        </List>
    </div>
</div>