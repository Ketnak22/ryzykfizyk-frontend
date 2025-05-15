<script lang="ts">
    import { socket } from "../socketStore";
    import { gameState, users } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question, UserAnswer, Response } from "../interfaces";
    import { userAnswers } from "../ userAnswersStore";

    interface VotedAnswer {
        id: string;
        tokens: number;
    }

    let waiting = $state(false);

    let tokens: number;
    let startingTokens: number;
    // let anwsers = $state<UserAnswer[]>([]);
    let votedAnswers = $state<VotedAnswer[]>([]);
    $socket.emit("start-voting", (r_anwsers: UserAnswer[], r_tokens: number) => {
        if (r_tokens === -1) {
            alert("Something went wrong, please try again");
            return;
        }
        startingTokens = r_tokens;
        tokens = startingTokens;
        $userAnswers = r_anwsers.sort((a, b) => a.answer - b.answer); // Sort answers by value 
    });

    $socket.on("all-users-voted", () => {
        gameState.set("showingResults");
        waiting = false;
        alert("All users have voted!");
    })

    function hasUserAlreadyVotedForAnswer(answerId: string): boolean {
        return votedAnswers.some((votedAnswer) => votedAnswer.id === answerId);
    }

    function selectVote(answer: UserAnswer) {
        if (tokens <= 0) {
            alert("You have no tokens left");
            return;
        }

        if (hasUserAlreadyVotedForAnswer(answer.id)) {
            alert("You have already voted for this answer");
            return;
        }

        const bet = prompt(`You have ${tokens} tokens left. How much do you want to bet for ${answer.answer} ${answer?.unit ?? ""}?`);
        if (isNaN(Number(bet)) || bet === null || bet === "") {
            return;
        }
        const betValue = Number(bet);

        if (betValue > tokens) {
            alert("You don't have enough tokens!");
            return;
        }

        votedAnswers.push({ id: answer.id, tokens: betValue });
       
        tokens -= betValue;

        console.log(votedAnswers);
        console.log("Tokens left: ", tokens);
    }

    function clearVotes() {
        votedAnswers = [];
        tokens = startingTokens;

        console.log("Cleared votes, tokens: ", tokens);
    }

    function confirmVotes() {
        if (votedAnswers.length === 0) {
            alert("You have not voted for any answer");
        }

        $socket.emit("confirm-votes", votedAnswers, tokens, (response: Response) => {
            if (response.success) {
                votedAnswers = [];
                tokens = startingTokens;
                waiting = true;
            } else {
                alert(response.message);
            }
        });
    }
</script>

<div class="voting-div">
    {#if $userAnswers.length === 0}
        <p>No answers received yet.</p>
    {:else}
        {#if !waiting}
        <ul>
            {#each $userAnswers as userAnswer}
                {#each [hasUserAlreadyVotedForAnswer(userAnswer.id)] as alreadyVoted}
                <li class={"answer " + (alreadyVoted ? "voted" : "not-voted")}>
                    <button onclick={() => selectVote(userAnswer)} disabled={alreadyVoted}>
                        {userAnswer.answer} {userAnswer?.unit ?? ""}
                    </button>
                </li>
                {/each}
            {/each}
        </ul>
        <button onclick={clearVotes} class="btn red-btn">Clear</button>
        <button onclick={confirmVotes} class="btn green-btn">Confirm</button>
        {:else}
            <p>Waiting for other players to vote...</p>
        {/if}
    {/if}
</div>

<style>
    p {
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