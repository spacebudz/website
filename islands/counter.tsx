"use client";

import type { Signal } from "@preact/signals";
import { Button } from "@/components/ui/button/mod.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div className="flex gap-8 py-6">
      <Button onClick={() => props.count.value -= 1} variant="secondary">
        -1
      </Button>
      <p className="text-3xl tabular-nums">{props.count.value}</p>
      <Button onClick={() => props.count.value += 1} variant="secondary">
        +1
      </Button>
    </div>
  );
}
