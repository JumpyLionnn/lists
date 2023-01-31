<script lang="ts">
    import IconButton from "@smui/icon-button";
    import Dialog, { Header, Actions, Title, Content } from '@smui/dialog';
    import Button, { Label } from "@smui/button";
    import { createEventDispatcher } from "svelte";
	import type { ItemData } from "$lib/models";

    let dialogOpened = false;
    let item: ItemData;

    const dispacher = createEventDispatcher();

    export function open(itemData: ItemData){
        item = itemData;
        dialogOpened = true;
    }

    function closeHandler(event: CustomEvent<{action: string}>){
        switch (event.detail.action) {
            case "close":
                dispacher("closed");
                break;
            case "remove":
                dispacher("remove", {
                    item: item
                });
                break;
        }
    }
</script>

<Dialog bind:open={dialogOpened} aria-labelledby="join-list-title" aria-describedby="join-list-content" on:SMUIDialog:closed={closeHandler}>
  <Header class="flex items-center justify-between">
    <Title id="fullscreen-title">Remove item</Title>
    <IconButton action="close" class="material-icons mr-2">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    Are you sure you want to remove '{item?.content}' forever?
  </Content>
  <Actions>
    <Button action="close">
      <Label>No</Label>
    </Button>
    <Button action="remove">
        <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>