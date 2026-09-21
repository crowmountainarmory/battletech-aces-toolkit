import type { Uuid } from './deck'

export type CardType = 'movement' | 'combat' | 'commander'
export type MovementProfile = 'aggressive' | 'balanced' | 'cautious'
export type RuleFilterType = 'movement' | 'combat'
export type CombatRuleFilterGroup = 'target'
export type CommanderModeRuleFilterGroup =
  | 'red-target'
  | 'yellow-target'
  | 'blue-target'
  | 'emplacement-target'
  | 'artillery-target'
  | 'bsp-card-target'

export interface BaseCardDto {
  id: Uuid
  type: CardType
  createdAt: string
  updatedAt: string
}

export interface MovementCardDto extends BaseCardDto {
  type: 'movement'
  unitRole: string
  defaultOrderNumber: number
}

export interface CombatCardDto extends BaseCardDto {
  type: 'combat'
  role: string
  overheat: string
  defaultOrderNumber: number | null
}

export interface CommanderCardDto extends BaseCardDto {
  type: 'commander'
  name: string
  faction: string
}

export interface CommanderModeDto {
  id: Uuid
  commanderCardId: Uuid
  mode: string
  orders: string[]
  redTargetFilters: string[]
  yellowTargetFilters: string[]
  blueTargetFilters: string[]
  supportOrders: string[]
  emplacementTargetFilters: string[]
  artilleryTargetFilters: string[]
  bspCardTargetFilters: string[]
  strategyDecisions: string[]
  createdAt: string
  updatedAt: string
}

export interface RuleFilterDto {
  id: Uuid
  type: RuleFilterType
  key: string
  label: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type MovementActionType = 'G' | 'J' | 'S' | 'H'

// A movement card has 1-4 ordered MovementFilterDto entries (sortOrder), each scoped to a profile.
export interface MovementFilterDto {
  id: Uuid
  movementCardId: Uuid
  profile: MovementProfile
  label: string
  condition: string | null
  movementType: MovementActionType
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// Ordered actions for a MovementFilterDto, applied after the filter's movement type.
export interface MovementFilterActionDto {
  id: Uuid
  movementFilterId: Uuid
  ruleFilterId: Uuid // references a 'movement' RuleFilterDto
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CombatCardRuleFilterLinkDto {
  id: Uuid
  combatCardId: Uuid
  ruleFilterId: Uuid
  filterGroup: CombatRuleFilterGroup
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CommanderModeRuleFilterLinkDto {
  id: Uuid
  commanderModeId: Uuid
  ruleFilterId: Uuid
  filterGroup: CommanderModeRuleFilterGroup
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CardDto = MovementCardDto | CombatCardDto | CommanderCardDto
