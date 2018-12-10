<template>
    <box width="100%" height="90%" top="10%" left="0" border="{ type: 'line', fg: 'blue' }"  :label="board.name">
        <text :content="JSON.stringify(board)" />
    </box>
</template>

<script>
export default {
    name: 'Board',
    computed: {
        board() {
            return this.$store.state.viewingBoard;
        }
    }
};
</script>