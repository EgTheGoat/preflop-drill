// 練習画面ヘッダーに置くモード（流派）切替。ヨコサワ / GTO をセグメントで即切替。
// モード変更は成績リセット＋再出題を伴うため、同じモードを押しても何もしない。

import { useSession } from "../store/session";
import { MODES } from "../data/ranges";

export function ModeSwitch() {
  const mode = useSession((s) => s.mode);
  const setMode = useSession((s) => s.setMode);

  return (
    <div className="mode-switch" role="tablist" aria-label="練習モード">
      {MODES.map((m) => {
        const on = mode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            className={`mode-seg${on ? " on" : ""}`}
            aria-selected={on}
            onClick={() => {
              if (!on) setMode(m.id);
            }}
          >
            {m.short}
          </button>
        );
      })}
    </div>
  );
}
