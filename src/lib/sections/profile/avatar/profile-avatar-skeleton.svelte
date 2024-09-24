<script lang="ts">
	import { cn } from '$lib/shadcn/utils';
	import { Skeleton } from '&/skeleton';
	import type { Props } from '.';
	import { avatarVariants } from './index';

	const { size, class: className }: Pick<Props, 'size' | 'class'> = $props();
</script>

<Skeleton class={avatarVariants({ size, className: cn(className) })} />
