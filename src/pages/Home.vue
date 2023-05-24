<template>
  <div>
    <text-button v-if="showAuthorizeButton" @click="authorize">
      Authorize with Spotify
    </text-button>
    <div class="flex items-center" v-else>
      <input class="rounded m-2 p-2" v-model="searchQuery" />
      <TextButton @click="searchSongs">Search Songs</TextButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import TextButton from "../components/buttons/TextButton.vue";
import axios from "axios";

const clientId = "360f9e67c40d463590246aef7b1b591a";
const redirectUri = "http://localhost:5173";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

const searchQuery = ref("");
const codeVerifier = ref("");
const codeChallenge = ref("");
const accessToken = ref("");
const refreshToken = ref("");

const showAuthorizeButton = computed(() => {
  return !accessToken.value;
});

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
  const byteArray = new Uint8Array(buffer);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
      if (error.response && error.response.status === 401) {
        // Access token expired, try refreshing the token
        refreshAccessToken();
      } else {
        // Handle other errors
        console.error("Failed to search songs:", error);
      }
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
      saveAccessToken(tokenData.access_token);

      const refreshToken = tokenData.refresh_token;
      if (refreshToken) {
        console.log("Refresh token:", refreshToken);
        saveRefreshToken(refreshToken);
      }
    })
    .catch((error) => {
      console.error("Failed to exchange code for token:", error);
    });
};

const refreshAccessToken = () => {
  if (!refreshToken.value) {
    authorize();
    return;
  }

  const data = {
    grant_type: "refresh_token",
    refresh_token: refreshToken.value,
    client_id: clientId,
  };

  axios
    .post(tokenEndpoint, new URLSearchParams(data))
    .then((response) => {
      const tokenData = response.data;
      accessToken.value = tokenData.access_token;
      console.log("Access token refreshed:", tokenData.access_token);

      // Save the refreshed access token
      saveAccessToken(tokenData.access_token);
    })
    .catch((error) => {
      console.error("Failed to refresh access token:", error);
    });
};

const loadAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token") || "";
};

const loadRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem("refresh_token") || "";
};

const saveAccessToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

const saveRefreshToken = (token: string) => {
  localStorage.setItem("refresh_token", token);
};

onMounted(() => {
  accessToken.value = loadAccessTokenFromLocalStorage();
  refreshToken.value = loadRefreshTokenFromLocalStorage();
  handleAuthorizationCallback();
});
</script>
