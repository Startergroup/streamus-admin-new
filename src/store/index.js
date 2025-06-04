import { createStore } from 'vuex'

import analytics from './modules/analytics.module'
import auth from './modules/auth.module'
import chats from './modules/chats.module'
import codes from './modules/codes.module'
import common from './modules/common.module'
import quiz from './modules/quiz.module'
import settings from './modules/settings.module'
import schedule from './modules/schedule.module'
import tabs from './modules/tabs.module'

export default createStore({
  modules: {
    analytics,
    auth,
    chats,
    codes,
    common,
    quiz,
    schedule,
    settings,
    tabs
  }
})
