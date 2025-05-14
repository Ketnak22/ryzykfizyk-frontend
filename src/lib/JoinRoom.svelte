<script lang="ts">
  import { currentRoom } from "../roomStore";
  import { socket } from "../socketStore";
  import { gameState } from "../usersStore";

  function joinRoom(roomId: string, username: string) {
    $socket.emit("join-room", roomId, username, (room: string, joined: boolean) => {
      if (!joined) {
        alert(`Failed to join room ${room}`);
      } else {
        console.log(`Joined room ${room}`);
        $currentRoom = room;
        $gameState = "waiting";
      }
    })
  }
</script>

<div>
    <button onclick={() => {
      const roomId = prompt("Enter room id: ");
      const username = prompt("Enter username: ")
      if (roomId !== null && username !== null) {
        joinRoom(roomId, username);
      }
    }} class="btn green-btn">Join room</button>
</div>