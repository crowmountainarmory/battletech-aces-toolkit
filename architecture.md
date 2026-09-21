# architecture.md

## 1. System Goal
Build a Vue 3 + Vite PWA for BattleTech Alpha Strike Aces card workflows:
- Browse and manage rule cards and decks.
- Author custom cards with custom abilities/rules.
- Persist all user data locally with IndexedDB.
- Evaluate rule interactions through a deterministic rules engine.
- Prepare clean integration boundaries for future live simulations (e.g., MekBay).

---

## 2. Architectural Style
Layered, domain-centered architecture with explicit boundaries:

1. **UI Layer (Atomic Design)**
2. **Application Layer (orchestration/use cases)**
3. **Domain Layer (entities + rules model)**
4. **Infrastructure Layer (IndexedDB + external adapters)**

This keeps rendering concerns, business logic, and persistence/integration details independent and reusable.

---

## 3. UI Architecture (Atomic Design)

### Atoms
Reusable primitives such as labels, inputs, chips, tags, icon buttons.

### Molecules
Small composites such as card stat rows, rule snippet blocks, filter controls.

### Organisms
Feature sections such as card list panels, deck editor panels, rule dependency viewers.

### Templates
Screen structures for card browser and card creator.

### Pages
Route-level assembly and data wiring only.

**Rule:** put data fetching/orchestration in composables/application services, not in leaf components.
**Rule:** Enforce tailwind css styles wherever possible and eschew custom classes.

---

## 4. Vue Computed Best Practices (Required)
Follow Vue guidance for computed properties:
- Use computed for **derived state** only.
- Keep computed getters **pure** (no mutation, no persistence writes, no async side effects).
- Prefer composing small computed values over one monolithic computed block.
- Use methods instead of computed when caching is not needed.
- Keep source state minimal; expose rich derived view models from computed selectors in composables.

Applied to this app:
- Deck summaries, effective rule stacks, validation badges, and filtered/sorted card lists should be computed-derived.
- Rules engine execution should occur in explicit actions/use cases, not inside computed getters.

---

## 5. Domain Model (Initial)

### Core Entities
- **Movement Card**: UUID identity, unit role, and a default order number. Each has 1-4 ordered Movement Filters, grouped by aggressive/balanced/cautious profile.
- **Movement Filter**: a labeled filter belonging to one Movement Card and profile, with an optional single condition string, a movement type (`G` Ground, `J` Jump, `S` Sprint, `H` Standstill), and an ordered list of Movement Filter Actions.
- **Movement Filter Action**: an ordered action within a Movement Filter, applied after the filter's movement type. Each action references a `movement`-typed Rule Filter.
- **Combat Card**: UUID identity, role, overheat, and a default order number. Its target behavior is an ordered Rule Filter list.
- **Commander Card**: UUID identity, commander name, faction, and one or more commander modes.
- **Commander Mode**: per-commander configuration identified by a single-character mode (such as `A`, `B`, `C`) plus orders, ordered Rule Filter target groups, support orders, and strategy decisions.
- **Deck**: UUID identity, name, a single assigned commander, timestamps, and recent-use metadata.
- **Rule Filter**: a preset rule reference with a stable UUID/key and a `movement` or `combat` type, reusable across many cards and modes.
- **Rule**: trigger, conditions, effects, priority, dependencies, scope.
- **Simulation Profile** (future): external mapping and run configuration.

### Value Objects
- RuleCondition, RuleEffect, RulePriority, CardReference, DeckConstraint, EvaluationContext.

### Relationship Rules
- All persisted primary identifiers use UUIDs.
- Movement, Combat, and Commander are distinct card types with separate DTOs and storage concerns.
- Deck and Card use a **many-to-many** relationship, but deck composition is specialized by card type.
- Each Deck has exactly one Commander Card reference.
- Each Commander Card can contain many Commander Modes.
- Movement Filters belong to exactly one Movement Card and are grouped/ordered by profile (aggressive/balanced/cautious), with up to 4 filters per card.
- Movement Filter Actions belong to exactly one Movement Filter and are ordered many-to-many references to `movement`-typed Rule Filters.
- Combat card target entries are ordered many-to-many references to Rule Filters.
- Commander mode red/yellow/blue/emplacement/artillery/BSP target entries are ordered many-to-many references to Rule Filters.
- Movement profile links may only reference `movement` Rule Filters.
- Combat card and commander target-group links may only reference `combat` Rule Filters.
- Each Deck has many Movement/Combat pairs.
- Inside a Deck, Movement and Combat cards are associated in a **1:1 pair record**.
- A Movement card in a Deck must always be paired to exactly one Combat card.
- Pair membership must be represented with an explicit join model so card reuse, ordering, and pair-level metadata can evolve without changing the Deck record shape.
- There is no theoretical hard limit on Movement/Combat pairs per Deck, but UI layouts should optimize for the common case of roughly 12 units.

---

## 6. Rules Engine Architecture

## 6.1 Pipeline
1. **Normalize input** (deck + context).
2. **Expand deck composition** into commander context plus movement/combat pair instances.
3. **Resolve active rules** (trigger/condition checks).
4. **Build dependency graph** among rules/effects.
5. **Topologically order** rule execution by dependency + priority.
6. **Apply effects** deterministically to an immutable state snapshot chain.
7. **Emit evaluation result** (final state + trace + warnings/conflicts).

## 6.2 Conflict/Dependency Policy
- Priority first, dependency second, stable tie-breaker third.
- Detect cycles and surface explicit error states.
- Keep effect handlers pure and unit-testable.
- Separate evaluation from side effects (logging/persistence outside core evaluator).

## 6.3 Traceability
Persist optional evaluation traces for replay/debugging:
- rule activation decisions
- execution order
- state deltas per effect
- conflict resolutions

---

## 7. IndexedDB Architecture

## 7.1 Object Stores (initial)
- `movementCards`
- `combatCards`
- `commanderCards`
- `commanderModes`
- `ruleFilters`
- `movementFilters`
- `movementFilterActions`
- `combatCardRuleFilterLinks`
- `commanderModeRuleFilterLinks`
- `decks`
- `deckMovementCombatPairs`
- `rules`
- `cardRuleLinks`
- `simulationProfiles` (future-ready)
- `metadata` (schema/app metadata)

## 7.2 Indexing (initial)
- movement cards by `unitRole`, `defaultOrderNumber`, `updatedAt`
- combat cards by `role`, `defaultOrderNumber`, `updatedAt`
- commander cards by `name`, `faction`, `updatedAt`
- commander modes by `commanderCardId`, `mode`
- rule filters by `type`, `key`, `label`
- movement filters by `movementCardId`, `movementCardId + profile + sortOrder`
- movement filter actions by `movementFilterId`, `movementFilterId + sortOrder`
- combat-card rule-filter links by `combatCardId`, `ruleFilterId`, `combatCardId + filterGroup + sortOrder`
- commander-mode rule-filter links by `commanderModeId`, `ruleFilterId`, `commanderModeId + filterGroup + sortOrder`
- decks by `name`, `updatedAt`, `lastUsedAt`
- deck movement/combat pairs by `deckId`, `movementCardId`, `combatCardId`, `deckId + movementOrderNumber`
- rules by `trigger`, `priority`, `updatedAt`
- link table by `cardId`, `ruleId`

## 7.3 DTO Modeling Guidance
- Store Movement and Combat cards independently so they can be authored and reused separately.
- Store Commander Modes separately from Commander Cards so one commander can expose many modes without duplicating name/faction data.
- Store Rule Filters in their own table and reference them through ordered join records rather than duplicating rule text inside cards.
- Use separate ordered join DTOs for each owner/group combination so movement profiles and commander target groups remain explicit and queryable.
- Use Rule Filter `type` as a validation guard so movement profiles cannot accidentally consume combat filters and vice versa.
- Treat card-level order numbers as **defaults/templates**.
- Treat deck pair order numbers as **deck-instance values** so reused cards can participate in different decks without mutation.

## 7.4 Repository Pattern
- Application layer calls repository interfaces.
- Infrastructure layer implements IndexedDB details and migrations.
- Domain/application never depend on IndexedDB APIs directly.

## 7.5 Versioning and Migrations
- Maintain explicit schema versions.
- Forward migrations must be deterministic and idempotent.
- Never silently drop data on migration failure; surface actionable errors.

---

## 8. PWA/Offline-First Behavior
- Card/deck CRUD and evaluation must operate without network.
- External integration features are additive and optional.
- Queue/sync behavior for integration workflows should be explicit and user-visible.

---

## 9. Third-Party Integration Boundary (MekBay and others)
- Define adapter interface in application/domain terms (not provider DTOs).
- Map internal entities to external payloads in infrastructure adapters only.
- Keep simulation launch/readback flows behind use cases:
  - export deck/rules
  - start simulation
  - ingest simulation results

---

## 10. Recommended Scaffolding (Review First)
Proposed structure for your approval before implementation:

```text
src/
  domain/
    entities/
    value-objects/
    rules/
  application/
    use-cases/
    services/
    selectors/
  infrastructure/
    indexeddb/
      schema/
      repositories/
      dto/
    integrations/
      mekbay/
  rules-engine/
    evaluator/
    resolver/
    effects/
    tracing/
  ui/
    atoms/
    molecules/
    organisms/
    templates/
    pages/
  composables/
  router/
```

---

## 11. Alignment Reference
Role boundaries and interaction ownership are defined in [Agents.md](./Agents.md).
