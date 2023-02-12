<script lang="ts">
    import { isMobile } from "$lib/platform";
    import AuthPageWrapper from "$lib/components/mobile/AuthPageWrapper.svelte";
	import { authForbidden } from "$lib/guard";
	import SignupForm from "$lib/components/auth/SignupForm.svelte";
    authForbidden();
</script>

{#if isMobile()}
    <AuthPageWrapper>
        <SignupForm/>
    </AuthPageWrapper>
{:else}
    <div class="flex h-full justify-center items-center">
        <SignupForm />
    </div>
{/if}