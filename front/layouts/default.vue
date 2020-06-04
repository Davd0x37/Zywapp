<template>
  <div id="container">
    <Header />
    <Menu />
    <nuxt />
    <Footer />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Menu from '~/components/Menu.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
export default {
  components: {
    Menu,
    Header,
    Footer
  },
  data() {
    return {
      currentTime: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  notifications: {
    showReminder: {
      title: 'Przypomnienie',
      message: 'Przypomnienie',
      type: 'info',
      timeout: 15000
    }
  },
  methods: {
    async fetchUser() {
      if (this.isAuthenticated && this.loggedInUser) {
        const {
          data: { data }
        } = await this.$axios.get('me')
        if (data) {
          this.$store.commit('updateUser', data)
        }
      }
    },
    checkReminders() {
      this.currentTime = new Date()
      if (this.isAuthenticated && this.loggedInUser) {
        if (this.loggedInUser.reminders.hours) {
          const { parameters } = this.loggedInUser
          if (parameters) {
            const { godzina } = parameters
            if (godzina !== undefined) {
              const [gdz, min] = godzina.split(':')
              if (
                this.currentTime.getHours() === Number(gdz) &&
                this.currentTime.getMinutes() === Number(min)
              ) {
                const {
                  challenges,
                  exercises,
                  fluids,
                  microIngredients
                } = this.loggedInUser.reminders
                if (challenges) {
                  this.showReminder({ message: 'Pamiętaj o swoim wyzwaniu!' })
                }
                if (exercises) {
                  this.showReminder({ message: 'Pamiętaj o ćwiczeniach!' })
                }
                if (fluids) {
                  this.showReminder({
                    message: 'Pamiętaj aby uzupełniać płyny'
                  })
                }
                if (microIngredients) {
                  this.showReminder({
                    message:
                      'Pamiętaj o odpowiednim przyjmowaniu makro/mikro składników'
                  })
                }
              }
            }
          }
        }
      }
    }
  },
  cron: [
    {
      time: 15000,
      method: 'checkReminders'
    },
    {
      time: 5000,
      method: 'fetchUser'
    }
  ]
}
</script>
<style>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-image: url('~assets/img/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  font-family: 'Avenir Next', 'Avenir', sans-serif;
  position: relative;
}

#container {
  max-width: 1500px;
  height: 100vh;
  margin: 0 auto;
}

@media (max-width: 414px) {
  #container {
    width: 530px;
  }
}

ul {
  list-style: none;
}

a {
  color: black;
  text-decoration: none;
}

.mid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70vh;
}

.mid h1 {
  font-size: 60px;
}

@media (max-width: 414px) {
  .mid {
    display: block;
    text-align: center;
    height: 120vh;
    padding-top: 100px;
  }
  .mid h1 {
    font-size: 80px;
  }
  .runningGirl {
    padding-top: 50px;
  }
}
</style>
