"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function FilterSheet({
  open,
  onOpenChange,
  type,
  setType,
  gender,
  setGender,
  bottlesMin,
  setBottlesMin,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  city,
  setCity,
  department,
  setDepartment,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "All" | "Basic" | "Premium";
  setType: (t: any) => void;
  gender: string[];
  setGender: (g: string[]) => void;
  bottlesMin: number | undefined;
  setBottlesMin: (n: any) => void;
  minAge: number | undefined;
  setMinAge: (n: any) => void;
  maxAge: number | undefined;
  setMaxAge: (n: any) => void;
  city: string;
  setCity: (s: string) => void;
  department: string;
  setDepartment: (s: string) => void;
  sortBy: "none" | "gender" | "age" | "department" | "createdAt";
  setSortBy: (s: any) => void;
  sortDir: "asc" | "desc";
  setSortDir: (s: any) => void;
}) {
  const t = useTranslations("Filters");
  const ut = useTranslations("Users");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6">
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              {t("type")}
            </label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="w-full h-11 rounded-lg border-[#d9d9d9]">
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">{t("allTypes")}</SelectItem>
                <SelectItem value="Basic">{t("basic")}</SelectItem>
                <SelectItem value="Premium">{t("premium")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-2">
              {ut("gender")}
            </label>
            <div className="flex flex-wrap gap-2">
              {["male", "female", "nonbinary", "other"].map((g) => {
                const isSelected = gender.includes(g);
                return (
                  <Button
                    key={g}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-9 rounded-full px-4 text-[14px] ${isSelected ? "bg-[#363636] text-white" : "text-[#737373] border-[#d9d9d9]"}`}
                    onClick={() => {
                      if (isSelected) {
                        setGender(gender.filter((x) => x !== g));
                      } else {
                        setGender([...gender, g]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-[3px] border ${isSelected ? 'bg-white border-white' : 'border-[#737373]'}`} />
                      {ut(g)}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              {t("ageRange")}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                className="h-11 rounded-lg border-[#d9d9d9]"
                placeholder={t("minAge")}
                value={minAge ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") setMinAge(undefined);
                  else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) setMinAge(num);
                  }
                }}
              />
              <Input
                type="number"
                className="h-11 rounded-lg border-[#d9d9d9]"
                placeholder={t("maxAge")}
                value={maxAge ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") setMaxAge(undefined);
                  else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) setMaxAge(num);
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              {t("city")}
            </label>
            <Input
              className="h-11 rounded-lg border-[#d9d9d9]"
              placeholder={t("cityPlaceholder")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              {t("department")}
            </label>
            <Input
              className="h-11 rounded-lg border-[#d9d9d9]"
              placeholder={t("departmentPlaceholder")}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              {t("minBottles")}
            </label>
            <Input
              type="number"
              className="h-11 rounded-lg border-[#d9d9d9]"
              placeholder={t("minBottlesPlaceholder")}
              value={bottlesMin ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setBottlesMin(undefined);
                } else {
                  const num = parseInt(val, 10);
                  if (!isNaN(num)) setBottlesMin(num);
                }
              }}
            />
          </div>
          <div className="pt-4 border-t border-[#eaeaea]">
            <label className="block text-[14px] font-semibold text-[#363636] mb-2 flex justify-between items-center">
              <span>{t("sortBy")}</span>
              <div className="flex bg-[#f5f5f5] p-1 rounded-md">
                <button
                  className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${sortDir === 'asc' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                  onClick={() => setSortDir('asc')}
                >
                  {t("sortAsc")}
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${sortDir === 'desc' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                  onClick={() => setSortDir('desc')}
                >
                  {t("sortDesc")}
                </button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "none", label: ut("all") },
                { value: "gender", label: ut("gender") },
                { value: "age", label: t("ageRange") },
                { value: "department", label: t("department") },
                { value: "createdAt", label: ut("createdAt") }
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={sortBy === opt.value ? "default" : "outline"}
                  className={`h-9 rounded-full px-4 text-[14px] ${sortBy === opt.value ? "bg-[#363636] text-white" : "text-[#737373] border-[#d9d9d9]"}`}
                  onClick={() => setSortBy(opt.value as any)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter className="mt-8 flex flex-col gap-2">
          <Button
            className="w-full h-11 rounded-lg bg-[#363636] text-white hover:opacity-90 transition-opacity"
            onClick={() => onOpenChange(false)}
          >
            {t("apply")}
          </Button>
          <Button
            variant="ghost"
            className="w-full h-11 text-[#737373] hover:text-[#363636]"
            onClick={() => {
              setType("All");
              setGender([]);
              setBottlesMin(undefined);
              setMinAge(undefined);
              setMaxAge(undefined);
              setCity("");
              setDepartment("");
              setSortBy("none");
              setSortDir("desc");
            }}
          >
            {t("reset")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
