"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Save, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { saveProfileAction } from "@/actions/profile";
import { profileSchema, type ProfileValues } from "@/schemas/profile";
import type { z } from "zod";

type ProfileFormProps = {
  defaultValues: ProfileValues;
  avatarUrl: string | null;
  fullName: string | null;
};

type ProfileFormInput = ProfileValues;
type ProfileFormSchemaInput = z.input<typeof profileSchema>;

export function ProfileForm({ defaultValues, avatarUrl, fullName }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const form = useForm<ProfileFormSchemaInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    setSubmitMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("fullName", values.fullName);
      formData.set("headline", values.headline ?? "");
      formData.set("bio", values.bio ?? "");
      formData.set("website", values.website ?? "");
      formData.set("location", values.location ?? "");
      formData.set("phone", values.phone ?? "");
      formData.set("desiredRole", values.desiredRole ?? "");

      if (avatarFile) {
        formData.set("avatar", avatarFile);
      }

      const response = await saveProfileAction({ success: false, message: "" }, formData);
      if (response.message) {
        setSubmitMessage(response.message);
        toast(response.message);
      }
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="border-border/80 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
            <UserCircle2 className="h-3.5 w-3.5" />
            Hồ sơ
          </Badge>
          <CardTitle>Ảnh hồ sơ</CardTitle>
          <CardDescription>Tải ảnh đại diện chuyên nghiệp cho CV và bảng điều khiển.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-border/70 bg-secondary/40">
              {avatarPreview ? (
                <img src={avatarPreview} alt={fullName ?? "Avatar"} className="h-full w-full object-cover" />
              ) : (
                <UserCircle2 className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-medium">{fullName ?? "Your profile"}</p>
              <p className="text-sm text-muted-foreground">PNG, JPG hoặc WEBP. Nên rõ nét và chuyên nghiệp.</p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                <Camera className="h-4 w-4" />
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setAvatarPreview(URL.createObjectURL(file));
                      setAvatarFile(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Ảnh tải lên được lưu trong Supabase Storage ở bucket `avatars` và ghi nhận vào `uploaded_files`.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-xl shadow-primary/5">
        <CardHeader>
          <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
            <Save className="h-3.5 w-3.5" />
            Chỉnh sửa hồ sơ
          </Badge>
          <CardTitle>Thông tin nghề nghiệp</CardTitle>
          <CardDescription>Các trường này dùng cho dashboard, CV mặc định và hồ sơ công khai sau này.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Tiêu đề</Label>
              <Input id="headline" placeholder="Frontend Engineer" {...form.register("headline")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredRole">Vị trí mong muốn</Label>
              <Input id="desiredRole" placeholder="Product Engineer" {...form.register("desiredRole")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea id="bio" placeholder="Tóm tắt ngắn về chuyên môn" {...form.register("bio")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://your-site.com" {...form.register("website")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="+84 ..." {...form.register("phone")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm</Label>
              <Input id="location" placeholder="Thành phố Hồ Chí Minh, Việt Nam" {...form.register("location")} />
            </div>

            {submitMessage ? <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{submitMessage}</p> : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? "Đang lưu..." : "Lưu hồ sơ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}