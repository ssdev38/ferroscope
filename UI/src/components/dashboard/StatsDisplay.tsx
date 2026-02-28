"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Cpu, HardDrive, Server } from "lucide-react";

interface StatsDisplayProps {
  totalNodes: number;
  averageCPU: number;
  totalRAM: { used: number; total: number };
}

export function StatsDisplay({ totalNodes, averageCPU, totalRAM }: StatsDisplayProps) {
  const stats = [
    {
      label: "Total Nodes",
      value: totalNodes.toString(),
      icon: Server,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Average CPU",
      value: `${averageCPU.toFixed(1)}%`,
      icon: Cpu,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Total RAM",
      value: `${totalRAM.used.toFixed(1)}/${totalRAM.total.toFixed(1)} GiB`,
      icon: HardDrive,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "System Status",
      value: "Operational",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}