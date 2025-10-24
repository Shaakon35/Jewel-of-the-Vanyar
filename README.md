## Jewel of the Vanyar

A lightweight browser game where you create a custom brute, fight AI opponents in turn-based auto-battles, and level up to learn new skills. No accounts, no servers — your progress is saved in your browser.

### Overview
- **Create or load** your brute by name
- **Customize** gender, haircut, shape, and colors
- **Fight** randomly generated enemies in an auto-battle
- **Level up** to increase stats and unlock the occasional new skill
- **Progress saves** automatically via localStorage

### How to Play
1. Open `index.html` in a modern browser.
2. Enter a name and click "Validate".
   - If a brute with this name exists, it will be loaded.
   - Otherwise, you’ll customize and create a new brute.
3. From Home, click "Find a New Opponent" to start a fight.
4. Watch the fight log and results. Win to gain XP and level up.

### Core Features
- **Character creation**: gender, haircut, body shape, body/hair colors
- **Auto-combat**: speed determines initiative; damage varies with strength
- **Progression**: XP, increasing level, HP, strength, speed
- **Skills**: new skill unlocked every few levels (e.g., Power Attack)
- **Persistence**: per-name save/load via `localStorage`
- **Responsive UI**: simple, readable layout and animated attack feedback

### Tech Stack
- **Vanilla HTML/CSS/JavaScript**
- **localStorage** for persistence
- No frameworks, servers, or build steps required

### Project Structure
- `index.html` — UI markup and screen layout
- `style.css` — Styling, layout, and simple animations
- `script.js` — Game logic, state management, UI updates
- `images/` — Visual assets

### Run Locally
- Easiest: double-click `index.html` to open it in your browser.
- Or serve it from a simple static server:
  - Python 3: `python3 -m http.server 8000`
  - Node: `npx http-server -p 8000 --silent`
  - Then open `http://localhost:8000` in your browser.

### Save Data
- Saves are stored in your browser’s `localStorage` under keys like `brute-<NAME>`.
- To reset progress for a name, open devtools and delete that key from `localStorage`.

### Roadmap (Ideas)
- More skills and status effects
- Equipment and loot
- Multiple opponents per day / tournament ladder
- Better art and animations
- Sound effects and music

### Credits
- Game design and code by the author.
- Personal note: Data Scientist by day, developer in my free time.

Enjoy cracking skulls in the arena! 🛡️⚔️