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
- **Card**: identity, metadata, tags, abilities, rule references, version.
- **Deck**: identity, name, card IDs/order, faction/constraints, version.
- **Rule**: trigger, conditions, effects, priority, dependencies, scope.
- **Simulation Profile** (future): external mapping and run configuration.

### Value Objects
- RuleCondition, RuleEffect, RulePriority, CardReference, DeckConstraint, EvaluationContext.

---

## 6. Rules Engine Architecture

## 6.1 Pipeline
1. **Normalize input** (deck + context).
2. **Resolve active rules** (trigger/condition checks).
3. **Build dependency graph** among rules/effects.
4. **Topologically order** rule execution by dependency + priority.
5. **Apply effects** deterministically to an immutable state snapshot chain.
6. **Emit evaluation result** (final state + trace + warnings/conflicts).

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
- `cards`
- `decks`
- `rules`
- `cardRuleLinks`
- `simulationProfiles` (future-ready)
- `metadata` (schema/app metadata)

## 7.2 Indexing (initial)
- cards by `name`, `tags`, `updatedAt`
- decks by `name`, `updatedAt`
- rules by `trigger`, `priority`, `updatedAt`
- link table by `cardId`, `ruleId`

## 7.3 Repository Pattern
- Application layer calls repository interfaces.
- Infrastructure layer implements IndexedDB details and migrations.
- Domain/application never depend on IndexedDB APIs directly.

## 7.4 Versioning and Migrations
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

