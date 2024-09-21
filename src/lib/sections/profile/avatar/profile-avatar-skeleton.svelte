<script lang="ts">
	import { cn } from '$lib/shadcn/utils';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { size, class: className }: Pick<Props, 'size' | 'class'> = $props();
</script>

<div class={avatarVariants({ size, className: cn(className, 'placeholder rounded-full') })}></div>
