<script lang="ts">
  import { socket } from './socketStore';
  import JoinRoom from './lib/JoinRoom.svelte';
  import CreateRoom from './lib/CreateRoom.svelte';
  import { currentRoom } from './roomStore';
  import WaitingRoom from './lib/WaitingRoom.svelte';
  import { users, gameState } from './usersStore';
  import Question from './lib/Question.svelte';
  import Voting from './lib/Voting.svelte';

  $socket.on("connect", () => {
    console.log(`Connected with id: ${$socket.id}`);
  })

  $socket.on("connect_error", () => {
    throw new Error("Error connecting to server!");
  })
  
</script>

<main>
  {#if $gameState === "joining"}
    <CreateRoom />
    <JoinRoom />
  {:else if $gameState === "waiting"}
    <WaitingRoom />
  {:else if $gameState === "answering"}
    <Question />
  {:else if $gameState === "voting"}
    <Voting />
  {/if}
</main>

<style>
</style>
