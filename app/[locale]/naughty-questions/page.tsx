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
import { getTranslations } from "next-intl/server";

export default async function NaughtyQuestionsPage() {
  const t = await getTranslations("NaughtyQuestions");
  const commonT = await getTranslations("Common");

  const { data: questions, error } = await supabase
    .from("naughty_questions")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) console.error("Error fetching questions:", error);

  return (
    <Shell title={t("title")}>
      <div className="rounded-2xl border border-[#d9d9d9] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                {t("order")}
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                {t("category")}
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                {t("label")}
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                {t("question")}
              </TableHead>
              <TableHead className="text-[#737373] bg-[#f5f5f5]">
                {t("status")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions?.map((q: any) => (
              <TableRow key={q.id}>
                <TableCell className="text-[#363636]">
                  {q.display_order}
                </TableCell>
                <TableCell className="text-[#363636] font-medium">
                  {q.category}
                </TableCell>
                <TableCell className="text-[#363636]">{q.label}</TableCell>
                <TableCell className="text-[#363636] max-w-sm">
                  {q.question_text}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${q.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {q.is_active ? commonT("active") : commonT("inactive")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {(!questions || questions.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-[#737373]"
                >
                  {t("notFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Shell>
  );
}
