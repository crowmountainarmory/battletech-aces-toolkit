import { defaultRuleFilterSeeds, toRuleFilterRecord } from './seeds/ruleFilters'

const DATABASE_NAME = 'battletech-aces-toolkit'
const DATABASE_VERSION = 3

export const objectStoreNames = {
  decks: 'decks',
  deckCardLinks: 'deckCardLinks',
  ruleFilters: 'ruleFilters',
  movementFilters: 'movementFilters',
  movementFilterActions: 'movementFilterActions',
  metadata: 'metadata',
} as const

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

export async function openToolkitDatabase(): Promise<IDBDatabase> {
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

  request.onupgradeneeded = () => {
    const database = request.result
    const transaction = request.transaction

    if (!database.objectStoreNames.contains(objectStoreNames.decks)) {
      const deckStore = database.createObjectStore(objectStoreNames.decks, {
        keyPath: 'id',
      })

      deckStore.createIndex('name', 'name', { unique: false })
      deckStore.createIndex('updatedAt', 'updatedAt', { unique: false })
      deckStore.createIndex('lastUsedAt', 'lastUsedAt', { unique: false })
    }

    if (!database.objectStoreNames.contains(objectStoreNames.deckCardLinks)) {
      const deckCardLinkStore = database.createObjectStore(objectStoreNames.deckCardLinks, {
        keyPath: 'id',
      })

      deckCardLinkStore.createIndex('deckId', 'deckId', { unique: false })
      deckCardLinkStore.createIndex('cardId', 'cardId', { unique: false })
      deckCardLinkStore.createIndex('deckId_sortOrder', ['deckId', 'sortOrder'], {
        unique: true,
      })
    }

    if (!database.objectStoreNames.contains(objectStoreNames.ruleFilters)) {
      const ruleFilterStore = database.createObjectStore(objectStoreNames.ruleFilters, {
        keyPath: 'id',
      })

      ruleFilterStore.createIndex('type', 'type', { unique: false })
      ruleFilterStore.createIndex('key', 'key', { unique: true })
      ruleFilterStore.createIndex('label', 'label', { unique: false })
    }

    if (!database.objectStoreNames.contains(objectStoreNames.movementFilters)) {
      const movementFilterStore = database.createObjectStore(objectStoreNames.movementFilters, {
        keyPath: 'id',
      })

      movementFilterStore.createIndex('movementCardId', 'movementCardId', { unique: false })
      movementFilterStore.createIndex(
        'movementCardId_profile_sortOrder',
        ['movementCardId', 'profile', 'sortOrder'],
        { unique: true },
      )
    }

    if (!database.objectStoreNames.contains(objectStoreNames.movementFilterActions)) {
      const movementFilterActionStore = database.createObjectStore(
        objectStoreNames.movementFilterActions,
        { keyPath: 'id' },
      )

      movementFilterActionStore.createIndex('movementFilterId', 'movementFilterId', {
        unique: false,
      })
      movementFilterActionStore.createIndex(
        'movementFilterId_sortOrder',
        ['movementFilterId', 'sortOrder'],
        { unique: true },
      )
    }

    if (!database.objectStoreNames.contains(objectStoreNames.metadata)) {
      database.createObjectStore(objectStoreNames.metadata, { keyPath: 'key' })
    }

    if (transaction) {
      const ruleFilterStore = transaction.objectStore(objectStoreNames.ruleFilters)

      for (const seed of defaultRuleFilterSeeds) {
        const record = toRuleFilterRecord(seed)
        ruleFilterStore.put(record)
      }
    }
  }

  return requestToPromise(request)
}
