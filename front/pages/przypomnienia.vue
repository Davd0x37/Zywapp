<template>
  <div class="mid">
    <div class="mid-mid">
      <vue-form class="form" :state="formstate" @submit.prevent="onSubmit">
        <b-form-checkbox
          id="checkbox-1"
          v-model="model.fluids"
          name="checkbox-1"
        >
          Powiadomienie o spożywaniu płynów
        </b-form-checkbox>
        <b-form-checkbox
          id="checkbox-2"
          v-model="model.microIngredients"
          name="checkbox-2"
        >
          Powiadomienie o odpowiednim przyjmowaniu makro/mikro składników
        </b-form-checkbox>
        <b-form-checkbox
          id="checkbox-3"
          v-model="model.hours"
          name="checkbox-3"
        >
          Powiadomienie o określonych godzinach
        </b-form-checkbox>
        <b-form-checkbox
          id="checkbox-4"
          v-model="model.challenges"
          name="checkbox-4"
        >
          Powiadomienie o codziennych wyzwaniach
        </b-form-checkbox>
        <b-form-checkbox
          id="checkbox-5"
          v-model="model.exercises"
          name="checkbox-5"
        >
          Powiadomienie o ćwiczeniach
        </b-form-checkbox>

        <button type="submit">Zapisz</button>
      </vue-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'premium',
  data() {
    return {
      formstate: {},
      model: {
        fluids: false,
        microIngredients: false,
        hours: false,
        challenges: false,
        exercises: false
      }
    }
  },
  async mounted() {
    const { data } = await this.$axios.get('me/get_reminders')
    this.model.fluids = data.fluids ?? this.loggedInUser.reminders.fluids
    this.model.microIngredients =
      data.microIngredients ?? this.loggedInUser.reminders.microIngredients
    this.model.hours = data.hours ?? this.loggedInUser.reminders.hours
    this.model.challenges =
      data.challenges ?? this.loggedInUser.reminders.challenges
    this.model.exercises =
      data.exercises ?? this.loggedInUser.reminders.exercises
  },
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
    async onSubmit() {
      if (this.formstate.$invalid) {
        this.showError()
        return
      }
      await this.$axios.post('reminders', this.model)
    }
  }
}
</script>

<style lang="scss" scoped>
.mid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
  width: 100%;
}

.mid-mid {
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0.8;
  width: 500px;
  height: 500px;
  border: none;
}

.mid-mid label {
  margin-bottom: 20px;
}

.mid-mid input {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-bottom: 20px;
}

.mid-mid button {
  border: none;
  padding: 10px;
  background: rgb(7, 184, 243);
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 414px) {
  .mid {
    height: 90vh;
  }
  .mid-mid {
    padding: 30px;
    height: 700px;
  }
}
</style>
