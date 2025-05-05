<script lang="ts">
    import { currentRoom } from "../roomStore";
    import { socket } from "../socketStore";

    function createRoom(username: string) {
        $socket.emit("create-room", username, (room: string) => {
            // alert(`Created and joined room ${room}`);
            $currentRoom = room;
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