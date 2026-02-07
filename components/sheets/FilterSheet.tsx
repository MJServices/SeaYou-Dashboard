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

export function FilterSheet({
  open,
  onOpenChange,
  type,
  setType,
  bottlesMin,
  setBottlesMin,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "All" | "Basic" | "Premium";
  setType: (t: "All" | "Basic" | "Premium") => void;
  bottlesMin: number | undefined;
  setBottlesMin: (n: number | undefined) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6">
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              Type
            </label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="w-full h-11 rounded-lg border-[#d9d9d9]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-[#363636] mb-1">
              Min Bottles Sent
            </label>
            <Input
              type="number"
              className="h-11 rounded-lg border-[#d9d9d9]"
              placeholder="e.g. 10"
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
        </div>
        <SheetFooter className="mt-8 flex flex-col gap-2">
          <Button
            className="w-full h-11 rounded-lg bg-[#363636] text-white hover:opacity-90 transition-opacity"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
          <Button
            variant="ghost"
            className="w-full h-11 text-[#737373] hover:text-[#363636]"
            onClick={() => {
              setType("All");
              setBottlesMin(undefined);
            }}
          >
            Reset Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
