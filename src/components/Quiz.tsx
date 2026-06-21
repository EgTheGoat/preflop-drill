// 出題エリア。出題中はテーブル図＋ハンド＋アクション、回答後はレンジ表＋結果＋次へ。

import { useEffect, useState } from "react";
import { useSession } from "../store/session";
import { PlayingCard } from "./PlayingCard";
import { ActionButtons } from "./ActionButtons";
import { ModeSwitch } from "./ModeSwitch";
import { Feedback } from "./Feedback";
import { TableDiagram } from "./TableDiagram";
import { RangeGrid } from "./RangeGrid";
import { TierLegend } from "./TierLegend";
import { explainYokosawa } from "../lib/explain";
import {
  ACTION_BUTTON_LABELS,
  NINE_MAX_ORDER,
  POSITION_LABEL,
  SIX_MAX_ORDER,
  type Action,
  type Position,
  type Range,
} from "../types/range";

// レイザー検索用の全ポジション候補。長さの降順にして "UTG" が "UTG1"/"UTG2" に誤マッチしないようにする。
const POSITIONS: Position[] = [...new Set([...NINE_MAX_ORDER, ...SIX_MAX_ORDER])].sort(
  (a, b) => b.length - a.length,
);

/** シナリオ文字列（例 "vs BTN オープン"）から相手レイザーの席を取り出す。 */
function raiserFromScenario(scenario: string, hero: Position): Position | null {
  return POSITIONS.find((p) => p !== hero && scenario.includes(p)) ?? null;
}

/** モードに応じたテーブル席順。 */
function orderForMode(mode: string): Position[] {
  if (mode.startsWith("yokosawa") || mode === "gto_9max") return NINE_MAX_ORDER;
  return SIX_MAX_ORDER;
}

/** 正解アクションの表示名（vsレイズスポットの raise は 3BET と表示）。 */
function actionLabel(action: Action, is3betSpot: boolean): string {
  if (action === "raise" && is3betSpot) return "3BET";
  return ACTION_BUTTON_LABELS[action].split(" ")[0];
}

/** 状況を問いかけ文にする（例 "オープンレイズ？"）。 */
function promptText(range: Range): string {
  const call = range.actions.includes("call");
  const raise = range.actions.includes("raise");
  if (call && raise) return "コール / 3bet？";
  if (call) return "コール？";
  return "オープンレイズ？";
}

export function Quiz() {
  const question = useSession((s) => s.question);
  const lastAnswer = useSession((s) => s.lastAnswer);
  const lastResult = useSession((s) => s.lastResult);
  const answer = useSession((s) => s.answer);
  const nextQuestion = useSession((s) => s.nextQuestion);
  const stats = useSession((s) => s.stats);
  const mode = useSession((s) => s.mode);

  // ヨコサワ系レンジは二値（頻度なし）。ティア配色で表示し、頻度バーは出さない。
  const tierColored = mode.startsWith("yokosawa");

  // 初回に問題が無ければ自動生成
  useEffect(() => {
    if (!question) nextQuestion();
  }, [question, nextQuestion]);

  // 回答直後に ◯/✕ を一瞬だけ全画面フラッシュ表示する。
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!lastResult) {
      setFlash(false);
      return;
    }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 2000);
    return () => clearTimeout(t);
  }, [lastResult]);

  if (!question) return <div className="quiz empty">出題を準備中…</div>;

  const { range, cards } = question;
  const answered = !!lastResult;
  const order = orderForMode(mode);
  // 後ろの人数はテーブルサイズ依存なので席順から算出する（UTG は 6-max=5 / 9-max=8）。
  const playersBehind = order.length - 1 - order.indexOf(range.position);
  const raiser = raiserFromScenario(range.scenario, range.position);
  const is3betSpot = range.actions.includes("call") && range.actions.includes("raise");
  const bestLabel = lastResult ? actionLabel(lastResult.best, is3betSpot) : "";
  // 解説はティア理論で説明できるヨコサワ系のみ。GTO は下の頻度表示に任せる。
  const explanation =
    answered && tierColored ? explainYokosawa(range, question.hand, raiser, playersBehind) : null;

  return (
    <div className="quiz">
      <header className="quiz-topbar">
        <ModeSwitch />
        <span className="counter">
          {stats.correctCount} / {stats.count}
        </span>
      </header>

      <div className="ask">
        <TableDiagram active={range.position} raiser={raiser} order={order} />

        <div className="hole-cards">
          <PlayingCard card={cards[0]} />
          <PlayingCard card={cards[1]} />
        </div>

        <ActionButtons
          actions={range.actions}
          disabled={answered}
          chosen={lastAnswer}
          result={lastResult}
          onPick={answer}
          raiseLabel={
            range.actions.includes("call") && range.actions.includes("raise") ? "3BET" : undefined
          }
        />
      </div>

      {answered && (
        <div className="result-modal-backdrop" role="dialog" aria-modal="true">
          <div className="result-modal">
            <div className="answer-head">
              <div className="hole-cards small">
                <PlayingCard card={cards[0]} />
                <PlayingCard card={cards[1]} />
              </div>
              <div className="answer-pos">
                <span className="pos-pill">
                  {POSITION_LABEL[range.position]}
                  <span className="pos-behind">（後ろに{playersBehind}人）</span>
                </span>
                <span className="scenario-q">{promptText(range)}</span>
              </div>

              <div className={`big-verdict ${lastResult.correct ? "ok" : "ng"}`}>
                <span className="mark">{lastResult.correct ? "◯" : "✕"}</span>
                <span className="vtext">{lastResult.correct ? "正解" : "ミス"}</span>
              </div>
            </div>

            <div className="answer-detail">
              <div className="correct-answer">
                正解は <strong>{bestLabel}</strong>
              </div>
              {explanation && <p className="answer-explain">{explanation}</p>}
            </div>

            <RangeGrid
              range={range}
              highlightHand={question.hand}
              tierColored={tierColored}
            />

            {tierColored ? (
              <TierLegend />
            ) : (
              <Feedback range={range} hand={question.hand} result={lastResult} />
            )}

            <button className="next-btn" onClick={nextQuestion} autoFocus>
              次のハンドへ
            </button>
          </div>
        </div>
      )}

      {flash && lastResult && (
        <div className={`verdict-flash ${lastResult.correct ? "ok" : "ng"}`}>
          <span className="flash-mark">{lastResult.correct ? "◯" : "✕"}</span>
          <span className="flash-text">{lastResult.correct ? "正解" : "ミス"}</span>
        </div>
      )}
    </div>
  );
}
