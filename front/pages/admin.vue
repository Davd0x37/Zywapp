<template>
  <div class="mid">
    <div class="left-mid">
      <b-tabs content-class="mt-3">
        <b-tab title="Użytkownicy" active>
          <div class="eat-title" v-for="user in users" :key="user.id">
            <h3>Login: {{ user.login }}</h3>
            <p>Email: {{ user.email }}</p>
            <p>Typ konta: {{ user.accountType }}</p>
            <p>Admin: {{ user.isAdmin ? 'tak' : 'nie' }}</p>
            <button @click="deleted(user.id, 'user')">X</button>
            <button @click="giveAdmin(user.id)">
              {{ user.isAdmin ? 'Zabierz admina' : 'Daj admina' }}
            </button>
            <button @click="changePlan(user.id)">Zmień plan</button>
          </div>
        </b-tab>
        <b-tab title="Posiłki">
          <div class="eat-title" v-for="meal in meals" :key="meal.id">
            <h3>Nazwa: {{ meal.name }}</h3>
            <p>Kalorie: {{ meal.calories }}</p>
            <p>Skład: {{ meal.composition }}</p>
            <button @click="deleted(meal.id, 'meal')">X</button>
          </div>
        </b-tab>
        <b-tab title="Ćwiczenia">
          <div
            v-for="activity in activites"
            :key="activity.id"
            class="eat-title"
          >
            <h3>Nazwa: {{ activity.title }}</h3>
            <p>Opis: {{ activity.about }}</p>
            <button @click="deleted(activity.id, 'activity')">X</button>
          </div>
        </b-tab>
        <b-tab title="Dzienne">
          <div class="eat-title" v-for="dai in daily" :key="dai.id">
            <h3>Nazwa: {{ dai.name }}</h3>
            <button @click="deleted(dai.id, 'daily')">X</button>
          </div>
        </b-tab>
        <b-tab title="Dodaj dzienne">
          <vue-form class="form" :state="formstate" @submit.prevent="onSubmit">
            <validate tag="label">
              <b-row class="my-1">
                <b-col sm="3">
                  <label for="name">Dzienne wyzwania</label>
                </b-col>
                <b-col sm="9">
                  <b-form-textarea
                    rows="3"
                    max-rows="6"
                    placeholder="Jakieś wyzwanie dla innych?"
                    id="name"
                    type="textarea"
                    v-model="add_daily.name"
                  ></b-form-textarea>
                </b-col>
              </b-row>
            </validate>
            <button type="submit">Zapisz</button>
          </vue-form>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'admin',
  data() {
    return {
      users: [],
      meals: [],
      activites: [],
      daily: [],
      add_daily: {
        name: ''
      },
      formstate: {}
    }
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get('admin')
      this.users = data.users
      this.meals = data.meals
      this.activites = data.activites
      this.daily = data.daily
    } catch (e) {
      console.error(e)
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    async fetchData() {
      try {
        if (this.isAuthenticated && this.loggedInUser) {
          if (this.loggedInUser.isAdmin) {
            const { data } = await this.$axios.get('admin')
            this.users = data.users
            this.meals = data.meals
            this.activites = data.activites
            this.daily = data.daily
          } else {
            this.$router.push('/')
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    async onSubmit() {
      if (this.formstate.$invalid) {
        // alert user and exit early
        console.log('Invalid form!!')
        return
      }
      await this.$axios.post('admin/add_daily', {
        name: this.add_daily.name
      })
    },
    async deleted(id, type) {
      try {
        await this.$axios.post('admin/remove', {
          type,
          id
        })
      } catch (e) {
        console.error(e)
      }
    },
    async giveAdmin(userId) {
      try {
        await this.$axios.post('admin/toggle_admin', {
          userId
        })
      } catch (e) {
        console.error(e)
      }
    },
    async changePlan(userId) {
      try {
        await this.$axios.post('admin/toggle_plan', {
          userId
        })
      } catch (e) {
        console.error(e)
      }
    },
    async addDaily(name) {
      try {
        await this.$axios.post('admin/add_daily', {
          name
        })
      } catch (e) {
        console.error(e)
      }
    }
  },
  cron: [
    {
      time: 2000,
      method: 'fetchData'
    }
  ]
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
  width: 50%;
  overflow: scroll;
  height: 90%;
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
