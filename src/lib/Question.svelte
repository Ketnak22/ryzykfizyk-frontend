<script lang="ts">
    import { socket } from "../socketStore";
    import { users } from "../usersStore";
    import { currentRoom } from "../roomStore";
    import type { Question } from "../interfaces";

    let currentQuestion: Question;
    $socket.emit("get-question", (question: Question) => {
        currentQuestion = question;
    })
</script>

<div>
    
</div>

<style>

</style>