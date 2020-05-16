export const state = () => ({
  auth: {
    loggedIn: false,
    user: {
      login: '',
      registerDate: '',
      accountType: '',
      about: '',
      parameters: '',
      limitCal: 0,
      limitCarbo: 0,
      limitFat: 0,
      limitProtein: 0,
      daily: true,
      isAdmin: false
    }
  }
})

export const mutations = {
  daily(state) {
    state.daily = !state.daily
  },
  updateUser(state, payload) {
    state.auth.user = {
      ...state.auth.user,
      ...payload
    }
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  }
}
