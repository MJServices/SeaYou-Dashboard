"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUserAction, blockUserAction, unblockUserAction } from "@/lib/actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal, ChevronLeft, Loader2 } from "lucide-react";
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
  department: string | null;
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
  is_active: boolean;
  photos?: string[];
};

export function UserProfileSheet({
  userEmail,
  open,
  onOpenChange,
  onUserDeleted,
}: {
  userEmail: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted?: (email: string) => void;
}) {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [showConfirmUnblock, setShowConfirmUnblock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Profile");
  const vt = useTranslations("Values");

  const translateValue = (val: string | null | undefined) => {
    if (!val) return t("notSpecified");
    
    // Handle comma-separated lists (common in DB for multi-choice fields)
    if (val.includes(",")) {
      return val
        .split(",")
        .map((part) => {
          const trimmed = part.trim();
          return vt.has(trimmed) ? vt(trimmed) : trimmed;
        })
        .join(", ");
    }

    // Only translate if the key exists in our Values dictionary
    if (vt.has(val)) {
      return vt(val);
    }
    return val;
  };

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

  async function handleBlockUser() {
    if (!profile) return;
    
    setIsBlocking(true);
    setShowConfirmBlock(false);
    try {
      const result = await blockUserAction(profile.id);
      if (!result.success) throw new Error(result.error);

      alert(t("blockSuccess"));
      // update local profile state so UI reflects it's blocked immediately if needed
      setProfile({ ...profile, is_active: false });
      router.refresh();
    } catch (err: any) {
      console.error("Erreur lors du blocage de l'utilisateur:", err);
      alert(err.message || t("error"));
    } finally {
      setIsBlocking(false);
    }
  }

  async function handleUnblockUser() {
    if (!profile) return;
    
    setIsBlocking(true);
    setShowConfirmUnblock(false);
    try {
      const result = await unblockUserAction(profile.id);
      if (!result.success) throw new Error(result.error);

      alert(t("unblockSuccess"));
      setProfile({ ...profile, is_active: true });
      router.refresh();
    } catch (err: any) {
      console.error("Erreur lors du déblocage de l'utilisateur:", err);
      alert(err.message || t("error"));
    } finally {
      setIsBlocking(false);
    }
  }

  async function handleDeleteUser() {
    if (!profile) return;
    
    setIsDeleting(true);
    setShowConfirmDelete(false);
    try {
      const result = await deleteUserAction(profile.id);

      if (!result.success) throw new Error(result.error);

      alert(t("deleteSuccess"));
      if (onUserDeleted && profile.email) {
        onUserDeleted(profile.email);
      }
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      alert(err.message || t("error"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto p-0" suppressHydrationWarning>
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
                    <DropdownMenuItem
                      className="text-orange-600 font-medium cursor-pointer flex items-center gap-2"
                      onClick={profile.is_active === false ? handleUnblockUser : handleBlockUser}
                      disabled={isBlocking || isDeleting}
                    >
                      {isBlocking && <Loader2 className="w-4 h-4 animate-spin" />}
                      {profile.is_active === false ? t("unblockUser") : t("blockUser")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 font-medium cursor-pointer flex items-center gap-2"
                      onClick={handleDeleteUser}
                      disabled={isBlocking || isDeleting}
                    >
                      {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {t("deleteUser")}
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
              <div className="flex justify-end pr-4 py-3 border-b border-gray-50 bg-gray-50/50 rounded-lg mx-6">
                <div className="flex items-center gap-4">
                  {/* Block/Unblock Section */}
                  {profile.is_active !== false ? (
                    !showConfirmBlock ? (
                      <Button
                        variant="ghost"
                        className="text-orange-500 font-bold hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
                        onClick={() => setShowConfirmBlock(true)}
                        disabled={isBlocking || isDeleting}
                      >
                        {isBlocking && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("blockUser")}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 scale-in-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 font-medium hover:bg-gray-100"
                          onClick={() => setShowConfirmBlock(false)}
                          disabled={isBlocking}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="font-bold flex items-center gap-2 shadow-sm bg-orange-500 hover:bg-orange-600"
                          onClick={handleBlockUser}
                          disabled={isBlocking}
                        >
                          {isBlocking ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-[12px]">{t("confirmBlock")}</span>
                          )}
                        </Button>
                      </div>
                    )
                  ) : (
                    !showConfirmUnblock ? (
                      <Button
                        variant="ghost"
                        className="text-green-600 font-bold hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
                        onClick={() => setShowConfirmUnblock(true)}
                        disabled={isBlocking || isDeleting}
                      >
                        {isBlocking && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("unblockUser")}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 scale-in-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 font-medium hover:bg-gray-100"
                          onClick={() => setShowConfirmUnblock(false)}
                          disabled={isBlocking}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="font-bold flex items-center gap-2 shadow-sm bg-green-600 hover:bg-green-700"
                          onClick={handleUnblockUser}
                          disabled={isBlocking}
                        >
                          {isBlocking ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-[12px]">{t("confirmUnblock")}</span>
                          )}
                        </Button>
                      </div>
                    )
                  )}

                  <div className="w-px h-6 bg-gray-200"></div>

                  {/* Delete Section */}
                  {!showConfirmDelete ? (
                    <Button
                      variant="ghost"
                      className="text-red-500 font-bold hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                      onClick={() => setShowConfirmDelete(true)}
                      disabled={isBlocking || isDeleting}
                    >
                      {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {t("deleteUser")}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 scale-in-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 font-medium hover:bg-gray-100"
                        onClick={() => setShowConfirmDelete(false)}
                        disabled={isDeleting}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="font-bold flex items-center gap-2 shadow-sm"
                        onClick={handleDeleteUser}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="text-[12px]">{t("confirmDelete")}</span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("lookingFor")}
                </h3>
                <p className="text-[18px] font-semibold">
                  {translateValue(profile.expectation)}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-gray-400">
                  {t("fantasy")}
                </h3>
                <p className="text-[18px] font-semibold">
                  {translateValue(profile.secret_desire)}
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
                    Votre navigateur ne prend pas en charge l'élément audio.
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
                    {t("department")}
                  </h3>
                  <p className="text-[18px] font-semibold">
                    {profile.department || t("na")}
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
                    ? profile.sexual_orientation.map(so => translateValue(so)).join("  ·  ")
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
                        {translateValue(interest)}
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
