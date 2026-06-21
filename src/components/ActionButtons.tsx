// シナリオのアクション選択ボタン。回答済みなら選んだ手と正解をハイライトする。

import { ACTION_BUTTON_LABELS, type Action } from "../types/range";
import type { ScoreResult } from "../lib/scoring";

interface Props {
  actions: Action[];
  disabled: boolean;
  chosen: Action | null;
  result: ScoreResult | null;
  onPick: (action: Action) => void;
  /** raise ボタンのラベル上書き（例 vsレイズでは "3BET"）。 */
  raiseLabel?: string;
}

const RAISE_ACTIONS = new Set<Action>(["raise", "raise_small", "raise_large"]);

export function ActionButtons({ actions, disabled, chosen, result, onPick, raiseLabel }: Props) {
  return (
    <div className="action-buttons">
      {actions.map((a) => {
        const isChosen = chosen === a;
        const isBest = result?.best === a;
        // fold は地味、call は緑、raise/3bet はコーラルの主役ボタン。
        let cls = "action-btn primary";
        if (a === "fold") cls = "action-btn fold";
        else if (a === "call") cls = "action-btn call";
        if (result) {
          if (isBest) cls += " best";
          if (isChosen && !isBest) cls += " wrong";
        }
        const label = raiseLabel && RAISE_ACTIONS.has(a) ? raiseLabel : ACTION_BUTTON_LABELS[a];
        return (
          <button key={a} className={cls} disabled={disabled} onClick={() => onPick(a)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
