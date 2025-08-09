# Spotter

Cross-platform (Expo + React Native + TypeScript) app to parse workout captions into structured steps and save them locally.

## Local development

1. Install dependencies:

   - npm: `npm install`

2. Start the app:

   - `npx expo start`
   - Then open: Web (press `w`), Android emulator/Expo Go (press `a`), or iOS Expo Go (press `i`).

## Tests

- Run unit tests: `npm test`

## Fixtures

See `fixtures/captions.txt` for sample captions to paste into the Import screen.

## Manual test plan

1. Run `npx expo start` and open the app (web or device).
2. Paste a sample caption into the Import screen. Optionally set Title and Source URL.
3. Tap "Parse Workout" and verify the table shows columns: Move | Sets | Reps | Weight | Time | Distance | Type with colored rows.
4. Tap "Save Workout". Confirm the "Saved!" alert.
5. Open the Library (header right). Verify the saved workout appears and persists across reloads.
6. Long-press a library row to delete.


