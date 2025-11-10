import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
config.autoAddCss = false

// Import the icons you use
import {
  faUser,
  faLock,
  faBars,
  faTrash,
  faEdit,
  faXmark, 
  faBox,
  faUsers,
  faCartShopping,
  faRightFromBracket,
  faTrashCan,
  faPlus,
  faPenToSquare,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser, 
    faLock, 
    faBars, 
    faTrash, 
    faEdit, 
    faXmark, 
    faBox,
    faUsers,
    faCartShopping,
    faRightFromBracket,
    faTrashCan,
    faPlus,
    faPenToSquare,
    faEye,
    faEyeSlash,
    ) // 👈 ADD HERE

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
