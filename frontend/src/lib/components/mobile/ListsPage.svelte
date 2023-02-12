<script lang="ts">
    import Drawer, { AppContent, Content, Scrim } from '@smui/drawer';
	import type { ListData } from "$lib/models";
    import ListSelection from "$lib/components/ListsSelection.svelte";
    import MembersList from "$lib/components/MembersList.svelte";
	import ItemsList from "$lib/components/ItemsList.svelte";
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import Button, { Label } from '@smui/button';
	import IconButton from '@smui/icon-button';
    import * as api from "$lib/api";

    let selectedList: ListData | null = null;
    let showListSelection: boolean = true;

    async function onListSelected(list: ListData){
        selectedList = list;
        showListSelection = false;
    }

    let open = false;
</script>

<div class="h-full">
    <div class="drawer-container h-full overflow-hidden flex relative">
            {#if showListSelection}
                <div class="inline-flex flex-col h-full w-full">
                    <TopAppBar variant="static" color="primary">
                        <Row>
                            <Section class="flex items-center justify-between">
                                <Title>Your lists</Title>
                                <Button variant="outlined" color="primary" on:click={api.logout}>
                                    <Label>Logout</Label>
                                </Button>
                            </Section>
                        </Row>
                    </TopAppBar>
                    <div class="grow overflow-auto pb-4">
                        <ListSelection on:change={(e) => {onListSelected(e.detail)}}></ListSelection>
                    </div>
                </div>
            {:else}
                {#if selectedList !== null}
                    <div class="h-full w-full overflow-hidden flex relative">
                        <Drawer variant="modal" class="overflow-hidden" bind:open>
                            <Content>
                                <MembersList list={selectedList}/>
                            </Content>
                        </Drawer>
                        <Scrim/>
                        <AppContent class="flex-auto h-full app-content">
                            <div class="h-full flex flex-col">
                                <TopAppBar variant="static">
                                    <Row>
                                        <Section>
                                            <div class="w-full flex justify-between items-center">
                                                <IconButton class="material-icons" on:click={() => {showListSelection = true}} ripple={false}>arrow_back</IconButton>
                                                <span class="font-medium text-xl">{selectedList.name}</span>
                                                <IconButton class="material-icons" on:click={() => (open = !open)}>people</IconButton>
                                            </div>
                                        </Section>
                                    </Row>
                                </TopAppBar>
                                <div class="overflow-auto">
                                    <ItemsList list={selectedList}/>
                                </div>
                            </div>
                            
                        </AppContent>
                        
                        
                    </div>
                {/if}
            {/if}
    </div>
</div>