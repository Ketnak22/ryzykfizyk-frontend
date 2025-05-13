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

<div>
    {#if anwsers.length === 0}
        <p>No answers received yet.</p>
    {:else}
        <h2>User answers</h2>
        <ul>
            {#each anwsers as userAnswer}
                <li>
                    {userAnswer.id}: {userAnswer.answer}
                </li>
            {/each}
        </ul>
    {/if}
    
</div>