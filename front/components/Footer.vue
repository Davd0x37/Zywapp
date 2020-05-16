<template>
  <footer>
    <div class="fot-left">Wszelkie prawa zastrzeżone</div>
    <div class="fot-mid">
      <a href=""><p>Kontakt</p></a>
      <a href=""><p>Regulamin</p></a>
      <a href=""><p>Kontakt</p></a>
    </div>
    <div class="fot-right">
      <a href=""><img src="~assets/img/Instagram-Icon.png" alt=""/></a>
      <a href=""
        ><img src="~assets/img/1024px-Facebook_icon.svg.png" alt=""
      /></a>
    </div>
  </footer>
</template>

<style lang="scss">
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  opacity: 0.4;
}

.fot-mid {
  display: flex;
}

.fot-mid p {
  margin: 30px;
}

.fot-mid p:hover {
  color: yellow;
}

.fot-right img {
  width: 50px;
  margin: 0 30px 0 30px;
}

.fot-right img:hover {
  background: red;
}

@media (max-width: 414px) {
  footer {
    position: absolute;
    top: 140%;
    display: block;
    width: 530px;
    text-align: center;
  }
  .fot-mid p {
    display: inline-block;
    margin-left: 80px;
    text-align: center;
  }
}
</style>
