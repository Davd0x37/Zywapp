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
  daily(state: any) {
    state.daily = !state.daily
  },
  updateUser(state: any, payload: any) {
    state.auth.user = {
      ...state.auth.user,
      ...payload
    }
  }
}

export const getters = {
  isAuthenticated(state: any) {
    return state.auth.loggedIn
  },

  loggedInUser(state: any) {
    return state.auth.user
  }
}
