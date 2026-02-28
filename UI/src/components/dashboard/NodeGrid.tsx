"use client";

import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { NodeCard } from "./NodeCard";
import type { Node } from "@/types";

interface NodeGridProps {
  nodes: Node[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      autoAnimate(gridRef.current);
    }
  }, []);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {nodes.map((node, index) => (
        <NodeCard key={node.id} node={node} index={index} />
      ))}
    </div>
  );
}