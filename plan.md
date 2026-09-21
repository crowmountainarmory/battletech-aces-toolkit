# Plan

## Current status
- Deck onboarding flow is implemented and working.
- IndexedDB-backed deck creation and retrieval are in place.
- Reusable card shell and commander card template are built.
- Runtime component registration issue for the new RuleListField atom was fixed by restoring the import in the commander card template.
- Tailwind CSS and the `classnames` helper have been added and the app templates were converted from custom CSS classes to utility-based styling.

## Next steps
- Add movement/combat card templates using the same generic card abstraction.
- Define the default movement rule-filter catalog and seed it to IndexedDB.
- Expand the deck editor to support card creation and linking.
- Add stronger typed DTOs and validation around card templates and deck composition.
