<template>
  <div class="mid">
    <div class="left-mid bckg">
      <form class="search" @submit.prevent="search">
        <img src="~assets/img/Search_Noun_project_15028.svg.png" alt="" />
        <input
          type="search"
          name="search-food"
          placeholder="Znajdź jedzenie, markę lub restaurację"
          v-model="food"
        />
        <img
          src="~assets/img/Tab_plus.svg.png"
          alt="Plus"
          class="plus"
          @click="add = !add"
        />
      </form>
      <!-- <button > -->
      <!-- </button> -->
      <div class="field">
        <label class="label">Tylko ja?</label>
        <div class="control">
          <input type="checkbox" class="input" name="onlyMe" v-model="onlyMe" />
        </div>
      </div>
      <br />
      <div class="items">
        <div class="item-1" v-for="meal in meals" :key="meal.id">
          <div class="food-name">
            <p>{{ meal.name }}</p>
            <br />
            <p>Kalorie: {{ meal.calories }} kcal</p>
          </div>
          <div class="makro">
            <p>
              Weglowodany:
              <span>{{ meal.composition.weglowodany }}</span>
            </p>
            <p>
              Tłuszcz:
              <span>{{ meal.composition.tluszcz }}</span>
            </p>
            <p>
              Białko: <span>{{ meal.composition.bialko }}</span>
            </p>
          </div>
          <button @click="addToHistory(meal.id)">Dzisiaj jedzone!</button>
        </div>
      </div>
    </div>
    <div class="right-mid bckg" v-show="add">
      <vue-form
        class="search dir"
        :state="formstate"
        @submit.prevent="onSubmit"
      >
        <validate tag="label">
          <span>Nazwa *</span>
          <input v-model="name" required name="name" type="text" />

          <field-messages name="name">
            <div slot="required">Musisz podać nazwę posiłku</div>
          </field-messages>
        </validate>

        <validate tag="label">
          <span>Kalorie *</span>
          <input
            v-model="kalorie"
            name="kalorie"
            type="number"
            placeholder="0"
            required
          />
        </validate>

        <validate tag="label">
          <span>Węglowodany *</span>
          <input
            v-model="weglowodany"
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
            v-model="tluszcz"
            name="tluszcz"
            type="text"
            placeholder="0"
            required
          />

          <field-messages name="tluszcz">
            <div slot="required">Musisz podać wartość (np. 50g)</div>
          </field-messages>
        </validate>

        <validate tag="label">
          <span>Białko *</span>
          <input
            v-model="bialko"
            name="bialko"
            type="text"
            placeholder="0"
            required
          />

          <field-messages name="bialko">
            <div slot="required">Musisz podać wartość (np. 50g)</div>
          </field-messages>
        </validate>

        <validate tag="label">
          <span>Jedzone dzisiaj?</span>
          <input
            v-model="jedzone"
            name="jedzone"
            type="checkbox"
            value="false"
          />
        </validate>

        <button type="submit">Dodaj</button>
      </vue-form>
    </div>
    <div v-show="!add" class="right-mid">
      <img src="~assets/img/foods-3520938_960_720.png" alt="" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
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
      jedzone: false,
      onlyMe: false,
      meals: [],
      formstate: {}
    }
  },

  computed: {
    ...mapGetters(['loggedInUser'])
  },
  async mounted() {
    await this.search()
  },
  notifications: {
    showError: {
      title: 'Błąd szukania',
      message: 'Błędne dane!',
      type: 'error'
    }
  },
  methods: {
    async onSubmit() {
      if (this.formstate.$invalid) {
        this.showError()
        return
      }
      const data = {
        name: this.name,
        calories: this.kalorie,
        composition: {
          weglowodany: this.weglowodany,
          tluszcz: this.tluszcz,
          bialko: this.bialko
        }
      }

      const mealId = await this.$axios.post('meals/add', {
        data
      })

      if (this.jedzone) {
        await this.addToHistory(mealId.data)
      }
    },
    async addToHistory(mealId) {
      try {
        await this.$axios.post('historic/add', {
          mealId,
          userId: this.loggedInUser.id,
          date: new Date()
        })
      } catch (e) {
        this.showError()
      }
    },
    async search() {
      try {
        const data = await this.$axios.post('meals', {
          onlyMe: this.onlyMe,
          title: this.food
        })

        this.meals = data.data
      } catch (e) {
        this.showError()
      }
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
  height: 80%;
  overflow: scroll;
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
  padding: 10px;
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
.items {
  display: flex;
  flex-direction: column;
}
</style>
