import type { CreateDeckDto, DeckDto, DeckSummaryDto } from '../dto/deck'
import { openToolkitDatabase, objectStoreNames } from '../database'

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function normalizeDeckName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function sortDecksByLastUsed(left: DeckSummaryDto, right: DeckSummaryDto): number {
  return (
    new Date(right.lastUsedAt).getTime() - new Date(left.lastUsedAt).getTime() ||
    new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime() ||
    left.name.localeCompare(right.name)
  )
}

export async function listDecks(): Promise<DeckSummaryDto[]> {
  const database = await openToolkitDatabase()

  try {
    const transaction = database.transaction(objectStoreNames.decks, 'readonly')
    const store = transaction.objectStore(objectStoreNames.decks)
    const decks = await requestToPromise(store.getAll() as IDBRequest<DeckDto[]>)

    return decks.sort(sortDecksByLastUsed)
  } finally {
    database.close()
  }
}

export async function createDeck(input: CreateDeckDto): Promise<DeckDto> {
  const name = normalizeDeckName(input.name)

  if (!name) {
    throw new Error('Deck name is required.')
  }

  const now = new Date().toISOString()
  const deck: DeckDto = {
    id: crypto.randomUUID(),
    name,
    commanderCardId: input.commanderCardId ?? null,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: now,
  }

  const database = await openToolkitDatabase()

  try {
    const transaction = database.transaction(objectStoreNames.decks, 'readwrite')
    const store = transaction.objectStore(objectStoreNames.decks)

    await requestToPromise(store.add(deck))

    return deck
  } finally {
    database.close()
  }
}

export async function openDeck(id: string): Promise<DeckDto | null> {
  const database = await openToolkitDatabase()

  try {
    const transaction = database.transaction(objectStoreNames.decks, 'readwrite')
    const store = transaction.objectStore(objectStoreNames.decks)
    const deck = await requestToPromise(store.get(id) as IDBRequest<DeckDto | undefined>)

    if (!deck) {
      return null
    }

    const openedDeck: DeckDto = {
      ...deck,
      lastUsedAt: new Date().toISOString(),
    }

    await requestToPromise(store.put(openedDeck))

    return openedDeck
  } finally {
    database.close()
  }
}
