<template>
  <div>
    <h1>Register</h1>
    <input class="m-3" v-model="username" />
    <input class="m-3" v-model="email" />
    <input v-model="password" />
    <TextButton :callback="register">Login</TextButton>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import TextButton from "../components/buttons/TextButton.vue";
const store = useUserStore();

const username = ref("");
const email = ref("");
const password = ref("");

const register = () => {
  store.register(username.value, email.value, password.value);
};
</script>
