<template>
  <div class="mid">
    <vue-form class="search dir" :state="formstate" @submit.prevent="onSubmit">
      <h2>Rejestracja</h2>
      <validate tag="label">
        <span>Login</span>
        <input v-model="login" name="login" type="text" required />

        <field-messages name="login">
          <div slot="required">Musisz podać login</div>
        </field-messages>
      </validate>
      <validate tag="label">
        <span>Email</span>
        <input v-model="email" name="email" type="email" required />

        <field-messages name="email">
          <div slot="required">Musisz podać email</div>
          <div slot="email">Email is not valid</div>
        </field-messages>
      </validate>
      <validate tag="label">
        <span>Hasło</span>
        <input v-model="password" name="password" type="password" required />

        <field-messages name="password">
          <div slot="required">Musisz podać hasło</div>
        </field-messages>
      </validate>

      <div class="buttons">
        <button type="submit">Zarejestruj</button>
      </div>
    </vue-form>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data() {
    return {
      login: '',
      email: '',
      password: '',
      formstate: {}
    }
  },
  notifications: {
    showError: {
      title: 'Błąd rejestracji',
      message: 'Błędne dane!',
      type: 'error'
    }
  },

  methods: {
    async onSubmit() {
      try {
        if (this.formstate.$invalid) {
          this.showError()
          return
        }
        await this.$axios.post('register', {
          login: this.login,
          email: this.email,
          password: this.password
        })

        await this.$auth.loginWith('local', {
          data: {
            login: this.login,
            password: this.password
          }
        })

        this.$router.push('/')
      } catch (e) {
        this.showError()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mid {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mid h2 {
  text-align: center;
}

.mid form {
  background: white;
  opacity: 0.9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.mid form input {
  padding: 20px;
}

.mid form label {
  margin-top: 30px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
}

.buttons button {
  padding: 10px;
  border: 0;
}

.buttons button {
  background: rgb(96, 255, 22);
}
</style>
