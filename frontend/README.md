
# Ticketing Frontend — Jira-like UI (Accessible)

This is an improved frontend-only scaffold styled in a Jira-like manner with accessibility improvements (keyboard focus, aria attributes, skip link), icons (react-icons), responsive layout, and better visual hierarchy.

Features:
- Mock authentication (localStorage)
- Projects, Issues, Kanban board, Backlog, Assets, Users, Notifications
- Drag-and-drop on Kanban
- Keyboard & screen-reader friendly basics (ARIA, focus styles, skip link)

Run:
1. unzip
2. npm install
3. npm start

If you'd like, next steps I can do now (pick any or say "all"):
- Polish visual styling to more closely match a specific Jira theme (spacing, fonts, exact colors)
- Replace mock storage with a real API wiring (Express + Postgres/Mongo)
- Add unit tests and accessibility audits (axe)
- Implement advanced components: epic panel, burndown, cumulative flow, Gantt integration


## Accessibility & A11y features added


- Jira-like color tokens & typography approximated.
- Keyboard controls for Kanban cards (ArrowLeft/ArrowRight) and accessible move buttons.
- Export issues as CSV and simple Import CSV parsing (client-side).
- Printable board view (use browser Print).
- `ACCESSIBILITY_AUDIT.md` added with instructions for automated and manual audits.
