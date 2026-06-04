Title: feat: Zustand state architecture with recursive tree management

Description:
- queryStore: normalized query tree with recursive helpers
- findGroup, removeFromTree, findAndUpdate traverse nested structure
- uiStore: panel visibility, theme, preview format state
- historyStore: persisted history and named presets via localStorage
- Immer middleware for immutable updates