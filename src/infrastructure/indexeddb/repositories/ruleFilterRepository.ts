import type { RuleFilterDto, RuleFilterType } from '../dto/card'
import { openToolkitDatabase, objectStoreNames } from '../database'

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

export async function listAllRuleFilters(): Promise<RuleFilterDto[]> {
  const database = await openToolkitDatabase()

  try {
    const transaction = database.transaction(objectStoreNames.ruleFilters, 'readonly')
    const store = transaction.objectStore(objectStoreNames.ruleFilters)
    const filters = await requestToPromise(store.getAll() as IDBRequest<RuleFilterDto[]>)

    return filters
  } finally {
    database.close()
  }
}

export async function listRuleFiltersByType(type: RuleFilterType): Promise<RuleFilterDto[]> {
  const database = await openToolkitDatabase()

  try {
    const transaction = database.transaction(objectStoreNames.ruleFilters, 'readonly')
    const store = transaction.objectStore(objectStoreNames.ruleFilters)
    const index = store.index('type')
    const filters = await requestToPromise(index.getAll(type) as IDBRequest<RuleFilterDto[]>)

    return filters
  } finally {
    database.close()
  }
}
