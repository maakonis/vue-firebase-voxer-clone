<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { auth } from "./firebase";

export default {
  // Setup is a comp-api lifecycle hook that happens before Create
  setup() {
    // ref creates a reactive component
    // if ref variable changes, the UI re-renders
    const user = ref(null);
    // a firebase method that listens to sign-in or sign-out by the user
    const unsubscribe = auth.onAuthStateChanged(
      fireBaseUser => (user.value = fireBaseUser)
    );
    return {
      user,
      unsubscribe
    };
  },
  destroyed() {
    // Dispose of a real-time stream to avoid data leaks
    this.unsubscribe();
  }
};
</script>
