<template>
  <div class="mid">
    <Notification :message="error" v-if="error" />
    <div class="left-mid bckg">
      <form class="search" @submit.prevent="search">
        <img src="~assets/img/Search_Noun_project_15028.svg.png" alt="" />
        <input
          type="search"
          name="search-food"
          placeholder="Znajdź jedzenie, markę lub restaurację"
          v-model="food"
        />
      </form>
      <br />
      <div class="item-1" v-for="meal in meals" :key="meal.id">
        <div class="food-name">
          <p>{{ meal.name }}</p>
          <br />
          <p>Kalorie: {{ meal.calories }}</p>
        </div>
        <div class="makro">
          <p>
            Weglowodany:
            <span>{{ meal.composition | filterComp('weglowodany') }}</span>
          </p>
          <p>
            Tłuszcz: <span>{{ meal.composition | filterComp('tluszcz') }}</span>
          </p>
          <p>
            Białko: <span>{{ meal.composition | filterComp('bialko') }}</span>
          </p>
        </div>
        <button @click="removeFromHistory(meal.id)">Usuń!</button>
      </div>
    </div>
    <div class="right-mid" v-if="!add">
      <img src="~assets/img/foods-3520938_960_720.png" alt="" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  filters: {
    filterComp: (value, selector) => {
      if (!value) return ''
      return JSON.parse(value)[selector]
    }
  },
  data() {
    return {
      food: '',
      error: null,
      add: false,
      name: '',
      kalorie: 0,
      weglowodany: 0,
      tluszcz: 0,
      bialko: 0,
      meals: []
    }
  },

  computed: {
    ...mapGetters(['loggedInUser'])
  },
  async mounted() {
    try {
      const data = await this.$axios.post('historic')
      this.meals = data.data
    } catch (e) {
      this.error = e.response
    }
  },

  methods: {
    async search() {
      try {
        const data = await this.$axios.post('historic', {
          title: this.food
        })

        this.meals = data.data
      } catch (e) {
        this.error = e.response
      }
    },

    async removeFromHistory(mealId) {
      try {
        await this.$axios.post('historic/remove', {
          mealId,
          userId: this.loggedInUser.id
        })
      } catch (e) {
        this.error = e.response
      }
    },

    async send() {
      const data = {
        name: this.name,
        calories: this.kalorie,
        composition: JSON.stringify({
          weglowodany: this.weglowodany,
          tluszcz: this.tluszcz,
          bialko: this.bialko
        })
      }
      await this.$axios.post('meals/add', {
        data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70vh;
  position: relative;
}
.bckg {
  background: white;
  opacity: 0.8;
  padding: 30px;
}
.left-mid img {
  width: 50px;
}

.plus {
  position: relative;
  // top: 210px;
  // left: 450px;
}

.right-mid img {
  width: 500px;
}

form {
  display: flex;
}

.dir {
  flex-direction: column;
}

form input {
  width: 300px;
  margin-left: 30px;
}

.item-1 {
  display: flex;
  justify-content: space-between;
}

.food-name p:first-child {
  font-weight: bold;
}

.makro span {
  color: red;
  font-weight: bold;
}

@media (max-width: 414px) {
  .mid {
    display: flex;
    flex-direction: column;
  }
  .right-mid img {
    width: 350px;
  }
  .plus {
    // top: 70px;
    // left: 400px;
  }
}
</style>
