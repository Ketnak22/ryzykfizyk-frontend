<script lang="ts">
    import { onMount } from "svelte";

    import { socket } from "../socketStore";
    import { gameState, users } from "../usersStore";
    import type { Question, UserAnswer, Response } from "../interfaces";

    import { userAnswers } from "../ userAnswersStore";


    let correctAnswer: {answer: number, unit: string};
    let closestAnswer: number;
    let tokens: number = 0;
    let allUsersTokens: number[] = [];

    let loading = true;

    onMount(() => {
        $socket.emit("get-voting-results", (r_correctAnswer: {answer: number, unit: string}, r_closestAnswer: number, r_tokens: number, r_allUsersTokens: number[]) => {
            correctAnswer = r_correctAnswer;
            closestAnswer = r_closestAnswer;
            tokens = r_tokens;
            allUsersTokens = r_allUsersTokens;
            loading = false;
        });
    });
</script>

<div class="voting-results-div">
    {#if loading}
        <p>Loading...</p>
    {:else}
    <h2>Voting Results</h2>
    <p>Correct Answer: {correctAnswer.answer} {correctAnswer?.unit}</p>

    <ul>
        {#each $userAnswers as userAnswer}
            <li class={"answer" + " " + (userAnswer.answer === correctAnswer?.answer ? " correct-answer" : "") + " " + (userAnswer.answer === closestAnswer ? "closest-answer" : "")}>
                {userAnswer.answer} {userAnswer.unit}
            </li>    
        {/each}
    </ul>

    <p>Current tokens: {tokens}</p>
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

    .voting-results-div {
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
    }

    .correct-answer {
        background-color: #4caf50 !important; /* Green */
        color: white;
    }

    .closest-answer {
        background-color: #ff9800; /* Orange */
        color: white;
    }
</style>