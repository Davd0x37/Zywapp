<template>
  <div id="container">
    <div class="mid">
      <h1>Osiągnij swój cel jeszcze prościej!</h1>
      <div class="mid-mid">
        <div class="mid-left">
          <h3>12 miesięcy</h3>
          <span>159.99zł</span>
          <button @click="upgradeToPremium()">Kup</button>
        </div>
        <div class="mid-right">
          <h3>1 miesiąc</h3>
          <span>29.99zł</span>
          <button @click="upgradeToPremium()">Kup</button>
        </div>
      </div>
      <p>PREMIUM</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  notifications: {
    showError: {
      title: 'Błąd',
      message: 'Błędne dane!',
      type: 'error'
    }
  },
  methods: {
    async upgradeToPremium() {
      try {
        await this.$axios.post('me/premium')
      } catch (error) {
        this.showError()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mid {
  height: 70vh;
  width: 100%;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: inherit;
  position: relative;
}

.mid h1 {
  position: absolute;
  top: 0;
  left: 18%;
  text-align: center;
}

.mid p {
  position: absolute;
  bottom: 0;
  left: 45%;
  text-align: center;
}

.mid-mid {
  display: flex;
  justify-content: space-around;
}

button {
  cursor: pointer;
}

.mid-left {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  text-align: center;
  background: black;
  color: white;
}

.mid-left button {
  margin-top: 30px;
  padding: 5px;
  font-size: 25px;
  font-weight: bold;
  background: white;
  border: none;
}

.mid-right {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  text-align: center;
  background: white;
  color: black;
}

.mid-right button {
  margin-top: 30px;
  padding: 5px;
  font-size: 25px;
  font-weight: bold;
  background: grey;
  border: none;
}

.mid span {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

@media (max-width: 414px) {
  .mid {
    height: 110vh;
  }
  .mid h1 {
    left: 0%;
  }
  .mid p {
    left: 40%;
  }
}
</style>
