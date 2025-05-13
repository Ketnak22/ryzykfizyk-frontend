<script lang="ts">
    import { socket } from "../socketStore";
    import { users, gameState } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question, User } from "../interfaces";
    
    function findUser(id: string | undefined)  {
        for (const user of $users) {
            if (user.id == id) return user;
        }
        return null
    }

    // Update user list when new user joins
    $socket.on("update-players-list", (usersList: User[]) => {
        $users = usersList
    })

    // Remove user from list when they disconnect
    $socket.on("user-disconnected", (userId: string) => {
        $users = $users.filter(v => v.id !== userId)
    })

    // Update user readyness in local list to 
    $socket.on("user-ready-update", (userId: string) => {
        findUser(userId)!.ready = true
        $users = [...$users] // Force Svelte to rerender
        console.log(`User ${userId} set to Ready`)
    })

    // Set local user to ready
    function setReady() {
        $socket.emit("user-ready")
        // findUser($socket.id)!.ready = true
        findUser($socket.id)!.ready = true;
        $users = [...$users] // Force Svelte to rerender
    }
    // When all users are ready
    $socket.on("all-users-ready", () => {
        $gameState = "answering";
    })

</script>

<div class="waiting-room">
    <div class="room-info">
        <h1>{$currentRoom}</h1>
    </div>

    <div class="users-list">
        {#if $users.length == 0}
            <p>No users in the room</p>
        {:else}
            <ol>
                {#each $users as user}
                    <li class={user.ready ? "ready" : "not-ready"}>
                        <span>{user.username}</span>
                    </li>
                {/each}
            </ol>
        {/if}
    </div>
    {#each [findUser($socket.id)?.ready] as isReady}  
        <button onclick={setReady} disabled={isReady} class={isReady ? "disabled" : ""}>Ready</button>
    {/each}
</div>

<style>
    .waiting-room {
        position: relative;

        width: 50vw;

        background-color: #9c99e8;
        border: none;
        color: white;
        display: inline-block;
        width: 75vw;
        height: 75vh;
        padding: 20px 40px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        border-radius: 0.5em;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }

    .room-info {
        background-color: #74807b;
        border: none;
        color: white;
        display: inline-block;
        width: max-content;
        padding: 20px 40px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        margin: 10px 2px;
        border-radius: 0.5em;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }

    .users-list {
        margin-top: 50px;
    }
    ol {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        padding: 0 5px;
        border-radius: 0.5em;
        color: white;
        font-weight: bold;
        font-size: 1rem;
        transition: transform 0.2s;
        overflow: hidden; /* Ensure overflow is hidden */
    }
    li:hover {
        transform: scale(1.1);
    }

    li span {
        display: inline-block;
        max-width: 15ch; /* Limit the width to 15 characters */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .not-ready {
        background-color: #e57373 !important;
    }

    .ready {
        background-color: #81c784 !important;
    }
    /* 
    li:nth-child(1n)  { background-color: #e57373; }
    li:nth-child(2n)  { background-color: #64b5f6; }
    li:nth-child(3n)  { background-color: #81c784; }
    li:nth-child(4n)  { background-color: #ffd54f; }
    li:nth-child(5n)  { background-color: #ba68c8; }
    li:nth-child(6n)  { background-color: #4db6ac; } */

    button {
        background-color: #04AA6D;
        border: none;
        color: white;
        display: inline-block;
        padding: 20px 40px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        margin: 10px 2px;
        cursor: pointer;
        border-radius: 0.5em;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;

        position: absolute;
        bottom: 3vh;
        left: 50%;
        transform: translateX(-50%);
    }

    button:hover {
        background-color: #038E5B;
    }

    .disabled {
        background-color: gray;
        pointer-events: none;
    }
</style>