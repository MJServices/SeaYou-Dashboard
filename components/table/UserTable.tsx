import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  lastActive: Date;
  bottles: number;
  type: "Basic" | "Premium";
};

function formatLastActive(d: Date) {
  const diff = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} mins ago`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function UserTable({
  rows,
  onRowClick,
}: {
  rows: UserRow[];
  onRowClick?: (row: UserRow) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#d9d9d9]">
      <div className="hidden md:block">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                ID Number
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                Name
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                Email Address
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                Last Active
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                Bottles Sent
              </TableHead>
              <TableHead className="text-[#737373] sticky top-0 z-10 bg-[#f5f5f5]">
                Type
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
                  {formatLastActive(r.lastActive)}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.bottles}
                </TableCell>
                <TableCell className="text-[16px] font-medium text-[#363636]">
                  {r.type}
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
                    {r.type}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-[14px] text-[#737373]">{r.id}</div>
                  <div className="text-[14px] text-[#737373]">
                    {formatLastActive(r.lastActive)}
                  </div>
                  <div className="col-span-2 text-[14px] text-[#363636]">
                    {r.email}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[14px] text-[#737373]">
                    Bottles Sent
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
