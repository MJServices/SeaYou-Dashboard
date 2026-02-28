"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

type ProfileDetails = {
  id: string;
  full_name: string | null;
  email: string;
  age: number | null;
  city: string | null;
  about: string | null;
  expectation: string | null;
  interests: string[] | null;
  sexual_orientation: string[] | null;
  avatar_url: string | null;
  total_bottles_sent: number | null;
  total_bottles_received: number | null;
  secret_quote: string | null;
  secret_desire: string | null;
  secret_audio_url: string | null;
  photos?: string[];
};

export function UserProfileSheet({
  userEmail,
  open,
  onOpenChange,
}: {
  userEmail: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Profile");

  useEffect(() => {
    if (open && userEmail) {
      fetchProfile(userEmail);
    } else if (!open) {
      // Clear data when closing for fresh feel next time
      setProfile(null);
      setError(null);
    }
  }, [open, userEmail]);

  async function fetchProfile(email: string) {
    setLoading(true);
    setError(null);
    try {
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .limit(1);

      if (pError) throw pError;

      if (profiles && profiles.length > 0) {
        const p = profiles[0] as any;

        // Fetch real photos from storage
        const { data: files, error: sError } = await supabase.storage
          .from("face_photos")
          .list(p.id);

        if (sError) console.error("Storage error:", sError);

        const photos = files
          ? files.map(
              (f) =>
                `https://nenugkyvcewatuddrwvf.supabase.co/storage/v1/object/public/face_photos/${p.id}/${f.name}`,
            )
          : [];

        setProfile({ ...p, photos });
      } else {
        setError(t("notFound"));
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || t("notFound"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto p-0">
        <div className="sr-only">
          <SheetHeader>
            <SheetTitle>{t("details")}</SheetTitle>
          </SheetHeader>
        </div>
        {loading ? (
          <div className="flex flex-col h-full bg-white px-6 py-6 space-y-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-4">
            <p className="text-red-500 font-medium">{error}</p>
            <Button
              onClick={() => userEmail && fetchProfile(userEmail)}
              variant="outline"
            >
              {t("retry")}
            </Button>
          </div>
        ) : profile ? (
          <div className="flex flex-col h-full bg-white text-[#363636]">
            {/* Header */}
            <SheetHeader className="px-6 py-6 sticky top-0 bg-white z-10 border-b border-gray-50 flex-row items-center justify-between space-y-0">
              <button
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1 text-[#363636] hover:opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
                <SheetTitle className="font-semibold text-[18px]">
                  #{profile.id.substring(0, 8).toUpperCase()}
                </SheetTitle>
              </button>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5 text-[#363636]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600 font-medium cursor-pointer">
                      {t("blockUser")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetHeader>

            <div className="px-6 py-4 space-y-8 pb-20">
              {/* Avatar, Name & Email */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={
                      profile.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                    }
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className="text-[24px] font-bold tracking-tight">
                    {profile.full_name || t("unknown")}
                  </h2>
                  <p className="text-[#363636] text-[16px]">{profile.email}</p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex justify-end pr-4 -mt-10">
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    className="text-red-500 font-bold hover:bg-red-50 hover:text-red-600"
                  >
                    {t("blockUser")}
                  </Button>
                </div>
              </div>

              {/* Looking for */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("lookingFor")}
                </h3>
                <p className="text-[18px] font-semibold">
                  {profile.expectation || t("notSpecified")}
                </p>
              </div>

              {/* Fantasy */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("fantasy")}
                </h3>
                <p className="text-[18px] font-semibold">
                  {profile.secret_desire || t("notSpecified")}
                </p>
              </div>

              {/* Quote */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("quote")}
                </h3>
                <p className="text-[18px] font-semibold">
                  {profile.secret_quote || t("notSpecified")}
                </p>
              </div>

              {/* Voice Message placeholder */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("voiceMessage")}
                </h3>
                {profile.secret_audio_url ? (
                  <audio controls className="w-full h-10 mt-1">
                    <source src={profile.secret_audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-[18px] font-semibold text-gray-400 italic">
                    {t("notSpecified")}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-y-6">
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-gray-400">
                    {t("age")}
                  </h3>
                  <p className="text-[18px] font-semibold">
                    {profile.age || t("na")}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-gray-400">
                    {t("city")}
                  </h3>
                  <p className="text-[18px] font-semibold">
                    {profile.city || t("na")}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-gray-400">
                    {t("bottlesReceived")}
                  </h3>
                  <p className="text-[18px] font-semibold">
                    {profile.total_bottles_received || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-gray-400">
                    {t("bottlesSent")}
                  </h3>
                  <p className="text-[18px] font-semibold">
                    {profile.total_bottles_sent || 0}
                  </p>
                </div>
              </div>

              {/* Sexual Orientation Tags */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("sexualOrientation")}
                </h3>
                <div className="flex flex-wrap gap-4 text-[16px] font-semibold text-[#363636]">
                  {profile.sexual_orientation?.length
                    ? profile.sexual_orientation.join("  ·  ")
                    : t("notSpecified")}
                </div>
              </div>

              {/* Interests Tags */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("interest")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.length ? (
                    profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-4 py-2 bg-[#00BCD4] text-white rounded-full text-[14px] font-semibold"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#363636] italic text-sm">
                      {t("noInterests")}
                    </span>
                  )}
                </div>
              </div>

              {/* Pictures Uploaded Gallery */}
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("picturesUploaded")}
                </h3>
                {profile.photos && profile.photos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {profile.photos.map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity border border-gray-100"
                        >
                          <Image
                            src={url}
                            alt={`Uploaded pic ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[14px] text-gray-400 italic">
                    {t("noPictures")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            {t("notFound")}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
