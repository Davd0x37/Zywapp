<template>
  <header>
    <div class="top-left">
      <nuxt-link to="/">
        <img
          class="logoImg"
          src="~assets/img/logo.png"
          alt="Non commercial sports logo"
        />
        <p>aŻywieniowa</p>
      </nuxt-link>
    </div>
    <div class="top-right" v-if="!isAuthenticated">
      <nuxt-link to="/login">Logowanie</nuxt-link>
      <img
        class="arrowImg"
        src="~assets/img/arrow-39658_960_720.webp"
        alt="Arrow"
      />
      <nuxt-link to="/rejestracja">Rejestracja</nuxt-link>
    </div>
    <div class="navbar-item has-dropdown is-hoverable" v-if="isAuthenticated">
      <a class="navbar-link">
        {{ loggedInUser.login }} | {{ loggedInUser.accountType }}
      </a>
      <div class="navbar-dropdown">
        <a class="navbar-link">
          {{ loggedInUser.isAdmin ? 'Admin' : 'Użytkownik' }}
        </a>
        <nuxt-link class="navbar-item" to="/admin" v-if="loggedInUser.isAdmin"
          >Panel administratora</nuxt-link
        >
        <hr class="navbar-divider" />
        <nuxt-link class="navbar-item" to="/profile">Mój profil</nuxt-link>
        <hr class="navbar-divider" />
        <a class="navbar-item" @click="logout">Wyloguj</a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>

<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  padding: 30px 0 30px 0;
  height: 150px;
  position: relative;
}

.top-left a {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  transition: color 0.3s ease;
  transition: font-weight 0.3s ease;
}

.top-left a:hover {
  font-weight: bold;
  color: white;
}

.top-left a p {
  margin-left: 30px;
  font-size: 30px;
  transition: color 0.3s ease;
  transition: font-weight 0.3s ease;
}

.top-right a:hover {
  font-weight: bold;
  color: white;
}

.top-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-right a {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  font-size: 30px;
}

.logoImg {
  width: 110px;
  border-radius: 10px;
}

.arrowImg {
  width: 35px;
}

@media (max-width: 414px) {
  body {
    object-fit: cover;
  }
  header {
    padding: 30px 0 30px 0;
    justify-content: flex-start;
    height: 250px;
  }
  .top-left {
    width: 100%;
  }
  .top-right {
    flex-direction: column;
    position: absolute;
    height: 50px;
    right: 12%;
    bottom: 20%;
  }
  .top-right a {
    margin-top: 10px;
    font-size: 20px;
  }
  .top-right img {
    display: none;
  }
}
</style>
