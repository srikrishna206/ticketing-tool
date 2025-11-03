
# Accessibility Audit Instructions (Automated + Manual)

This project includes an accessibility-first approach (ARIA attributes, keyboard focus, skip links). To run an accessibility audit locally:

## Automated checks
1. Install pa11y or axe-cli globally:
   - `npm install -g pa11y` or `npm install -g @axe-core/cli`
2. Start the app: `npm start`
3. In another terminal run:
   - `pa11y http://localhost:3000/for-you`  (Pa11y)
   - or `npx axe http://localhost:3000/for-you` (Axe CLI)

## Dev-time React checks
You can add `react-axe` for development (not production).
1. `npm install --save-dev react-axe axe-core`
2. In `src/index.js` conditionally initialize react-axe when running in development.
   Example:
   ```js
   if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
     import('react-axe').then(reactAxe => {
       const axe = reactAxe.default;
       axe(React, ReactDOM, 1000);
     });
   }
   ```

## Manual testing checklist
- [ ] Keyboard navigation: Tab through interactive controls in logical order.
- [ ] Focus visible on all interactive elements.
- [ ] ARIA roles and labels present on regions (navigation, main, banner).
- [ ] Color contrast ratio >= 4.5:1 for normal text.
- [ ] Form inputs have associated labels.
- [ ] Drag & drop controls have keyboard equivalents (we added move buttons and Arrow keys).
- [ ] Screen reader: ensure meaningful announcements for dynamic updates (e.g., issue moved).

If you want, I can add a `npm run audit:accessibility` script that runs Pa11y/axe and commit recommended dev-dependencies.
