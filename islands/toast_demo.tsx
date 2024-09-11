"use client";

import { useToast } from "@/islands/hooks/use_toast.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import { ToastAction } from "@/islands/ui/toast/mod.tsx";

export function ToastDemo() {
    const { toast } = useToast();

    return (
        <Button
            variant="outline"
            onClick={() => {
                toast({
                    title: "Toaster message",
                    description: "Hey you clicked me!",
                    action: (
                        <ToastAction altText="undo">
                            Undo
                        </ToastAction>
                    ),
                });
            }}
        >
            Toast me
        </Button>
    );
}
