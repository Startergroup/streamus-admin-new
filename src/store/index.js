import { createStore } from 'vuex'

import auth from './modules/auth.module'
import codes from './modules/codes.module'
import settings from './modules/settings.module'
import schedule from './modules/schedule.module'
import tabs from './modules/tabs.module'

export default createStore({
  modules: {
    auth,
    codes,
    schedule,
    settings,
    tabs
  }
})
