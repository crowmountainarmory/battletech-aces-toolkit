export type Uuid = string

export interface DeckDto {
  id: Uuid
  name: string
  commanderCardId: Uuid | null
  createdAt: string
  updatedAt: string
  lastUsedAt: string
}

export interface DeckSummaryDto {
  id: Uuid
  name: string
  commanderCardId: Uuid | null
  updatedAt: string
  lastUsedAt: string
}

export interface CreateDeckDto {
  name: string
  commanderCardId?: Uuid | null
}

export interface UpdateDeckDto {
  id: Uuid
  name: string
  commanderCardId?: Uuid | null
}

export interface DeckMovementCombatPairDto {
  id: Uuid
  deckId: Uuid
  movementCardId: Uuid
  combatCardId: Uuid
  movementOrderNumber: number
  combatOrderNumber: number
  createdAt: string
  updatedAt: string
}
