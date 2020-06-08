<template>
  <main>
    <h3>Welcome to Chat Room {{ chatId }}</h3>
    <User #user="{ user }">
      <ul>
        <li v-for="message of messages" :key="message.id">
          <ChatMessage
            :message="message"
            :owner="user.uid === message.sender"
          />
        </li>
      </ul>
      <input v-model="newMessageText" class="input" />
      <hr />

      <h5>Record Audio</h5>
      <button v-if="!recorder" @click="record()">Record</button>
      <button v-else @click="stop()">Stop</button>
      <audio v-if="newAudio" :src="newAudioURL" controls></audio>

      <hr />
      <button
        :disabled="(!newMessageText && !newAudio) || loading"
        class="button is-success"
        type="text"
        @click="addMessage(user.uid)"
      >
        Send
      </button>
    </User>
  </main>
</template>

<script>
import { db, storage } from "./firebase";
import User from "./User";
import ChatMessage from "./ChatMessage";

export default {
  data() {
    return {
      newMessageText: "",
      loading: false,
      messages: [],
      newAudio: null,
      recorder: null
    };
  },
  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection("messages");
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    }
  },
  firestore() {
    return {
      messages: this.messagesCollection.orderBy("createdAt").limitToLast(10)
    };
  },
  methods: {
    async addMessage(uid) {
      this.loading = true;

      let audioURL = null;

      const { id: messageId } = this.messagesCollection.doc();

      if (this.newAudio) {
        const storageRef = storage
          .ref("chats")
          .child(this.chatId)
          .child(`${messageId}.wav`);

        await storageRef.put(this.newAudio);

        audioURL = await storageRef.getDownloadURL();
      }

      await this.messagesCollection.doc(messageId).set({
        text: this.newMessageText,
        sender: uid,
        createdAt: Date.now(),
        audioURL
      });

      this.loading = false;
      this.newMessageText = "";
      this.newAudio = null;
    },
    async record() {
      this.newAudio = null;

      // Source of the audio stream from the browser via microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      // Settings for the MediaRecorder object
      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];

      // Create an object that interfaces audio recordings
      this.recorder = new MediaRecorder(stream, options);

      // Listens to audio data and pushes into an array
      this.recorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });
      // Listens for end of recording and stores the raw data into Blob
      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
      });

      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  },
  components: {
    User,
    ChatMessage
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  padding: 10px;
  border-radius: 0;
}

li {
  display: flex;
}
</style>
