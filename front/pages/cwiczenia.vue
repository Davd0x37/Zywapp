<template>
  <div>
    <h1 class="motywacja">Motywacja: {{ motywacja }}</h1>
    <div class="mid">
      <div class="mid-left">
        <vue-form class="form" :state="formstate" @submit.prevent="onSubmit">
          <p>Znajdź ćwiczenie z naszej bazy danych</p>
          <b-form-input
            v-model="model.search"
            placeholder="Szukaj"
          ></b-form-input>
          <b-list-group class="znalezione_cwiczenia">
            <b-list-group-item
              v-for="act in model.activities"
              :key="act.title"
              @click="readActivity(act.about)"
              href="#"
              >{{ act.title }}</b-list-group-item
            >
          </b-list-group>
          <b-button type="submit" variant="success">Szukaj</b-button
          ><b-button variant="outline-primary" @click="add = !add"
            >Dodaj</b-button
          >
        </vue-form>
      </div>
      <div class="mid-right" v-if="!add">
        <div class="spalone_kalorie">
          <p>
            {{ activityToRead }}
          </p>
        </div>
      </div>
      <div class="mid-right" v-if="add">
        <div class="spalone_kalorie">
          <vue-form
            class="form"
            :state="formstate2"
            @submit.prevent="onSubmit2"
          >
            <validate tag="label">
              <span>Nazwa ćwiczenia</span>
              <input
                v-model="model.activity_name"
                name="name"
                type="text"
                required
              />
            </validate>
            <validate tag="label">
              <span>Opis ćwiczenia</span>
              <textarea
                v-model="model.activity_about"
                name="about"
                type="textarea"
                rows="3"
                max-rows="6"
              />
            </validate>
            <button type="submit">Submit</button>
          </vue-form>
        </div>
      </div>
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
      const about = this.loggedInUser.about
      return about ? about.why : ''
    }
  },
  data() {
    return {
      formstate: {},
      formstate2: {},
      add: false,
      activityToRead: 'Fajne ćwiczonka do ćwiczenia',
      model: {
        search: '',
        activities: [],
        activity_name: '',
        activity_about: ''
      }
    }
  },
  notifications: {
    showError: {
      title: 'Błąd szukania',
      message: 'Błędne dane!',
      type: 'error'
    }
  },
  methods: {
    readActivity(about) {
      this.activityToRead = about
    },
    async onSubmit() {
      if (this.formstate.$invalid) {
        this.showError()
        return
      }
      const { data } = await this.$axios.post('physical', {
        title: this.model.search
      })

      this.model.activities = data.activity
    },
    async onSubmit2() {
      if (this.formstate2.$invalid) {
        this.showError()
        return
      }
      await this.$axios.post('physical/add', {
        title: this.model.activity_name,
        about: this.model.activity_about
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
}

.cursor {
  cursor: pointer;
}

.motywacja {
  text-align: center;
}

.mid-left {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 600px;
  text-align: center;
  position: relative;
}

.mid-left img {
  width: 30px;
  position: absolute;
  left: 33%;
  top: 31%;
}

.mid-left > p {
  margin-top: 50px;
  margin-bottom: 30px;
  font-size: 20px;
}

.mid-left input {
  padding: 20px;
  width: 40%;
  margin: 0 auto;
  padding-left: 10%;
}

.znalezione_cwiczenia {
  background: white;
  height: 70%;
  width: 50%;
  text-align: left;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;
  opacity: 0.8;
}

.mid-right {
  background: white;
  opacity: 0.8;
  padding: 30px;
  height: 500px;
  width: 600px;
  display: flex;
  flex-direction: column;
}

.mid-right p {
  text-align: center;
  font-size: 30px;
}

.spalone_kalorie {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  word-break: break-all;
}

.spalone_kalorie label {
  margin-top: 30px;
  font-size: 20px;
}

.spalone_kalorie input {
  margin-top: 30px;
  width: 200px;
}

.spalone_kalorie > p {
  margin-top: 50px;
}

.spalone_kalorie span {
  color: green;
  font-weight: bold;
}

@media (max-width: 414px) {
  .mid {
    height: 110vh;
    flex-direction: column;
  }
  .mid-left {
    height: 300px;
  }
  .mid-right {
    height: 300px;
  }
  .mid-left img {
    top: 52%;
  }
  .znalezione_cwiczenia {
    margin: 0 auto;
    margin-top: 100px;
    opacity: 0.8;
  }
  .spalone_kalorie {
    margin-top: 30px;
  }
  .spalone_kalorie label {
    margin-top: 0px;
    font-size: 20px;
  }

  .spalone_kalorie input {
    margin-top: 10px;
    width: 200px;
  }

  .spalone_kalorie > p {
    margin-top: 20px;
  }
}
</style>
