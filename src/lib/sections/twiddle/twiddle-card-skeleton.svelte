<script lang="ts">
	import { Button } from '&/ui/button';
	import * as Card from '&/ui/card';
	import { Skeleton } from '&/ui/skeleton';
	import { ProfileAvatarSkeleton } from '#/profile';
	import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-svelte';
</script>

<Card.Root class="mx-auto transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<div class="flex items-center space-x-4">
			<ProfileAvatarSkeleton />
			<div class="flex flex-col gap-1">
				<Skeleton class="h-5 w-32" />
				<Skeleton class="h-4 w-28" />
			</div>
		</div>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<Skeleton class="h-5 w-52 text-gray-700" />
		<Skeleton class="h-4 w-24 text-gray-500" />
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
			disabled
		>
			<MessageCircle class="h-4 w-4" />
			<Skeleton class="h-5 w-5" />
		</Button>
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center space-x-2 transition-colors duration-200 hover:text-green-500"
			disabled
		>
			<Repeat2 class="h-4 w-4" />
			<Skeleton class="h-5 w-5" />
		</Button>
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center space-x-2 transition-colors duration-200 hover:text-red-500"
			disabled
		>
			<Heart class="h-4 w-4" />
			<Skeleton class="h-5 w-5" />
		</Button>
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
			disabled
		>
			<Share2 class="h-4 w-4" />
		</Button>
	</Card.Footer>
</Card.Root>
