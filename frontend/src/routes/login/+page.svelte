<script lang="ts">
    import { isMobile } from "$lib/platform";
    import AuthPageWrapper from "$lib/components/mobile/AuthPageWrapper.svelte";
    import LoginForm from "$lib/components/auth/LoginForm.svelte";
	import { authForbidden } from "$lib/guard";
    authForbidden();
</script>

{#if isMobile()}
    <AuthPageWrapper>
        <LoginForm/>
    </AuthPageWrapper>
{:else}
    <div class="flex h-full justify-center items-center">
        <LoginForm />
    </div>
{/if}