import { useSession } from "../store/session";
import { MODES } from "../data/ranges";

export function ModeSwitch() {
  const mode = useSession((s) => s.mode);
  const setMode = useSession((s) => s.setMode);

  return (
    <select
      className="mode-select"
      value={mode}
      onChange={(e) => setMode(e.target.value as typeof mode)}
    >
      {MODES.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
    </select>
  );
}
