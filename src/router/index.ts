import { createRouter, createWebHistory } from 'vue-router'

import DeckDetailPage from '../ui/pages/DeckDetailPage.vue'
import DeckLandingPage from '../ui/pages/DeckLandingPage.vue'
import NewDeckPage from '../ui/pages/NewDeckPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'deck-landing',
      component: DeckLandingPage,
    },
    {
      path: '/deck/new',
      name: 'deck-new',
      component: NewDeckPage,
    },
    {
      path: '/deck/:id',
      name: 'deck-detail',
      component: DeckDetailPage,
    },
  ],
})
