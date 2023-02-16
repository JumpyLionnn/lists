<script lang="ts">
    import IconButton from "@smui/icon-button";
    import Textfield from "@smui/textfield";
    import Dialog, { Header, Title, Content } from '@smui/dialog';
    import Button, { Label } from "@smui/button";
    import { createEventDispatcher } from "svelte";
    import * as api from "$lib/api";

    let dialogOpened = false;
    let joinCode: string = "";
    let message: string = "";

    const dispacher = createEventDispatcher();

    export function open(){
        dialogOpened = true;
    }

    async function join(){
        joinCode = joinCode.trim();
        if(joinCode.length === 6){
            message = "";
            const res = await api.post("lists/join", {
                body: {
                    joinCode: joinCode
                }
            });
            const data = await res.json();
            if(res.ok){
                dialogOpened = false;
                dispacher("join", {
                    list: data.list
                });
            }
            else{
                if(data.error){
                    message = data.error;
                }
                else{
                    message = "An error has occurred while trying to join."
                }
            }
        }
        else{
            message = "The code must be 6 characters long.";
        }
    }

    function closeHandler(event: CustomEvent<{action: string}>){
        switch (event.detail.action) {
            case "close":
                dispacher("closed");
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
    <Textfield variant="filled" type="text" bind:value={joinCode} label="List join code" maxlength={6} minlength={6} />
    <div class="text-red-500">
        {message}
    </div>
    <div class="mt-3 flex w-full flex-row-reverse">
        <Button on:click={join}>
            <Label>Join</Label>
        </Button>
    </div>
  </Content>
</Dialog>