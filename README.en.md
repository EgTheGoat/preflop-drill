# preflop-drill

[日本語](./README.md) | [English](./README.en.md)

A web app for drilling Texas Hold'em preflop ranges.  
A random position and hand are presented each round; your chosen action is checked against the GTO range and graded correct or incorrect.  
PWA-enabled — works offline.

---

## Practice Modes

| Mode | Table | Scenario |
|---|---|---|
| **GTOWiz RFI** | 6-max NL25 100bb cash | RFI (open or fold) |
| **vs UTG** | 6-max NL25 100bb cash | HJ/CO/BTN/SB/BB action facing a UTG open |
| **vs HJ** | 6-max NL25 100bb cash | CO/BTN/SB/BB action facing a HJ open |
| **vs CO** | 6-max NL25 100bb cash | BTN/SB/BB action facing a CO open |
| **vs BTN** | 6-max NL25 100bb cash | SB/BB action facing a BTN open |
| **vs SB** | 6-max NL25 100bb cash | BB action facing a SB open |
| **vs 3bet** | 6-max NL25 100bb cash | Opener facing a 3-bet (fold/call/4-bet) |
| **vs 4bet** | 6-max NL25 100bb cash | 3-bettor facing a 4-bet (fold/call/5-bet) |
| **Yokosawa (Tournament)** | 9-max | Open / vs raise (call or 3-bet) |


<div align="center">
  <img width="320" alt="preflop-drill screenshot" src="https://github.com/user-attachments/assets/05ef6767-42d9-4ae5-88c9-63f2ee38ceaf" />
</div>

## Install (PWA)

Add to your home screen from a browser to use as a native-like app.

| Browser | Steps |
|---|---|
| iOS Safari | Share button → "Add to Home Screen" |
| Android Chrome | Menu → "Install app" |
| Desktop Chrome | Install icon in the address bar |

Works offline after installation.

## Grading

An answer is **correct (◯)** if the chosen action matches the highest-frequency GTO action.

- Hand with `raise 80% / fold 20%`: choosing **raise** → **◯**
- Same hand, choosing **fold** → **✗**
- In **mixed spots** (two or more actions ≥ 20%), any of those actions is accepted as correct

## Session History

After each answer, a history entry is added to the stats panel.

- Shows cards, position, chosen action, and correct/incorrect for each hand
- Tap a row to open the range grid and see where that hand falls
- In Yokosawa vs-raise scenarios, both your position and the raiser's position are shown

## Stack

| Role | Library |
|---|---|
| UI | React 18 |
| Types | TypeScript |
| Build | Vite |
| State | Zustand |
| PWA | vite-plugin-pwa |
| Tests | Vitest |

## Development

**Prerequisite:** [mise](https://mise.jdx.dev/) installed.

```bash
mise install   # provision Node 24
npm install
npm run dev    # dev server (localhost:5173)
npm test       # unit tests
npm run build  # production build → dist/
```

## Directory Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── Quiz.tsx           # Main quiz view (table diagram, hand, buttons, result modal)
│   ├── ActionButtons.tsx  # fold/call/raise buttons
│   ├── BottomNav.tsx      # Bottom tab navigation
│   ├── ChartPopover.tsx   # Range chart popover in More tab
│   ├── ChartView.tsx      # Standalone range chart page
│   ├── Feedback.tsx       # Post-answer frequency bar
│   ├── ModeSwitch.tsx     # Mode selector
│   ├── MoreHub.tsx        # More tab
│   ├── PlayingCard.tsx    # Card display
│   ├── PositionFilter.tsx # Position filter
│   ├── RangeGrid.tsx      # 169-hand range grid
│   ├── SessionStats.tsx   # Session stats & history
│   ├── TableDiagram.tsx   # Table diagram
│   └── TierLegend.tsx     # Yokosawa tier color legend
├── data/
│   ├── ranges/            # Range data (JSON)
│   ├── ranges.ts          # Mode definitions & range list
│   ├── yokosawa.ts        # Yokosawa open range definitions
│   ├── yokosawaChart.ts   # Yokosawa range chart (tier colors)
│   └── yokosawaVs.ts      # Yokosawa vs-raise ranges
├── lib/
│   ├── cards.ts           # Card generation utilities
│   ├── explain.ts         # Answer explanation text
│   ├── hands.ts           # Hand generation & notation conversion
│   ├── scoring.ts         # Grading logic
│   └── trainer.ts         # Question generation
├── store/
│   └── session.ts         # Zustand session store (stats & history)
└── types/
    └── range.ts           # Range / Action / Position type definitions
```

## Contributing

Bug reports and feature requests go to [Issues](https://github.com/EgTheGoat/preflop-drill/issues).

## Adding Range Data

Drop a JSON file into `src/data/ranges/` to add a new practice scenario.  
See the `Range` type in `src/types/range.ts` for the schema.

```ts
// Minimal example
{
  "id": "gtowiz_6max_vs_utg_bb",
  "label": "BB vs UTG Open",
  "format": "6-max 100bb",
  "position": "BB",
  "scenario": "vs UTG Open",
  "actions": ["fold", "call", "raise"],
  "hands": {
    "AKs": { "raise": 1 },
    "22":  { "call": 1 },
    "72o": { "fold": 1 }
  }
}
```

For Yokosawa mode range structure, see `src/data/yokosawa.ts`.

## License

[MIT](./LICENSE)  
Yokosawa ranges © Yokosawa (referenced for educational purposes).
