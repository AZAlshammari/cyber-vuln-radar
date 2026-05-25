import { cx } from "./utils";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-surface-700">
      <span>{label}</span>
      <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span
        aria-hidden="true"
        className={cx(
          "relative inline-flex h-6 w-11 rounded-full transition",
          checked ? "bg-cyan-600" : "bg-slate-300 dark:bg-surface-700",
        )}
      >
        <span
          className={cx(
            "absolute top-1 h-4 w-4 rounded-full bg-white transition ltr:left-1 rtl:right-1",
            checked && "ltr:translate-x-5 rtl:-translate-x-5",
          )}
        />
      </span>
    </label>
  );
}
