<script lang="ts">
    import { currentRoom } from "../roomStore";
    import { socket } from "../socketStore";
  import { gameState } from "../usersStore";

    function createRoom(username: string) {
        $socket.emit("create-room", username, (room: string) => {
            console.log(`Created and joined room ${room}`);
            $currentRoom = room;
            $gameState = "waiting";
        })
    }
</script>

<div class="room-button">
    <button on:click={() => {
        const username = prompt("Enter username: ");
        if (username !== null) {
            createRoom(username);
        }
    }}>Create room</button>
</div>