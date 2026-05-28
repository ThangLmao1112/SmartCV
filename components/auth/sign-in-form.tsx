"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInAction } from "@/actions/auth";
import { signInSchema, type SignInValues } from "@/schemas/auth";

const defaultValues: SignInValues = {
  email: "",
  password: "",
};

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    setSubmitError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", values.email);
      formData.set("password", values.password);

      const response = await signInAction(
        { success: false, message: "" },
        formData
      );

      if (response?.success === false) {
        setSubmitError(response.message);
        toast.error(response.message);
      }
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Đăng nhập an toàn
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight">Chào mừng trở lại</h2>
        <p className="text-sm text-muted-foreground">Tiếp tục tới bảng điều khiển CV của bạn.</p>
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
        <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {submitError ? <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{submitError}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button type="button" variant="outline" className="w-full">
        <Sparkles className="h-4 w-4" />
        Tiếp tục với Google
      </Button>
    </form>
  );
}