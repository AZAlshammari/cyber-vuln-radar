export function CyberBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.13),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.1),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.04),transparent)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.08),transparent_24%),linear-gradient(135deg,rgba(2,6,23,0.8),transparent)]" />
      <div className="cyber-grid absolute inset-0 opacity-[0.18] dark:opacity-[0.24]" />
      <div className="cyber-scene absolute top-24 h-72 w-72 ltr:right-8 rtl:left-8 md:h-96 md:w-96">
        <div className="cyber-core" />
        <div className="cyber-ring cyber-ring-a" />
        <div className="cyber-ring cyber-ring-b" />
        <div className="cyber-ring cyber-ring-c" />
      </div>
    </div>
  );
}
