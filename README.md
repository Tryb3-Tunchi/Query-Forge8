# QueryForge — Visual Query Builder

A highly interactive visual query builder built with Next.js 15 (App Router), TypeScript, Zustand, DnD Kit, and Framer Motion.

**Live:** [https://query-forge8.vercel.app/]

## Architecture

### Recursive UI
`ConditionGroup` renders itself recursively for unlimited nesting depth. Each group renders its children; nested groups are offset and color-coded by depth. DnD Kit handles reordering within each group.

### State Management
Zustand with Immer middleware powers the query tree. The tree is traversed with recursive helpers (`findGroup`, `removeFromTree`, `findAndUpdate`) for immutable updates. UI state and history are separate stores.

### Query Engine
`lib/queryEngine.ts` — recursive evaluator for AND/OR groups.  
`lib/queryParser.ts` — generates SQL, MongoDB, and JSON from the tree.  
`lib/queryValidator.ts` — validates type-operator compatibility, value requirements, and structure.

### Performance
- Each rule/group is an independent memoized component
- DnD Kit uses stable IDs
- Zustand slices minimize re-renders
- AnimatePresence handles smooth mount/unmount

## Trade-offs
- Used inline styles + CSS variables over Tailwind utilities for maximum theming control
- Chose Zustand + Immer over Redux for simplicity without sacrificing power
- Mock data is generated in-memory (no backend required for this challenge)