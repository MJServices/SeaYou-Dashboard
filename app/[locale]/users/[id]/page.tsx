import Image from "next/image";
import { Shell } from "@/components/layout/Shell";

type Props = { params: { id: string } };

export default function UserDetail({ params }: Props) {
  const id = decodeURIComponent(params.id);
  return (
    <Shell title="User Profile">
      <div className="rounded-2xl border border-[#d9d9d9] p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#e5e5e5]" />
          <div>
            <h2 className="text-[24px] font-semibold text-[#363636]">{id}</h2>
            <p className="text-[16px] font-medium text-[#737373]">Email: example@domain.com</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#d9d9d9] p-4">
            <p className="text-[16px] font-medium text-[#363636]">Bottles Sent</p>
            <p className="text-[24px] font-semibold text-[#363636]">23</p>
          </div>
          <div className="rounded-xl border border-[#d9d9d9] p-4">
            <p className="text-[16px] font-medium text-[#363636]">Type</p>
            <p className="text-[24px] font-semibold text-[#363636]">Basic</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}