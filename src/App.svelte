<script lang="ts">
  import { socket } from './socketStore';
  import JoinRoom from './lib/JoinRoom.svelte';
  import CreateRoom from './lib/CreateRoom.svelte';
  import { currentRoom } from './roomStore';
  import WaitingRoom from './lib/WaitingRoom.svelte';

  $socket.on("connect", () => {
    console.log(`Connected with id: ${$socket.id}`);
  })

  $socket.on("connect_error", () => {
    throw new Error("Error connecting to server!");
  })
  
</script>

<main>
  {#if $currentRoom === ""}
    <CreateRoom />

    <JoinRoom />

  {:else}
    <WaitingRoom />
  {/if}
</main>

<style>
</style>
