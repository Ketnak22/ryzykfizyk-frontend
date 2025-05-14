<script lang="ts">
    import { socket } from "../socketStore";
    import { gameState, users } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question, UserAnswer } from "../interfaces";
    
    let anwsers: UserAnswer[] = [];
    $socket.emit("get-user-answers", (r_anwsers: UserAnswer[]) => {
        anwsers = r_anwsers.sort((a, b) => a.answer - b.answer); // Sort answers by value 
    });
</script>

<div class="voting-div">
    {#if anwsers.length === 0}
        <p>No answers received yet.</p>
    {:else}
        <h2>Voting time!</h2>
        <ul>
            {#each anwsers as userAnswer}
                <li>
                    {userAnswer.answer} {userAnswer?.unit ?? ""}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .voting-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background-color: #9c99e8;
        border: none;
        color: white;
        padding: 20px 40px;
        text-align: center;
        text-decoration: none;
        font-size: 16px;
        border-radius: 0.5em;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    li {
        color: black;
        margin: 10px 0;
        padding: 15px 20px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        text-align: center;

    }
</style>