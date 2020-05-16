<template>
  <div class="mid">
    <div class="mid-left">
      <h2>Oblicz dziennie zapotrzebowanie na <span>kalorie</span></h2>
      <div class="form">
        <label for="plec">Płeć:</label>
        <select id="plec" v-model="plec">
          <option value="kobieta">Kobieta</option>
          <option value="mezczyzna">Mężczyżna</option>
        </select>
        <label for="wiek">Wiek: </label>
        <input type="number" name="wiek" v-model="wiek" />
        <label for="waga">Waga: (kg)</label>
        <input type="number" name="waga" v-model="waga" />
        <label for="wzrost">Wzrost: (cm)</label>
        <input type="number" name="wzrost" v-model="wzrost" />
      </div>

      <div class="wynik"><h1>{{ wynik }} kcal</h1></div>
    </div>
    <div class="mid-right">
      <img src="~assets/img/gym-life-3449526_960_720.webp" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      plec: '',
      wiek: 0,
      waga: 0,
      wzrost: 0
    }
  },
  computed: {
    wynik() {
      // mezczyzni 66 + [13,7 x masa ciała (kg)] + [5 x wzrost (cm)] - [6,76 x wiek (lata)]
      // kobiety 655 + [9,6 x masa ciała (kg)] + [1,8 x wzrost (cm)] - [4,7 x wiek (lata)]
      switch (this.plec) {
        case 'kobieta': {
          return 655 + 9.6 * this.waga + 1.8 * this.wzrost - 4.7 * this.wiek
        }
        case 'mezczyzna': {
          return 66 + 13.7 * this.waga + 5 * this.wzrost - 6.76 * this.wiek
        }
        default: {
          return 0
        }
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
}

.wynik {
  text-align: center;
  padding: 40px;
}

.mid-left {
  background: lightgrey;
  padding: 20px;
  height: 600px;
}

.mid-left h2 {
  text-align: center;
}

.mid-left span {
  color: red;
}

.mid-left .form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.mid-left label {
  font-size: 20px;
}

.mid-left .form input,
.mid-left .form select {
  padding: 5px;
}

.btn {
  width: 100px;
  padding: 20px;
  margin: 0 auto;
  margin-top: 50px;
  border: 0;
  background: rgb(47, 255, 245);
}

.mid-right img {
  width: 300px;
}

.mid-left label {
  margin-top: 20px;
}

@media (max-width: 414px) {
  .mid {
    height: 110vh;
    flex-direction: column;
  }
  .mid-right img {
    width: 250px;
  }
}
</style>
