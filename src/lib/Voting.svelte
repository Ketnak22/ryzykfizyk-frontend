<script lang="ts">
    import { socket } from "../socketStore";
    import { gameState, users } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question, UserAnswer } from "../interfaces";
    
    let tokens: number;
    let anwsers = $state<UserAnswer[]>([]);
    let votedAnswersIds = $state<string[]>([]);
    $socket.emit("start-voting", (r_anwsers: UserAnswer[], r_tokens: number) => {
        if (r_tokens === -1) {
            alert("Something went wrong, please try again");
            return;
        }
        tokens = r_tokens;
        anwsers = r_anwsers.sort((a, b) => a.answer - b.answer); // Sort answers by value 
    });

    function selectVote(answer: UserAnswer) {
        console.log("Tokens left: ", tokens);

        if (tokens <= 0) {
            alert("You have no tokens left");
            return;
        }

        if (votedAnswersIds.includes(answer.id)) {
            alert("You have already voted for this answer");
            return;
        }

        votedAnswersIds.push(answer.id);
       
        $socket.emit("vote", answer.id, (successfull: boolean) => {
            if (successfull) {
                tokens--;
            } else {
                alert("Error sending vote");
            }
        });
    }

    function clearVotes() {
        votedAnswersIds = [];
        $socket.emit("clear-votes", (successfull: boolean, defaultUserTokens: number) => {
            if (successfull) {
                tokens = defaultUserTokens;
            } else {
                alert("Error clearing votes");
            }
        });
    }
</script>

<div class="voting-div">
    {#if anwsers.length === 0}
        <p>No answers received yet.</p>
    {:else}
        <h2>Voting time!</h2>
        <ul>
            {#each anwsers as userAnswer}
                {#each [votedAnswersIds.includes(userAnswer.id)] as alreadyVoted}
                <li class={"answer " + (alreadyVoted ? "voted" : "not-voted")}>
                    <button onclick={() => selectVote(userAnswer)} disabled={alreadyVoted}>
                        {userAnswer.answer} {userAnswer?.unit ?? ""}
                    </button>
                </li>
                {/each}
            {/each}
        </ul>
        <button onclick={clearVotes} class="btn red-btn">Clear</button>
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

    .answer {
        color: black;
        margin: 10px 0;
        padding: 15px 20px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        text-align: center;

        transition: transform 0.2s;
        overflow: hidden; /* Ensure overflow is hidden */

        /* Remove style from button */
        & button {
            background-color: transparent;
            border: none;
            color: inherit;
            font-size: inherit;
            cursor: pointer;
            padding: 0;
            margin: 0;
            text-align: center;
            text-decoration: none;
        }
    }

    .answer:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    .voted {
        background-color: #4caf50;
        color: white;
        border: 1px solid #4caf50;
    }

</style>