<template>
  <div>
    <ul>
      <li v-for="chat of chats" :key="chat.id">
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{
          chat.id
        }}</router-link>
      </li>
    </ul>
    <button @click="createChatRoom()" class="button">Create New Chat</button>
  </div>
</template>

<script>
import { db } from "./firebase";

export default {
  data() {
    return {
      chats: []
    };
  },
  firestore() {
    return {
      chats: db.collection("chats").where("owner", "==", this.uid)
    };
  },
  props: ["uid"],
  methods: {
    async createChatRoom() {
      await db.collection("chats").add({
        createdAt: Date.now(),
        owner: this.uid,
        members: [this.uid]
      });
    }
  }
};
</script>
