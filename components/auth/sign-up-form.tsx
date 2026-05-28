"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signUpAction } from "@/actions/auth";
import { signUpSchema, type SignUpValues } from "@/schemas/auth";

const defaultValues: SignUpValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    setSubmitMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("fullName", values.fullName);
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("confirmPassword", values.confirmPassword);

      const response = await signUpAction(
        { success: false, message: "" },
        formData
      );

      if (response?.message) {
        setSubmitMessage(response.message);
        toast(response.message);
      }
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
          <UserRound className="h-3.5 w-3.5" />
          Tạo tài khoản
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight">Bắt đầu tạo CV của bạn</h2>
        <p className="text-sm text-muted-foreground">Thiết lập hồ sơ và có ngay không gian làm việc sẵn cho AI.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input id="fullName" placeholder="Họ và tên của bạn" {...form.register("fullName")} />
        {form.formState.errors.fullName ? (
          <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" type="email" placeholder="ban@example.com" className="pl-10" {...form.register("email")} />
        </div>
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input id="password" type="password" placeholder="Tạo mật khẩu mạnh" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword ? (
          <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {submitMessage ? <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{submitMessage}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}