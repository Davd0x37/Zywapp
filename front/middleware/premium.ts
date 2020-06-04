export default function({ store, redirect }: any) {
  if (store.state.auth.loggedIn) {
    if (store.state.auth.user.accountType !== 'premium') {
      return redirect('/dostep_dla_premium')
    }
  } else {
    return redirect('/login')
  }
}
