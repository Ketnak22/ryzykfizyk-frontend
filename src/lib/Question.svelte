 <script lang="ts">
    import { socket } from "../socketStore";
    import { gameState } from "../usersStore";

    let answer = "";
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
        if (isNaN(Number(answer)) || String(answer).trim() === "") {
            alert("Please enter an answer");
            return;
        }
        $socket.emit("send-answer", answer, (successfull: boolean) => {
            if (successfull) {
                waiting = true
            } else {
                alert("Error sending answer");
            }
        })
    }
</script>

<div class="question-div">
    {#if currentQuestion !== null}
        {#if waiting}
            <p>Waiting for other players...</p>
        {:else}
            <p>{currentQuestion}</p>
            <input bind:value={answer} type="text" name="answer" id="answer">
            <button onclick={onAnswer} class="btn green-btn">Answer!</button>
        {/if}
    {/if}
</div>

<style>
    .question-div {
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

    input {
        width: 200px;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    input:focus {
        border-color: #04AA6D;
        box-shadow: 0 4px 8px rgba(0, 170, 109, 0.2);
        outline: none;
    } 
</style>