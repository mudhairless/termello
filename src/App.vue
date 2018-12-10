<template>
  <screen title="Termello" ref="screen" :smartCSR="true" :keys="true" :autoPadding="true">
    <box v-if="isLoading" width="50%" height="50%">
      <text style="bg: black; fg: white; bold: true;" top="center" left="center" content="Loading"/>
    </box>
    <box v-else width="100%" height="100%">
      <button top="0" left="0" width="25%" content="[|]" border="{type: 'line'}" @click="goToBoardView"/>
      <button top="0" left="25%" width="25%" :content="notificationLabel" border="{type: 'line'}" />
      <button top="0" right="0" width="25%" align="right" content="[x]" border="{type: 'line'}" @click="exitProgram" />
      <list
        ref="list"
        v-if="viewingBoard == null"
        height="90%"
        top="10%"
        width="100%"
        :border="{}"
        :style="listStyle"
        :items="boardTitles"
        :keys="true"
        :mouse="true"
        @select="selectBoard"
      />
      <trello-board v-if="viewingBoard !== null"/>
    </box>
  </screen>
</template>

<script>
import Board from "./components/Board.vue";

export default {
  name: "Termello",
  components: {
    "trello-board": Board
  },
  data() {
    return {
        notificationTimer: null,
      isLoading: false,
      doSetup: false,
      listStyle: {
        bg: "black",
        fg: "#3FA767",

        border: {
          bg: "black",
          fg: "#3FA767"
        },

        selected: {
          bg: "#444",
          fg: "#F9EC31"
        }
      }
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    boards() {
      return this.$store.state.boards;
    },
    viewingBoard() {
      return this.$store.state.viewingBoard;
    },
    notificationLabel() {
        if (this.$store.state.notifications.length == 0) {
            return '[Notifications]'
        }
        return `[Notifications (${this.$store.state.notifications.length})]`;
    },
    boardTitles() {
      return this.boards.map(item => item.name);
    }
  },
  beforeDestroy() {
      if (this.notificationTimer !== null) {
          clearInterval(this.notificationTimer);
          this.notificationTimer = null;
      }
  },
  mounted() {
    this.$refs.screen.key(["C-c"], () => {
      process.exit(0);
    });
    this.$refs.screen.key(["escape", "q"], () => {
      if (this.viewingBoard === null) {
        this.exitProgram();
      }
      if (this.viewingBoard !== null) {
        this.goToBoardView();
      }
    });
    this.isLoading = true;
    this.$store
      .dispatch("getToken")
      .then(() => {
        return this.$store.dispatch("updateBoards");
      })
      .then(() => {
        this.isLoading = false;
        this.$nextTick(() => {
          this.$refs.list.focus();
        });
        this.notificationTimer = setInterval(() => {
            this.$store.dispatch('refreshNotifications');
        }, 60 * 1000);
      })
      .catch(() => {
        this.doSetup = true;
      });
  },
  methods: {
    goToBoardView() {
      this.$store.commit("setBoardView", null);
      this.$nextTick(() => {
        this.$refs.list.focus();
      });
    },
    exitProgram() {
        process.exit(0);
    },
    selectBoard(event) {
      const bindex = this.boardTitles.indexOf(event.content);
      const board = this.boards[bindex];
      this.$store.commit("setBoardView", board);
    }
  }
};
</script>