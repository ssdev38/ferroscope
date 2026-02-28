"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "@/lib/api";
import { parseRAM } from "@/lib/utils";
import type { Node, CPUData, RAMData } from "@/types";
import { useRouter } from "next/navigation";


interface NodeCardProps {
  node: Node;
  index: number;
}

export function NodeCard({ node, index }: NodeCardProps) {
  const [cpuData, setCpuData] = useState<CPUData | null>(null);
  const [ramData, setRamData] = useState<RAMData | null>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [node.id]);

  const fetchData = async () => {
    try {
      const [cpu, ram] = await Promise.all([
        api.getLatestCPU(node.id),
        api.getLatestRAM(node.id),
      ]);
      setCpuData(cpu);
      setRamData(ram);
    } catch (error) {
      console.error("Error fetching node data:", error);
    } finally {
      setLoading(false);
    }
  };

  const ramUsagePercent = ramData
    ? ((parseRAM(ramData.total) - parseRAM(ramData.free)) /
        parseRAM(ramData.total)) *
      100
    : 0;

  const cpuStatus = cpuData?.cpu ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card 
      onClick={() => router.push(`/nodes/${node.id}`)}
      className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{node.name}</CardTitle>
            <Badge variant={cpuStatus > 80 ? "destructive" : "secondary"}>
              {cpuStatus > 80 ? "High Load" : "Normal"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="font-medium">CPU Usage</span>
              </div>
              <span className="font-bold">
                {(cpuData?.cpu ?? 0).toFixed(1)}%
              </span>
            </div>
            <Progress value={cpuData?.cpu ?? 0} />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-green-500" />
                <span className="font-medium">RAM Usage</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {ramData?.free} / {ramData?.total}
              </span>
            </div>
            <Progress value={ramUsagePercent} className="h-2" />
          </motion.div>

          {cpuData && (
            <div className="flex items-center justify-center pt-2">
              {cpuStatus > 50 ? (
                <TrendingUp className="h-5 w-5 text-red-500 animate-pulse" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-500" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
