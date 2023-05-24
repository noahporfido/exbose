<template>
  <div class="text-slate-200">
    <TextButton v-if="!accessToken" @click="authorize">
      Authorize with Spotify
    </TextButton>
    <div v-else>
      <button @click="searchSongs">Search Songs</button>
      <input v-model="searchQuery" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TextButton from "@/components/buttons/TextButton.vue";
import axios from "axios";
import { onMounted } from "vue";

const clientId = "360f9e67c40d463590246aef7b1b591a";
const redirectUri = "http://localhost:5173";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

const codeVerifier = ref("");
const codeChallenge = ref("");
const accessToken = ref("");

const searchQuery = ref("");

const authorize = () => {
  generateCodeVerifier();
  generateCodeChallenge()
    .then(() => {
      localStorage.setItem("code_verifier", codeVerifier.value);

      const state = generateRandomString(16);
      const scope = ""; // Specify the required scopes for your application

      const url =
        `${authorizationEndpoint}?client_id=${clientId}` +
        `&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code_challenge=${codeChallenge.value}&code_challenge_method=S256` +
        `&state=${state}&scope=${encodeURIComponent(scope)}`;

      window.location.href = url;
    })
    .catch((error) => {
      console.error("Failed to generate code challenge:", error);
    });
};

const generateCodeVerifier = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  for (let i = 0; i < 128; i++) {
    verifier += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  codeVerifier.value = verifier;
};

const generateCodeChallenge = () => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier.value);
  return window.crypto.subtle.digest("SHA-256", data).then((buffer) => {
    const challenge = base64UrlEncode(buffer);
    codeChallenge.value = challenge;
  });
};

const base64UrlEncode = (buffer: ArrayBuffer) => {
  let base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  base64 = base64.replace(/=/g, "");
  base64 = base64.replace(/\+/g, "-");
  base64 = base64.replace(/\//g, "_");
  return base64;
};

const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
};

const searchSongs = () => {
  if (!accessToken.value) {
    console.error(
      "Access token not found. Perform the authorization flow first."
    );
    return;
  }

  // Replace with your desired search query
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    searchQuery.value
  )}&type=track`;

  axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    })
    .then((response) => {
      // Handle the response data here
      console.log(response.data);
    })
    .catch((error) => {
      // Handle any errors here
      console.error("Failed to search songs:", error);
    });
};

const handleAuthorizationCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const storedCodeVerifier = localStorage.getItem("code_verifier");

  if (code && state && storedCodeVerifier) {
    codeVerifier.value = storedCodeVerifier;
    exchangeCodeForToken(code);
  } else {
    console.error(
      "Authorization failed. Invalid parameters or code verifier mismatch."
    );
  }
};

const exchangeCodeForToken = (code: string) => {
  const data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier.value,
  };

  axios
    .post(tokenEndpoint, new URLSearchParams(data))
    .then((response) => {
      const tokenData = response.data;
      accessToken.value = tokenData.access_token;
      console.log("Access token:", tokenData.access_token);

      // Save access token to localStorage
      localStorage.setItem("access_token", tokenData.access_token);
    })
    .catch((error) => {
      console.error("Failed to exchange code for token:", error);
    });
};

const loadAccessTokenFromLocalStorage = () => {
  const storedAccessToken = localStorage.getItem("access_token");
  if (storedAccessToken) {
    accessToken.value = storedAccessToken;
  }
};

onMounted(() => {
  loadAccessTokenFromLocalStorage();
  handleAuthorizationCallback();
});
</script>
