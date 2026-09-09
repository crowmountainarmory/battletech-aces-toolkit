# Agents.md

## Purpose
Define clear responsibility boundaries ("agents") so the BattleTech Aces Toolkit remains modular, reusable, and testable as it grows from local deck management into live simulation integrations.

---

## Core Principles
- **Separation of concerns:** each agent owns one domain capability.
- **Atomic UI + reusable logic:** UI is composable; business logic stays out of presentational components.
- **Deterministic rules processing:** game rule evaluation must be predictable and replayable.
- **Offline-first persistence:** deck/card workflows must function without network access.
- **Explicit contracts:** agent-to-agent communication should use typed payloads and known events.

---

## Agent Map

### 1) UI Composition Agent
**Owns:** rendering card/deck views and card authoring flows using atomic design.  
**Consumes:** view models from Application State Agent.  
**Never owns:** persistence, rule execution, or third-party communication.

### 2) Application State Agent
**Owns:** application-level state orchestration, derived state, and user intent handling.  
**Consumes:** Persistence Agent, Rules Engine Agent.  
**Rules:** use Vue computed properties for pure derived state only (no side effects, no async writes, no rule mutation).

### 3) Rules Engine Agent
**Owns:** rule graph evaluation, dependency ordering, effect resolution, and conflict policy.  
**Consumes:** normalized rule/card/deck inputs.  
**Produces:** deterministic evaluation outputs + trace logs suitable for replay/debug.

### 4) Persistence Agent (IndexedDB)
**Owns:** local storage CRUD, schema versioning/migrations, indexing, and query utilities.  
**Stores:** cards, decks, rule definitions, simulation presets, and metadata.  
**Never owns:** UI formatting or gameplay evaluation decisions.

### 5) Integration Adapter Agent
**Owns:** external-system boundaries (e.g., MekBay), DTO mapping, capability negotiation, and sync contracts.  
**Rules:** isolate provider-specific details behind adapter interfaces so internal domain models stay stable.

### 6) Validation and Policy Agent
**Owns:** schema validation, card/deck integrity checks, and guardrails for custom abilities/rules.  
**Consumes:** user-authored content before save/evaluation.  
**Produces:** actionable validation errors for UI.

---

## Interaction Contracts (High Level)
1. UI emits user intent (create/update/evaluate deck/card).
2. Application State Agent validates intent and composes commands.
3. Persistence Agent saves/retrieves canonical data.
4. Rules Engine Agent evaluates selected deck/rules and returns deterministic results.
5. Application State Agent exposes computed view models for UI rendering.
6. Integration Adapter Agent is optional and invoked through explicit use cases (export/simulate/sync).

---

## Recommended Boundaries in Source Layout
For implementation review/approval before scaffolding changes:

- `src/domain/` - entities, value objects, rule primitives
- `src/application/` - use cases, orchestration, derived state facades
- `src/infrastructure/indexeddb/` - repositories, schema, migrations
- `src/infrastructure/integrations/` - MekBay and other adapters
- `src/rules-engine/` - evaluator, resolver, trace model
- `src/ui/atoms|molecules|organisms|templates|pages/` - atomic design component tiers

---

## Non-Negotiable Agent Rules
- No direct IndexedDB calls inside presentational components.
- No side effects inside computed properties.
- Rules evaluation must be pure relative to input snapshot.
- External adapter failures must surface explicitly (no silent fallback that hides data loss/rule drift).
- Any schema/rules-engine changes must preserve backward compatibility via migration/version strategy.

