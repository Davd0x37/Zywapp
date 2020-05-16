<template>
  <div class="mid">
    <h1>Dostępne tylko w wersji premium</h1>
  </div>
</template>

<style lang="scss" scoped>
.mid {
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 70vh;
  width: 100%;
  font-size: 40px;
}

@media (max-width: 414px) {
  .mid {
    height: 110vh;
  }
}
</style>
