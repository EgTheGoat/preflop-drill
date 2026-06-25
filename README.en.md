# preflop-drill

A web app for drilling Texas Hold'em preflop ranges.  
A random position and hand are presented each round; your chosen action is checked against the GTO range and graded correct or incorrect.  
PWA-enabled — works offline.

---

## Practice Modes

| Mode | Table | Scenario |
|---|---|---|
| **GTO 6m** | 6-max 100bb cash | RFI (open or fold) |
| **GTO 9m** | 9-max 100bb cash | RFI |
| **Yokosawa (Tournament)** | 9-max | Open / vs raise (call or 3-bet) |

<div align="center">
  <img width="320" alt="preflop-drill screenshot" src="https://github.com/user-attachments/assets/7065586c-7714-4361-8f70-2ac20753c0b3" />
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
mise install   # provision Node 22
npm install
npm run dev    # dev server (localhost:5173)
npm test       # unit tests
npm run build  # production build → dist/
```

## Directory Structure

```
src/
├── components/     # UI components (Quiz, RangeGrid, TableDiagram, …)
├── data/
│   ├── ranges/     # GTO range data (JSON)
│   ├── yokosawa.ts # Yokosawa mode range definitions
│   └── yokosawaChart.ts / yokosawaVs.ts
├── lib/
│   ├── hands.ts    # Hand generation & notation conversion
│   ├── scoring.ts  # Grading logic
│   ├── trainer.ts  # Question generation
│   └── explain.ts  # Answer explanation text
├── store/
│   └── session.ts  # Zustand session store (stats & history)
└── types/
    └── range.ts    # Range / Action / Position type definitions
```

## Contributing

Bug reports and feature requests go to [Issues](https://github.com/EgTheGoat/preflop-drill/issues).

## Adding Range Data

Drop a JSON file into `src/data/ranges/` to add a new practice scenario.  
See the `Range` type in `src/types/range.ts` for the schema.

```ts
// Minimal example
{
  "id": "6max_100bb_rfi_btn",
  "label": "BTN Open (RFI)",
  "format": "6-max 100bb",
  "position": "BTN",
  "scenario": "RFI",
  "actions": ["fold", "raise"],
  "hands": {
    "AKs": { "raise": 1 },
    "72o": { "fold": 1 }
  }
}
```

For Yokosawa mode range structure, see `src/data/yokosawa.ts`.

## License

[AGPL-3.0-or-later](./LICENSE)  
Yokosawa ranges © Yokosawa (referenced for educational purposes). GTO ranges are original samples based on standard theory.
