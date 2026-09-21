import type { RuleFilterDto, RuleFilterType } from '../dto/card'

export type RuleFilterSeed = {
  type: RuleFilterType
  key: string
  label: string
  description: string | null
}

export const defaultRuleFilterSeeds: RuleFilterSeed[] = [
  { type: 'combat', key: 'lowest-tmm', label: 'Lowest TMM', description: null },
  { type: 'combat', key: 'highest-tmm', label: 'Highest TMM', description: null },
  { type: 'combat', key: 'lowest-armor', label: 'Lowest Armor', description: null },
  { type: 'combat', key: 'highest-armor', label: 'Highest Armor', description: null },
  { type: 'combat', key: 'lowest-armor-lost', label: 'Lowest Armor Lost', description: null },
  { type: 'combat', key: 'highest-armor-lost', label: 'Highest Armor Lost', description: null },
  { type: 'combat', key: 'lowest-structure', label: 'Lowest Structure', description: null },
  { type: 'combat', key: 'highest-structure', label: 'Highest Structure', description: null },
  { type: 'combat', key: 'lowest-pv', label: 'Lowest PV', description: null },
  { type: 'combat', key: 'highest-pv', label: 'Highest PV', description: null },
  { type: 'combat', key: 'highest-l-damage', label: 'Highest L Damage', description: null },
  { type: 'combat', key: 'highest-m-damage', label: 'Highest M Damage', description: null },
  { type: 'combat', key: 'highest-s-damage', label: 'Highest S Damage', description: null },
  { type: 'combat', key: 'lowest-l-damage', label: 'Lowest L Damage', description: null },
  { type: 'combat', key: 'lowest-m-damage', label: 'Lowest M Damage', description: null },
  { type: 'combat', key: 'lowest-s-damage', label: 'Lowest S Damage', description: null },
  { type: 'combat', key: 'objective', label: 'Objective', description: null },
  { type: 'combat', key: 'yellow-command-list', label: 'Yellow Command List', description: null },
  { type: 'combat', key: 'red-command-list', label: 'Red Command List', description: null },
  { type: 'combat', key: 'blue-command-list', label: 'Blue Command List', description: null },
  { type: 'combat', key: "hit-target's-rear", label: "Hit Target's Rear", description: null },
]

export function toRuleFilterRecord(seed: RuleFilterSeed): RuleFilterDto {
  const timestamp = new Date().toISOString()

  return {
    id: stableRuleFilterId(seed.type, seed.key),
    type: seed.type,
    key: seed.key,
    label: seed.label,
    description: seed.description,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function stableRuleFilterId(type: RuleFilterType, key: string): string {
  const input = `${type}:${key}`
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index)
    hash ^= code
    hash = Math.imul(hash, 16777619)
  }

  const unsigned = hash >>> 0
  return `rf-${unsigned.toString(16).padStart(8, '0')}`
}
