<template>
  <aside class="section">
    <h3>Sign In Anonymously</h3>
    <button class="button" @click="auth.signInAnonymously()">Sign In</button>

    <div v-if="newUser">
      <h3>Sign Up for a New Account</h3>
      <a href="#" @click="newUser = false">Returning User?</a>
    </div>

    <div v-else>
      <h3>Sign In with an Email</h3>
      <a href="#" @click="newUser = true">New User?</a>
    </div>

    <label for="email">Email</label>
    <input v-model="email" placeholder="email" type="email" class="input">
    <label for="password">Password</label>
    <input v-model="password" placeholder="password" type="password" class="input">

    <button 
      @click="signInOrCreateUser()" 
      class="button" 
      :class="{ 'is-loading': loading }"
      > {{ newUser ? 'Sign Up' : 'Login'}}</button>

    <p class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </aside>
</template>

<script>
import { auth } from './firebase'

export default {
  data() {
    return {
      newUser: false,
      email: '',
      password: '',
      auth,
      loading: false,
      errorMessage:'',
    }
  },
  methods: {
    async signInOrCreateUser() {
      this.loading = true
      this.errorMessage = ''

      try {
        if (this.newUser) {
          await auth.createUserWithEmailAndPassword(this.email, this.password)
        } else {
          await auth.signInWithEmailAndPassword(this.email, this.password)
        }
        } catch(error) {
        this.errorMessage = error.message
        }
   
      this.loading = false
    }
  }
}
</script>