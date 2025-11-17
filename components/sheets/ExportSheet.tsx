"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function ExportSheet({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; onConfirm: () => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Export Users</SheetTitle>
        </SheetHeader>
        <div className="mt-4 text-[#363636]">CSV export of filtered users.</div>
        <SheetFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Export</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}