<script lang="ts">
    import IconButton from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import Dialog, { Header, Actions, Title, Content } from '@smui/dialog';
	import Button, { Label } from "@smui/button";
	import { createEventDispatcher } from "svelte";

    let dialogOpened = false;
    let name = "";

    const dispacher = createEventDispatcher();

    export function open(){
        dialogOpened = true;
    }

    function closeHandler(event: CustomEvent<{action: string}>){
        switch (event.detail.action) {
            case "close":
                dispacher("closed");
                break;
            case "create":
                dispacher("create", {
                    name: name
                });
                break;
        }
    }
</script>

<Dialog bind:open={dialogOpened} aria-labelledby="create-list-title" aria-describedby="create-list-content" on:SMUIDialog:closed={closeHandler}>
  <Header class="flex items-center justify-between">
    <Title id="fullscreen-title">Create list</Title>
    <IconButton action="close" class="material-icons mr-2">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <Textfield variant="filled" type="text" bind:value={name} label="List name" />
  </Content>
  <Actions>
    <Button action="create">
      <Label>Create</Label>
    </Button>
  </Actions>
</Dialog>