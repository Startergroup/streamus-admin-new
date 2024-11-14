import { createStore } from 'vuex'

import auth from './modules/auth.module'
import codes from './modules/codes.module'
import settings from './modules/settings.module'
import tabs from './modules/tabs.module'
import votes from './modules/votes.module'

export default createStore({
  modules: {
    auth,
    codes,
    settings,
    tabs,
    votes
  }
})
