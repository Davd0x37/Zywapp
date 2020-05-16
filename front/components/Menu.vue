<template>
  <nav role="navigation">
    <div id="menuToggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>
      <ul id="menu">
        <nuxt-link to="/"> <li>aZywieniowa</li></nuxt-link>
        <nuxt-link to="/jedzenie"> <li>Jedzenie</li></nuxt-link>
        <nuxt-link to="/kalorie"> <li>Kalorie</li></nuxt-link>
        <nuxt-link to="/progres"> <li>Progres</li></nuxt-link>
        <nuxt-link to="/przypomnienia"> <li>Przypomnienia</li></nuxt-link>
        <nuxt-link to="/cwiczenia"> <li>Ćwiczenia</li></nuxt-link>
        <nuxt-link to="/wyzwania"> <li>Wyzwania</li></nuxt-link>
        <nuxt-link to="/premium"
          ><li>
            <img
              class="letterP"
              src="~assets/img/Bina-Effect-Letters-alphabet-red-16.png"
              alt=""
            /></li
        ></nuxt-link>
      </ul>
    </div>
  </nav>
</template>
<style lang="scss">
#menuToggle {
  display: flex;
  justify-content: center;
  height: 60px;
  background: #16222a; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #3a6073,
    #16222a
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #3a6073,
    #16222a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#menuToggle input {
  display: none;
}

#menu {
  display: flex;
}

#menu li {
  padding: 20px;
  height: 100%;
  /* background: orange; */
  width: 187.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transition: font-weight 0.3 ease;
  transition: background-color 0.5 ease;
}

.letterP {
  max-width: 40px;
}

#menu li:hover {
  background-color: rgb(10, 226, 255);
  font-weight: bold;
}

@media (max-width: 414px) {
  #menuToggle {
    display: block;
    position: absolute;
    top: 21%;
    left: 12%;
    z-index: 1;
    user-select: none;
    background: none;
  }
  #menuToggle ul {
    display: block;
  }
  #menuToggle a {
    text-decoration: none;
    color: #232323;

    transition: color 0.3s ease;
  }

  #menuToggle a:hover {
    color: tomato;
  }
  #menuToggle input {
    display: block;
    width: 40px;
    height: 32px;
    position: absolute;
    top: -7px;
    left: -5px;

    cursor: pointer;

    opacity: 0; /* hide this */
    z-index: 2; /* and place it over the hamburger */

    -webkit-touch-callout: none;
  }
  #menuToggle span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;

    background: black;
    border-radius: 3px;

    z-index: 1;

    transform-origin: 4px 0px;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
  }
  #menuToggle span:first-child {
    transform-origin: 0% 0%;
  }

  #menuToggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
  }
  #menuToggle input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(-2px, -1px);
    background: #232323;
  }
  #menuToggle input:checked ~ span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }
  #menuToggle input:checked ~ span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
  }
  #menu {
    position: absolute;
    width: 300px;
    margin: -235px 0 0 -50px;
    padding: 50px;
    padding-top: 40px;
    border-radius: 10px;

    background: #ededed;
    list-style-type: none;
    -webkit-font-smoothing: antialiased;
    /* to stop flickering of text in safari */

    transform-origin: 0% 0%;
    transform: translate(-100%, 0);

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }
  #menu li {
    padding: 10px 0;
    font-size: 22px;
  }
  #menuToggle input:checked ~ ul {
    transform: none;
  }
}
</style>
