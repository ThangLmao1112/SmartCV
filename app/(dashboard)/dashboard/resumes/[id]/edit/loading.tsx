import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeEditorLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
      <Skeleton className="h-[900px] w-full rounded-[2rem]" />
    </div>
  );
}