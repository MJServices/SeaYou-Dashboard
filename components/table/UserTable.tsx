import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations, useFormatter } from "next-intl";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  lastActive: Date;
  bottles: number;
  type: "Basic" | "Premium";
};

export function UserTable({
  rows,
  onRowClick,
}: {
  rows: UserRow[];
  onRowClick?: (row: UserRow) => void;
}) {
  const t = useTranslations("Users");
  const format = useFormatter();

  return (
    <div className="rounded-2xl border border-[#d9d9d9]">
      <div className="hidden md:block">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("idNumber")}
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("name")}
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("emailAddress")}
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("lastActive")}
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("bottlesSent")}
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                {t("type")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                className="odd:bg-[#fafafa] cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                onClick={() => onRowClick?.(r)}
              >
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.id}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.name}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  <span className="underline hover:text-[#737373]">
                    {r.email}
                  </span>
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {format.relativeTime(r.lastActive)}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.bottles}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.type === "Basic" ? t("basic") : t("premium")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden">
        <div className="divide-y divide-[#eaeaea]">
          {rows.map((r) => (
            <div
              key={r.id}
              onClick={() => onRowClick?.(r)}
              className="block cursor-pointer hover:bg-[#fafafa]"
            >
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-semibold text-[#363636]">
                    {r.name}
                  </p>
                  <span className="rounded-full border border-[#d9d9d9] px-2 py-1 text-[12px] text-[#363636]">
                    {r.type === "Basic" ? t("basic") : t("premium")}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-[14px] text-[#737373]">{r.id}</div>
                  <div className="text-[14px] text-[#737373]">
                    {format.relativeTime(r.lastActive)}
                  </div>
                  <div className="col-span-2 text-[14px] text-[#363636]">
                    {r.email}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[14px] text-[#737373]">
                    {t("bottlesSent")}
                  </span>
                  <span className="text-[16px] font-semibold text-[#363636]">
                    {r.bottles}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
