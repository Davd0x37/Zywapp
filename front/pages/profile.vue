<template>
  <div class="mid">
    <div class="mid-left">
      <p>Twoje parametry:</p>
      <vue-form class="form" :state="formstate" @submit.prevent="onSubmit">
        <b-container>
          <validate tag="label">
            <b-row class="my-1">
              <b-col sm="3">
                <label for="pas">Pas :</label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="pas"
                  type="number"
                  v-model="model.pas"
                ></b-form-input>
              </b-col>
            </b-row>
          </validate>
          <validate tag="label">
            <b-row class="my-1">
              <b-col sm="3">
                <label for="biodra">Biodra: </label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="biodra"
                  type="number"
                  v-model="model.biodra"
                ></b-form-input>
              </b-col>
            </b-row>
          </validate>
          <validate tag="label">
            <b-row class="my-1">
              <b-col sm="3">
                <label for="udo">Udo: </label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="udo"
                  type="number"
                  v-model="model.udo"
                ></b-form-input>
              </b-col>
            </b-row>
          </validate>
          <validate tag="label">
            <b-row class="my-1">
              <b-col sm="3">
                <label for="biceps">Biceps: </label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="biceps"
                  type="number"
                  v-model="model.biceps"
                ></b-form-input>
              </b-col>
            </b-row>
          </validate>
          <validate tag="label">
            <b-row class="my-1">
              <b-col sm="3">
                <label for="godzina">Godzina przypomnień: </label>
              </b-col>
              <b-col sm="9">
                <b-form-input
                  id="godzina"
                  type="time"
                  v-model="model.godzina"
                ></b-form-input>
              </b-col>
            </b-row>
          </validate>
        </b-container>
        <button type="submit">Zapisz</button>
      </vue-form>
    </div>
    <div class="mid-right">
      <vue-form class="form" :state="formstate2" @submit.prevent="onSubmit2">
        <validate tag="label">
          <b-row class="my-1">
            <b-col sm="3">
              <label for="about">O mnie:</label>
            </b-col>
            <b-col sm="9">
              <b-form-textarea
                rows="3"
                max-rows="6"
                placeholder="Coś o mnie"
                id="about"
                type="textarea"
                v-model="model.about"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </validate>
        <validate tag="label">
          <b-row class="my-1">
            <b-col sm="3">
              <label for="why">Dlaczego chce schudnąć (Ćwiczenia)</label>
            </b-col>
            <b-col sm="9">
              <b-form-textarea
                rows="3"
                max-rows="6"
                placeholder="Coś o mnie"
                id="why"
                type="textarea"
                v-model="model.why"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </validate>
        <validate tag="label">
          <b-row class="my-1">
            <b-col sm="3">
              <label for="inspiration">Moje inspiracje (Wyzwania)</label>
            </b-col>
            <b-col sm="9">
              <b-form-textarea
                rows="3"
                max-rows="6"
                placeholder="Coś o mnie"
                id="inspiration"
                type="textarea"
                v-model="model.inspiration"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </validate>
        <button type="submit">Zapisz</button>
      </vue-form>
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
  data() {
    return {
      formstate: {},
      formstate2: {},
      model: {
        pas: 0,
        biodra: 0,
        udo: 0,
        biceps: 0,
        about: '',
        why: '',
        inspiration: '',
        godzina: ''
      }
    }
  },
  async mounted() {
    const {
      data: {
        data: { parameters, about }
      }
    } = await this.$axios.get('me')

    const params = parameters
    if (params) {
      this.model.pas = params.pas || this.model.pas
      this.model.biodra = params.biodra || this.model.biodra
      this.model.udo = params.udo || this.model.udo
      this.model.biceps = params.biceps || this.model.biceps
      this.model.godzina = params.godzina || this.model.godzina
    }

    const ab = about
    if (ab) {
      this.model.about = ab.about || this.model.about
      this.model.why = ab.why || this.model.why
      this.model.inspiration = ab.inspiration || this.model.inspiration
    }
  },
  methods: {
    async onSubmit() {
      if (this.formstate.$invalid) {
        // alert user and exit early
        console.log('Invalid form!!')
        return
      }
      await this.$axios.post('me/update', {
        parameters: {
          pas: this.model.pas,
          biodra: this.model.biodra,
          udo: this.model.udo,
          biceps: this.model.biceps,
          godzina: this.model.godzina
        }
      })
    },
    async onSubmit2() {
      if (this.formstate.$invalid) {
        // alert user and exit early
        console.log('Invalid form!!')
        return
      }
      await this.$axios.post('me/update', {
        about: {
          about: this.model.about,
          why: this.model.why,
          inspiration: this.model.inspiration
        }
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

.mid-left {
  background: white;
  opacity: 0.8;
  padding: 30px;
  height: 500px;
  width: 600px;
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  flex-direction: column;
}

form input {
  width: 300px;
  margin-left: 30px;
}

.mid-left p {
  text-align: center;
  font-size: 30px;
}

.mid-left label {
  margin-top: 20px;
}

.mid-left input {
  padding: 5px;
}

.mid-left button {
  width: 100px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 30px;
  border: none;
  background: black;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
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

.title {
  text-align: center;
  font-size: 25px;
}

.opis {
  text-align: center;
  font-size: 16px;
}

.mid-right label {
  margin-top: 20px;
}

.mid-right input {
  padding: 5px;
}

.mid-right button {
  width: 100px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 30px;
  border: none;
  background: black;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.mid-right {
  position: relative;
}

.mid-right input {
  /* position: absolute; */
  width: 30px;
  height: 30px;
  margin-left: 255px;
}

@media (max-width: 414px) {
  .mid {
    height: 110vh;
    flex-direction: column;
  }
  .mid-left label {
    margin-left: 20px;
  }
  .mid-left input {
    margin-left: 20px;
  }
}
</style>
