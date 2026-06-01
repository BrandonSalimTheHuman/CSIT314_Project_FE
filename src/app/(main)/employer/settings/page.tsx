"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Pencil, Phone, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CompanyPictureUpload, ProfilePictureUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// ── mock data ─────────────────────────────────────────────────────────────────

const MOCK_EMPLOYER = {
  fullName: "Sarah Johnson",
  email: "sarah.johnson@techcorp.com",
  phoneNumber: "+1 (555) 234-5678",
  companyName: "TechCorp Solutions",
  companyInformation:
    "TechCorp Solutions is a forward-thinking technology company specializing in enterprise software development and digital transformation. Founded in 2010, we have grown to over 500 employees across 12 offices worldwide. We are committed to building innovative products that help businesses scale efficiently.",
  companyWebsite: "https://techcorp.com",
  profilePicture: null as File | null,
  companyPicture: null as File | null,
};

// ── schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  companyName: z.string().min(1, "Company name is required."),
  companyInformation: z.string().min(1, "Company information is required."),
  companyWebsite: z.string().optional(),
  profilePicture: z.any().optional(),
  companyPicture: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

// ── component ─────────────────────────────────────────────────────────────────

export default function EmployerSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_EMPLOYER);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      companyName: profile.companyName,
      companyInformation: profile.companyInformation,
      companyWebsite: profile.companyWebsite,
      profilePicture: undefined,
      companyPicture: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    setProfile((prev) => ({
      ...prev,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      companyInformation: data.companyInformation,
      companyWebsite: data.companyWebsite ?? prev.companyWebsite,
      profilePicture: data.profilePicture ?? prev.profilePicture,
      companyPicture: data.companyPicture ?? prev.companyPicture,
    }));
    setIsEditing(false);
    toast.success("Profile updated successfully.");
  };

  const handleCancel = () => {
    form.reset({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      companyName: profile.companyName,
      companyInformation: profile.companyInformation,
      companyWebsite: profile.companyWebsite,
      profilePicture: undefined,
      companyPicture: undefined,
    });
    setIsEditing(false);
  };

  // ── view mode ───────────────────────────────────────────────────────────────

  if (!isEditing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          {/* Banner */}
          <div className="h-36 bg-gradient-to-r from-blue-600 to-blue-400" />

          {/* Avatar + name row */}
          <div className="px-6 pb-6 sm:px-8">
            {/* Avatar row — only the avatar overlaps the banner */}
            <div className="flex items-start justify-between">
              <div className="-mt-12">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-muted shadow">
                  {profile.profilePicture ? (
                    // biome-ignore lint/performance/noImgElement: blob URL from createObjectURL
                    <img
                      src={URL.createObjectURL(profile.profilePicture)}
                      alt={profile.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="size-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Button variant="outline" className="mt-3 gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="size-4" />
                Edit Profile
              </Button>
            </div>

            {/* Name — below banner in normal flow */}
            <div className="mt-3">
              <h1 className="font-bold text-2xl">{profile.fullName}</h1>
              <p className="text-muted-foreground">{profile.companyName}</p>
            </div>

            {/* Contact chips */}
            <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1.5">
                <Phone className="size-4 text-blue-500" />
                {profile.phoneNumber}
              </span>
              {profile.companyWebsite && (
                <a
                  href={profile.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground hover:underline"
                >
                  <Globe className="size-4 text-blue-500" />
                  {profile.companyWebsite.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Company info */}
        <div className="mt-6 rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-3 font-semibold text-lg">About Company</h2>
          <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-7">{profile.companyInformation}</p>
        </div>

        {/* Company picture */}
        {profile.companyPicture && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-sm">
            {/* biome-ignore lint/performance/noImgElement: blob URL from createObjectURL */}
            <img src={URL.createObjectURL(profile.companyPicture)} alt="Company" className="h-56 w-full object-cover" />
          </div>
        )}
      </div>
    );
  }

  // ── edit mode ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Edit Profile</h1>
          <p className="text-muted-foreground text-sm">Update your employer information</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="size-5" />
        </Button>
      </div>

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* Profile picture */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Profile Picture</h2>
          <Controller
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <ProfilePictureUpload
                id="settings-profile-picture"
                value={field.value}
                onChange={field.onChange}
                className="mx-auto max-w-[200px]"
              />
            )}
          />
        </div>

        {/* Basic info */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-full-name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="settings-full-name"
                    placeholder="Your full name"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-phone">Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id="settings-phone"
                    placeholder="+1 (555) 000-0000"
                    className="py-6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Company info */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Company Information</h2>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="companyName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-company-name">Company Name</FieldLabel>
                    <Input
                      {...field}
                      id="settings-company-name"
                      placeholder="Your company name"
                      className="py-6"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="companyWebsite"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-company-website">
                      Company Website <span className="font-normal text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="settings-company-website"
                      placeholder="https://company.com"
                      className="py-6"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="companyInformation"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-company-info">About Company</FieldLabel>
                  <Textarea
                    {...field}
                    id="settings-company-info"
                    placeholder="Describe your company…"
                    rows={5}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>

        {/* Company picture */}
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-semibold text-base">Company Picture</h2>
          <Controller
            control={form.control}
            name="companyPicture"
            render={({ field }) => (
              <CompanyPictureUpload id="settings-company-picture" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="px-8">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
