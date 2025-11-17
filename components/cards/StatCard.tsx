import Image from "next/image";

type Props = {
  title: string;
  value: string;
  trendIcon: "/assets/figma/trending-up.svg" | "/assets/figma/trending-down.svg";
  trendText: string;
};

export function StatCard({ title, value, trendIcon, trendText }: Props) {
  return (
    <div className="rounded-2xl border border-[#737373]/50 p-4">
      <p className="text-[16px] font-medium text-[#737373]">{title}</p>
      <p className="text-[40px] font-semibold leading-none text-[#363636]">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <Image src={trendIcon} alt="trend" width={24} height={24} />
        <span className="text-[16px] font-medium text-[#363636]">{trendText}</span>
      </div>
    </div>
  );
}