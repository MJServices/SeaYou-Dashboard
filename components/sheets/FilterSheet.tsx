"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterSheet({ open, onOpenChange, type, setType, bottlesMin, setBottlesMin }: { open: boolean; onOpenChange: (v: boolean) => void; type: "All" | "Basic" | "Premium"; setType: (t: "All" | "Basic" | "Premium") => void; bottlesMin: number | undefined; setBottlesMin: (n: number | undefined) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#363636]">Type</label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#363636]">Min Bottles Sent</label>
            <Input type="number" className="mt-1" value={bottlesMin ?? ""} onChange={(e) => setBottlesMin(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
        <SheetFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}