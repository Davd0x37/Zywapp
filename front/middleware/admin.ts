export default function({ store, redirect }: any) {
  if (store.state.auth.loggedIn) {
    if (!store.state.auth.user.isAdmin) {
      return redirect('/')
    }
  } else {
    return redirect('/login')
  }
}
