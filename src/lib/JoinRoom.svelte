<script lang="ts">
  import { currentRoom } from "../roomStore";
  import { socket } from "../socketStore";

  function joinRoom(roomId: string, username: string) {
    $socket.emit("join-room", roomId, username, (room: string, joined: boolean) => {
      if (!joined) {
        alert(`Failed to join room ${room}`);
      } else {
        $currentRoom = room;
      }
    })
  }
</script>

<div class="room-button">
    <button on:click={() => {
      const roomId = prompt("Enter room id: ");
      const username = prompt("Enter username: ")
      if (roomId !== null && username !== null) {
        joinRoom(roomId, username);
      }
    }}>Join room</button>
</div>