import { Button } from "./Button";
import { useI18n } from "../../i18n";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useI18n();
  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        {t("previous")}
      </Button>
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {t("page")} <span className="font-mono" dir="ltr">{page}</span> {t("of")} <span className="font-mono" dir="ltr">{totalPages}</span>
      </span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        {t("next")}
      </Button>
    </nav>
  );
}
