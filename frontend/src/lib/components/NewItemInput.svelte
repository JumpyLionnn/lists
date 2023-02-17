<script lang="ts">
	import type { ListData } from "$lib/models";
    import * as api from "$lib/api";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    export let list: ListData;

    let itemName: string = "";
    let invalid: boolean = false;
    let errorTimeout: ReturnType<typeof setTimeout>;
    let errorMessage: string = "";

    function setErrorMessage(message: string){
        if(invalid){
            clearTimeout(errorTimeout);
        }
        errorMessage = message;
        invalid = true;
        errorTimeout = setTimeout(() => {
            errorMessage = "";
            invalid = false;
        }, 120 * 1000);
    }
    function clearErrorMessage(){
        if(invalid){
            errorMessage = "";
            invalid = false;
            clearInterval(errorTimeout);
        }
    }

    async function onItemAddClicked(){
        const name = itemName.trim();
        if(name.length === 0){
            setErrorMessage("The item name can't be empty.");
            itemName = "";
            return;
        }
        clearErrorMessage();

        const res = await api.post("lists/items/create", {
            body: {
                listId: list.id,
                content: name
            }
        });
        itemName = "";
        if(!res.ok){
            const data = await res.json();
            if(typeof data.error === "string"){
                setErrorMessage(data.error);
            }
        }
    }

    function onItemInputKeyDown(e: any){
        if(e.code === "Enter"){
            onItemAddClicked();
        }
    }
</script>
<div class="flex items-center gap-4 p-3">
    <div class="w-full">
        <Textfield variant="filled" class="w-full" type="text" label="Item name" bind:value={itemName} bind:invalid={invalid} on:input={clearErrorMessage} on:keydown={(e) => onItemInputKeyDown(e)}>
            <HelperText validationMsg slot="helper">
                {errorMessage}
            </HelperText>
        </Textfield>
    </div>
    <Button variant="raised" on:click={onItemAddClicked}>
        <Label>Add</Label>
    </Button>
</div>