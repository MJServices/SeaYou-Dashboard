export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { Shell } from "@/components/layout/Shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function FantasiesPage() {
  const { data: fantasies, error } = await supabase
    .from("fantasies")
    .select(
      `
      *,
      profiles (
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching fantasies:", error);

  return (
    <Shell title="Fantasies">
      <div className="rounded-2xl border border-[#d9d9d9] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                User
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                Text
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                Status
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fantasies?.map((f: any) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium text-[#363636]">
                  <div>{f.profiles?.full_name || "Unknown"}</div>
                  <div className="text-xs text-[#737373]">
                    {f.profiles?.email}
                  </div>
                </TableCell>
                <TableCell className="text-[#363636] max-w-md truncate">
                  {f.text}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${f.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {f.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-[#363636]">
                  {f.created_at
                    ? format(new Date(f.created_at), "MMM d, yyyy HH:mm")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
            {(!fantasies || fantasies.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-[#737373]"
                >
                  No fantasies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Shell>
  );
}
