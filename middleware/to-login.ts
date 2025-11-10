export default defineNuxtRouteMiddleware((to, from) => {
  // Kalau user belum login, arahkan ke login page
  console.log('middleware to login');
  
  return navigateTo('/login')
  // const isLoggedIn = useState('token').value !== null
  // if (!isLoggedIn && to.path !== '/login') {
  //   return navigateTo('/login')
  // }
})
