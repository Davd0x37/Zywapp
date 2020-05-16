<template>
  <div>
    <div class="mid">
    <h1 class="motywacja">Motywacja: {{ motywacja }}</h1>
      <h1>Twoje dzisiejsze wyzwanie to:</h1>
      <p>{{ name }}</p>
      <b-form-checkbox
        id="checkbox-1"
        v-model="status"
        name="checkbox-1"
        value="Wykonane"
        unchecked-value="Nie wykonane"
        @change="updateDaily()"
      >
        {{ status }}
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'premium',
  computed: {
    ...mapGetters(['loggedInUser']),
    motywacja() {
      return this.loggedInUser.about.inspiration
    }
  },
  async mounted() {
    this.status = this.loggedInUser.daily ? 'Wykonane' : 'Nie wykonane'
    const data = await this.$axios.get('me/get_daily')
    this.name = data.data.name
  },
  methods: {
    async updateDaily() {
      const { data } = await this.$axios.post('me/daily', {
        wykonane: this.status === 'Wykonane'
      })
      this.$store.commit('daily', data)
    }
  },
  data() {
    return {
      status: 'Nie wykonane',
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mid {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  height: 70vh;
  width: 100%;
  font-size: 40px;
  position: relative;
}

.motywacja {
  text-align: center;
  padding: 30px;
}

.mid p {
  margin-top: 5%;
}

.mid input {
  position: absolute;
  top: 61%;
  left: 70%;
  width: 50px;
  height: 50px;
}

@media (max-width: 414px) {
  .mid {
    height: 90vh;
  }
  .mid p {
    margin-top: 30%;
  }
  .mid input {
    top: 90%;
    left: 45%;
  }
}
</style>
