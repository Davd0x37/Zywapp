<template>
  <div class="mid">
    <div class="left-mid">
      <a @click="incDate(1)"
        ><img class="arrow-right-1" src="~assets/img/Arrow-right-512.png" alt=""
      /></a>
      <a @click="incDate(-1)"
        ><img
          class="arrow-left"
          src="~assets/img/896px-Font_Awesome_5_solid_arrow-left.svg.png"
          alt=""
      /></a>
      <div class="mid-title">
        <h2>{{ data.pelna }}</h2>
        <p>{{ data.dzien }}</p>
      </div>
      <div class="eat-title" v-for="meal in meals" :key="meal.title">
        <h3>{{ meal.name }}</h3>
        <p>
          {{ meal.composition.weglowodany }} | {{ meal.composition.tluszcz }} |
          {{ meal.composition.bialko }} | {{ meal.calories }}kcal
        </p>
        <button class="x" @click="removeFromHistory(meal.id) + searchSleep()">
          X
        </button>
      </div>
      <div class="eat-stat">
        <p :class="[eatComp.cal > limitCal ? 'over' : '']">
          Spożyte
          <span>{{ eatComp.cal }} / {{ limitCal }}</span>
          kcal
        </p>
        <p>
          <span :class="[eatComp.carbo > limitCarbo ? 'over' : '']"
            >{{ eatComp.carbo }}g</span
          >
          |
          <span :class="[eatComp.fat > limitFat ? 'over' : '']"
            >{{ eatComp.fat }}g</span
          >
          |
          <span :class="[eatComp.protein > limitProtein ? 'over' : '']"
            >{{ eatComp.protein }}g</span
          >
        </p>
      </div>
    </div>
    <div class="right-mid">
      <h2>Ustal swój limit kaloryczny</h2>
      <vue-form
        class="search dir"
        :state="formstate"
        @submit.prevent="onSubmit"
      >
        <validate tag="label">
          <span>Kalorie *</span>
          <input
            v-model="limitCal"
            name="kalorie"
            type="number"
            required
            placeholder="0"
          />

          <field-messages name="kalorie">
            <div slot="required">Musisz podać wartość (np. 500kcal)</div>
          </field-messages>
        </validate>
        <validate tag="label">
          <span>Węglodowany *</span>
          <input
            v-model="limitCarbo"
            name="weglowodany"
            type="text"
            required
            placeholder="0"
          />

          <field-messages name="weglowodany">
            <div slot="required">Musisz podać wartość (np. 50g)</div>
          </field-messages>
        </validate>
        <validate tag="label">
          <span>Tłuszcz *</span>
          <input
            v-model="limitFat"
            name="tluszcz"
            type="text"
            required
            placeholder="0"
          />

          <field-messages name="tluszcz">
            <div slot="required">Musisz podać wartość (np. 50g)</div>
          </field-messages>
        </validate>
        <validate tag="label">
          <span>Białko *</span>
          <input
            v-model="limitProtein"
            name="bialko"
            type="text"
            required
            placeholder="0"
          />

          <field-messages name="bialko">
            <div slot="required">Musisz podać wartość (np. 50g)</div>
          </field-messages>
        </validate>

        <button type="submit">Zapisz</button>
      </vue-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default {
  middleware: 'auth',
  data() {
    return {
      add: false,
      name: '',
      limitCal: 0,
      limitCarbo: 0,
      limitFat: 0,
      limitProtein: 0,
      currentDate: new Date(),
      meals: [],
      formstate: {}
    }
  },

  computed: {
    ...mapGetters(['loggedInUser']),
    data() {
      // data + 1 == a.setDate(a.getDate() + 1)
      const dni = [
        'Niedziela',
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota'
      ]
      const date = new Date()
      const day = this.currentDate
      if (date.getDate() === day.getDate()) {
        return { pelna: 'Dzisiaj', dzien: dni[day.getDay()] }
      } else if (date.getDate() - day.getDate() === 1) {
        return { pelna: 'Wczoraj', dzien: dni[day.getDay()] }
      } else if (date.getDate() - day.getDate() === -1) {
        return { pelna: 'Jutro', dzien: dni[day.getDay()] }
      } else {
        return {
          pelna: this.currentDate.toLocaleDateString(),
          dzien: dni[day.getDay()]
        }
      }
    },
    mealsAsync() {
      return this.meals
    },
    eatComp() {
      return {
        cal: this.meals.reduce((prev, curr) => prev + curr.calories, 0),
        carbo: this.meals.reduce(
          (prev, curr) =>
            prev + Number(curr.composition.weglowodany.replace('g', '')),
          0
        ),
        fat: this.meals.reduce(
          (prev, curr) =>
            prev + Number(curr.composition.tluszcz.replace('g', '')),
          0
        ),
        protein: this.meals.reduce(
          (prev, curr) =>
            prev + Number(curr.composition.bialko.replace('g', '')),
          0
        )
      }
    }
  },
  async mounted() {
    try {
      const data = await this.$axios.post('historic', {
        date: this.currentDate.toLocaleDateString('en').replace(/\//gim, '.')
      })
      this.meals = data.data
      const me = await this.$axios.get('me')
      this.limitCal = me.data.data.limitCal || 0
      this.limitCarbo = me.data.data.limitCarbo || 0
      this.limitFat = me.data.data.limitFat || 0
      this.limitProtein = me.data.data.limitProtein || 0
    } catch (e) {
      console.error(e)
    }
  },

  methods: {
    async onSubmit() {
      if (this.formstate.$invalid) {
        // alert user and exit early
        console.log('Invalid form!!')
        return
      }

      await this.$axios.post('me/update_limits', {
        limitCal: this.limitCal,
        limitCarbo: this.limitCarbo,
        limitFat: this.limitFat,
        limitProtein: this.limitProtein
      })
    },
    async incDate(num) {
      const date = this.currentDate
      date.setDate(date.getDate() + num)
      this.currentDate = new Date(date)
      await this.search()
    },
    async search() {
      try {
        const data = await this.$axios.post('historic', {
          date: this.currentDate.toLocaleDateString('en').replace(/\//gim, '.')
        })

        this.meals = data.data
      } catch (e) {
        console.error(e)
      }
    },

    async removeFromHistory(mealId) {
      try {
        await this.$axios.post('historic/remove', {
          mealId,
          userId: this.loggedInUser.id
        })
      } catch (e) {
        console.error(e)
      }
    },

    async searchSleep() {
      await sleep(1500)
      await this.search()
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
.over {
  color: red;
  font-weight: bold;
}
.mid {
  display: flex;
  justify-content: space-around;
  height: 70vh;
  width: 100%;
}

.left-mid {
  background: white;
  opacity: 0.8;
  width: 40%;
  margin-top: 50px;
  position: relative;
}

.arrow-right-1 {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 0;
}

.arrow-left {
  width: 50px;
  height: 50px;
  position: absolute;
  left: 0;
}

.mid-title {
  text-align: center;
}

.eat-title {
  margin-left: 50px;
  padding: 10px;
  position: relative;
}

.eat-title .x {
  position: absolute;
  top: 0;
  right: 1.1%;
}

.plus {
  width: 50px;
  height: 50px;
}

.meal {
  padding: 10px;
  margin-left: 100px;
  background: grey;
  opacity: 0.8;
  position: relative;
}

.meal a {
  position: absolute;
  top: 0;
  right: 5%;
}

.eat-stat {
  // position: absolute;
  bottom: 0;
  text-align: center;
  background: grey;
  padding: 20px;
  width: 100%;
}

.right-mid {
  width: 40%;
  background: white;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 50px;
}

.right-mid h2 {
  font-size: 30px;
}

.right-mid form {
  display: flex;
  padding-top: 50px;
  flex-direction: column;
  /* background: yellow; */
  align-items: center;
  justify-content: center;
  font-size: 20px;
  width: 500px;
  margin: 0 auto;
}

.zapisz-kalorie {
  margin-top: 100px;
  border: 0;
  padding: 15px;
  background: rgb(48, 255, 227);
  cursor: pointer;
}

@media (max-width: 414px) {
  .mid {
    justify-content: space-evenly;
    height: 100vh;
  }
  .right-mid form {
    width: 100px;
  }
  .right-mid form input {
    padding: 10px;
    margin-top: 20px;
  }
  .eat-title {
    margin: 0;
  }
  .meal {
    margin-left: 20px;
  }
  .arrow-right-1 {
    width: 30px;
    height: 30px;
  }
  .arrow-left {
    width: 30px;
    height: 30px;
  }
}
</style>
