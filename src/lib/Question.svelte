<script lang="ts">
    import { socket } from "../socketStore";
    import { gameState, users } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question, UserAnswer } from "../interfaces";
  import { anwsers } from "../anwsersStore";

    let answer = 0;
    let waiting = false;

    let currentQuestion: string | null;
    $socket.emit("get-question", (question: string) => {
        currentQuestion = question;
    })

    $socket.on("all-users-answered", () => {
        waiting = false;
        gameState.set("voting");
    })

    function onAnswer() {
        if (answer === 0) {
            alert("Please enter an answer");
            return;
        }
        $socket.emit("send-answer", answer, () => {
            waiting = true
        })
    }
</script>

<div class="question-div">
    {#if currentQuestion !== null}
        {#if waiting}
            <p>Waiting for other players...</p>
        {:else}
            <p>Question: {currentQuestion}</p>
            <input bind:value={answer} type="number" name="answer" id="answer">
            <button on:click={onAnswer}>Answer!</button>
        {/if}
    {/if}
</div>

<style>

</style>