<script lang="ts">
    import Drawer, { AppContent, Content } from '@smui/drawer';
	import type { ListData } from "$lib/models";
    import ListSelection from "$lib/components/ListsSelection.svelte";
    import MembersList from "$lib/components/MembersList.svelte";
	import ItemsList from "$lib/components/ItemsList.svelte";
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';

    let selectedList: ListData | null = null;

    async function onListSelected(list: ListData){
        selectedList = list;
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
                <div class="inline-flex flex-col h-full w-full">
                    <TopAppBar variant="static" color="primary">
                        <Row>
                            <Section>
                                <Title>Your lists</Title>
                            </Section>
                        </Row>
                    </TopAppBar>
                    <div class="grow overflow-auto pb-4">
                        <ListSelection on:change={(e) => {onListSelected(e.detail)}}></ListSelection>
                    </div>
                </div>
            </Content>
        </Drawer>
    
        <AppContent class="flex-auto">
            {#if selectedList !== null}
                <div class="h-full overflow-hidden flex relative">
                    <AppContent class="flex-auto h-full flex flex-col">
                        <TopAppBar variant="static" color="primary">
                            <Row>
                                <Section>
                                    <Title>{selectedList.name}</Title>
                                </Section>
                            </Row>
                        </TopAppBar>
                        <div class="p-4 grow overflow-auto">
                            <ItemsList list={selectedList}/>
                        </div>
                    </AppContent>
                    <Drawer class="overflow-hidden border-l border-gray-200 border-solid">
                        <Content>
                            <MembersList list={selectedList}/>
                        </Content>
                    </Drawer>
                </div>
            {/if}
        </AppContent>
    </div>
</div>