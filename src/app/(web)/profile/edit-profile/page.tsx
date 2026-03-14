"use client";

import Image from "next/image";
import { Pencil, Save, X } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import PasswordChangeModal from "./_components/PasswordChangeModal";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  avatar: string;
  // bio?: string;     // uncomment if you want to support bio editing
};

export default function MyProfileSection() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    avatar: "",
  });

  // Fetch profile
  useEffect(() => {
    if (status !== "authenticated" || !token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !json.data) {
          throw new Error(json.message || "Failed to load profile data");
        }

        const user = json.data;

        const mapped: ProfileFormData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: user.gender || "",
          address: user.address || "",
          avatar: user.profilePicture || "/profile.jpg",
        };

        setProfile(mapped);
        setFormData(mapped);
        //eslint-disable-next-line
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Could not load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [status, token]);

  const handleEdit = () => {
    if (!profile) return;
    setFormData({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!token || !formData || saving) return;

    // Optional: basic client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
        gender: formData.gender || undefined,
        address: formData.address.trim() || undefined,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update profile (${res.status})`);
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Profile update failed");
      }

      // Update local state
      setProfile({ ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully");
      //eslint-disable-next-line
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!token || uploadingPhoto) return;

    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: basic file validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingPhoto(true);

    try {
      const form = new FormData();
      form.append("profilePicture", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Upload failed (${res.status})`);
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Photo update failed");
      }

      const newAvatar = json.data?.profilePicture || "";

      if (newAvatar) {
        setProfile((prev) => (prev ? { ...prev, avatar: newAvatar } : prev));
        setFormData((prev) => ({ ...prev, avatar: newAvatar }));
        toast.success("Profile photo updated");
      }
      //eslint-disable-next-line
    } catch (err: any) {
      console.error("Photo upload error:", err);
      toast.error(err.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (status === "loading" || loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="py-20 text-center text-red-600 font-medium">
        {error || "Failed to load profile. Please try again later."}
      </div>
    );
  }

  const currentData = isEditing ? formData : profile;
  const displayName =
    [currentData.firstName, currentData.lastName].filter(Boolean).join(" ") || "—";

  return (
    <section className="w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-[32px] font-semibold leading-tight text-[#253C67] sm:text-[42px] lg:text-[48px]">
            My profile
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="group relative h-16 w-16 overflow-hidden rounded-full sm:h-[120px] sm:w-[120px]">
              <Image
                src={currentData.avatar}
                alt="Profile picture"
                width={120}
                height={120}
                className="object-cover w-full h-full"
                unoptimized={currentData.avatar.includes("http")} // for external URLs
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto || saving}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-40"
                    aria-label="Change profile photo"
                  >
                    {uploadingPhoto ? (
                      <span className="text-xs font-medium">Uploading...</span>
                    ) : (
                      <Pencil className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#222] sm:text-[24px]">
                {displayName}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              disabled={saving || uploadingPhoto}
              className="h-[46px] rounded-md border border-[#9b9b9b] bg-transparent px-5 text-sm font-medium text-[#5f5f5f] transition hover:bg-white disabled:opacity-50 sm:min-w-[160px]"
            >
              Change Password
            </button>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                disabled={saving || uploadingPhoto}
                className="flex h-[46px] items-center justify-center gap-2 rounded-md bg-[#1239e6] px-5 text-sm font-medium text-white transition hover:bg-[#0f31c9] disabled:opacity-60 sm:min-w-[160px]"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex h-[46px] items-center justify-center gap-2 rounded-md border border-[#1239e6] px-5 text-sm font-medium text-[#1239e6] hover:bg-[#eef2ff] disabled:opacity-50 sm:min-w-[140px]"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-[46px] items-center justify-center gap-2 rounded-md bg-[#1239e6] px-5 text-sm font-medium text-white transition hover:bg-[#0f31c9] disabled:opacity-60 sm:min-w-[160px]"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          <ProfileField
            label="First Name"
            value={currentData.firstName}
            isEditing={isEditing}
            onChange={(v) => handleChange("firstName", v)}
            disabled={saving}
          />
          <ProfileField
            label="Last Name"
            value={currentData.lastName}
            isEditing={isEditing}
            onChange={(v) => handleChange("lastName", v)}
            disabled={saving}
          />
          <ProfileField
            label="Email"
            type="email"
            value={currentData.email}
            isEditing={isEditing}
            readOnly
            disabled onChange={function (): void {
              throw new Error("Function not implemented.");
            } }          />
          <ProfileField
            label="Phone Number"
            value={currentData.phoneNumber}
            isEditing={isEditing}
            onChange={(v) => handleChange("phoneNumber", v)}
            disabled={saving}
          />
          <ProfileField
            label="Date of Birth"
            type="date"
            value={currentData.dateOfBirth}
            isEditing={isEditing}
            onChange={(v) => handleChange("dateOfBirth", v)}
            disabled={saving}
          />
          <ProfileField
            label="Gender"
            value={currentData.gender}
            isEditing={isEditing}
            onChange={(v) => handleChange("gender", v)}
            disabled={saving}
          />
          <div className="sm:col-span-2">
            <ProfileField
              label="Address"
              value={currentData.address}
              isEditing={isEditing}
              onChange={(v) => handleChange("address", v)}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </section>
  );
}

// ────────────────────────────────────────────────
//                SKELETON
// ────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16 animate-pulse">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="h-12 w-64 mx-auto bg-gray-200 rounded-xl" />

        <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 sm:h-[120px] sm:w-[120px] rounded-full bg-gray-200" />
            <div className="h-8 w-48 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-[46px] w-40 bg-gray-200 rounded-md" />
            <div className="h-[46px] w-40 bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={i === 6 ? "sm:col-span-2" : ""}>
                <div className="mb-2 h-5 w-32 bg-gray-200 rounded" />
                <div className="h-[50px] w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────
//                PROFILE FIELD
// ────────────────────────────────────────────────
type ProfileFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
};

function ProfileField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
}: ProfileFieldProps) {
  const isReadOnly = readOnly || !isEditing;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#7b7b7b] sm:text-[15px]">
        {label}
      </label>

      {isReadOnly ? (
        <div className="flex min-h-[50px] w-full items-center rounded-[4px] border border-[#dddddd] bg-gray-50/50 px-4 text-[15px] text-[#222]">
          {value || "—"}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`h-[50px] w-full rounded-[4px] border border-[#dddddd] bg-white px-4 text-[15px] text-[#222] outline-none transition focus:border-[#1239e6] ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      )}
    </div>
  );
}