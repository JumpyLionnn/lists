<script lang="ts">
    import IconButton from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import Dialog, { Header, Actions, Title, Content } from '@smui/dialog';
    import Button, { Label } from "@smui/button";
    import { createEventDispatcher } from "svelte";

    let dialogOpened = false;
    let id: number | null = null;

    const dispacher = createEventDispatcher();

    export function open(){
        dialogOpened = true;
    }

    function closeHandler(event: CustomEvent<{action: string}>){
        switch (event.detail.action) {
            case "close":
                dispacher("closed");
                break;
            case "join":
                dispacher("join", {
                    id: id
                });
                break;
        }
    }
</script>

<Dialog bind:open={dialogOpened} aria-labelledby="join-list-title" aria-describedby="join-list-content" on:SMUIDialog:closed={closeHandler}>
  <Header class="flex items-center justify-between">
    <Title id="fullscreen-title">Join list</Title>
    <IconButton action="close" class="material-icons mr-2">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <Textfield variant="filled" type="number" bind:value={id} label="List id" />
  </Content>
  <Actions>
    <Button action="join">
      <Label>Join</Label>
    </Button>
  </Actions>
</Dialog>