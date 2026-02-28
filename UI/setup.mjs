import fs from 'fs';
import path from 'path';

// File contents
const files = {
  '.env.local': `NEXT_PUBLIC_API_URL=http://localhost:8000`,

  'src/types/index.ts': `export interface Node {
  id: number;
  name: string;
}

export interface CPUData {
  cpu: number;
  timestamp: string;
}

export interface RAMData {
  free: string;
  total: string;
  timestamp: string;
}`,

  'src/lib/api.ts': `const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getNodes() {
    const response = await fetch(\`\${API_URL}/get_node_list\`, {
      method: 'POST',
    });
    return response.json();
  },

  async getLatestCPU(nodeId: number) {
    const response = await fetch(\`\${API_URL}/get_latest_cpu?node=\${nodeId}\`, {
      method: 'POST',
    });
    return response.json();
  },

  async getLatestRAM(nodeId: number) {
    const response = await fetch(\`\${API_URL}/get_latest_ram?node=\${nodeId}\`, {
      method: 'POST',
    });
    return response.json();
  },

  async getCPUHistory(nodeId: number) {
    const response = await fetch(\`\${API_URL}/cpu_stat?node=\${nodeId}\`, {
      method: 'POST',
    });
    return response.json();
  },

  async getRAMHistory(nodeId: number) {
    const response = await fetch(\`\${API_URL}/ram_stat?node=\${nodeId}\`, {
      method: 'POST',
    });
    return response.json();
  },
};`,

  'src/lib/utils.ts': `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRAM(ram: string): number {
  const value = parseFloat(ram);
  if (ram.includes('GiB')) return value;
  if (ram.includes('MiB')) return value / 1024;
  if (ram.includes('TiB')) return value * 1024;
  return value;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}`,

  'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }
}`,

  'src/components/providers/ThemeProvider.tsx': `"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}`,

  'src/components/dashboard/Header.tsx': `"use client";

import { motion } from "framer-motion";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ onRefresh, isLoading }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Ferroscope Monitor
            </h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={\`h-4 w-4 \${isLoading ? 'animate-spin' : ''}\`} />
            Refresh
          </Button>
        </div>
      </div>
    </motion.header>
  );
}`,

  'src/components/dashboard/NodeCard.tsx': `"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "@/lib/api";
import { parseRAM } from "@/lib/utils";
import type { Node, CPUData, RAMData } from "@/types";

interface NodeCardProps {
  node: Node;
  index: number;
}

export function NodeCard({ node, index }: NodeCardProps) {
  const [cpuData, setCpuData] = useState<CPUData | null>(null);
  const [ramData, setRamData] = useState<RAMData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [node.id]);

  const fetchData = async () => {
    try {
      const [cpu, ram] = await Promise.all([
        api.getLatestCPU(node.id),
        api.getLatestRAM(node.id)
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
    ? ((parseRAM(ramData.total) - parseRAM(ramData.free)) / parseRAM(ramData.total)) * 100
    : 0;

  const cpuStatus = cpuData?.cpu || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
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
              <span className="font-bold">{cpuData?.cpu.toFixed(1)}%</span>
            </div>
            <Progress value={cpuData?.cpu || 0} className="h-2" />
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
}`,

  'src/components/dashboard/CPUChart.tsx': `"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { formatTimestamp } from "@/lib/utils";
import type { CPUData } from "@/types";

interface CPUChartProps {
  nodeId: number;
  nodeName: string;
}

export function CPUChart({ nodeId, nodeName }: CPUChartProps) {
  const [data, setData] = useState<CPUData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [nodeId]);

  const fetchData = async () => {
    try {
      const cpuHistory = await api.getCPUHistory(nodeId);
      setData(cpuHistory);
    } catch (error) {
      console.error("Error fetching CPU history:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.map(item => ({
    time: formatTimestamp(item.timestamp),
    cpu: item.cpu,
  })).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CPU History - {nodeName}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  stroke="currentColor"
                />
                <YAxis 
                  domain={[0, 100]}
                  className="text-xs"
                  stroke="currentColor"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#cpuGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}`,

  'src/components/dashboard/RAMChart.tsx': `"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { formatTimestamp, parseRAM } from "@/lib/utils";
import type { RAMData } from "@/types";

interface RAMChartProps {
  nodeId: number;
  nodeName: string;
}

export function RAMChart({ nodeId, nodeName }: RAMChartProps) {
  const [data, setData] = useState<RAMData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [nodeId]);

  const fetchData = async () => {
    try {
      const ramHistory = await api.getRAMHistory(nodeId);
      setData(ramHistory);
    } catch (error) {
      console.error("Error fetching RAM history:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.map(item => ({
    time: formatTimestamp(item.timestamp),
    used: parseRAM(item.total) - parseRAM(item.free),
    total: parseRAM(item.total),
  })).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">RAM History - {nodeName}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  stroke="currentColor"
                />
                <YAxis 
                  className="text-xs"
                  stroke="currentColor"
                  tickFormatter={(value) => \`\${value.toFixed(1)} GiB\`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value) => [\`\${Number(value).toFixed(2)} GiB\`, "Used"]}
                />
                <Area
                  type="monotone"
                  dataKey="used"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#ramGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}`,

  'src/components/dashboard/StatsDisplay.tsx': `"use client";

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
      value: \`\${averageCPU.toFixed(1)}%\`,
      icon: Cpu,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Total RAM",
      value: \`\${totalRAM.used.toFixed(1)}/\${totalRAM.total.toFixed(1)} GiB\`,
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
                <div className={\`p-3 rounded-full \${stat.bgColor}\`}>
                  <stat.icon className={\`h-5 w-5 \${stat.color}\`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}`,

  'src/components/dashboard/NodeGrid.tsx': `"use client";

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
}`,

  'src/app/layout.tsx': `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ferroscope Monitor",
  description: "Real-time system monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}`,

  'src/app/page.tsx': `"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/dashboard/Header";
import { NodeGrid } from "@/components/dashboard/NodeGrid";
import { StatsDisplay } from "@/components/dashboard/StatsDisplay";
import { CPUChart } from "@/components/dashboard/CPUChart";
import { RAMChart } from "@/components/dashboard/RAMChart";
import { api } from "@/lib/api";
import { parseRAM } from "@/lib/utils";
import { toast } from "sonner";
import type { Node } from "@/types";

export default function DashboardPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNodes: 0,
    averageCPU: 0,
    totalRAM: { used: 0, total: 0 },
  });

  useEffect(() => {
    fetchNodes();
  }, []);

  useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0]);
    }
    calculateStats();
  }, [nodes]);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const nodeList = await api.getNodes();
      setNodes(nodeList);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error fetching nodes:", error);
      toast.error("Failed to fetch nodes");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    if (nodes.length === 0) return;

    try {
      const cpuPromises = nodes.map(node => api.getLatestCPU(node.id));
      const ramPromises = nodes.map(node => api.getLatestRAM(node.id));

      const cpuResults = await Promise.all(cpuPromises);
      const ramResults = await Promise.all(ramPromises);

      const avgCPU = cpuResults.reduce((acc, curr) => acc + curr.cpu, 0) / cpuResults.length;
      
      const totalRAMUsed = ramResults.reduce((acc, curr) => {
        return acc + (parseRAM(curr.total) - parseRAM(curr.free));
      }, 0);
      
      const totalRAMTotal = ramResults.reduce((acc, curr) => {
        return acc + parseRAM(curr.total);
      }, 0);

      setStats({
        totalNodes: nodes.length,
        averageCPU: avgCPU,
        totalRAM: { used: totalRAMUsed, total: totalRAMTotal },
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  };

  const handleRefresh = () => {
    fetchNodes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header onRefresh={handleRefresh} isLoading={loading} />
      
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <StatsDisplay 
                totalNodes={stats.totalNodes}
                averageCPU={stats.averageCPU}
                totalRAM={stats.totalRAM}
              />

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed Charts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <NodeGrid nodes={nodes} />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  {selectedNode && (
                    <>
                      <div className="mb-4">
                        <label className="text-sm font-medium">Select Node:</label>
                        <select 
                          className="ml-2 px-3 py-1 border rounded-md bg-background"
                          value={selectedNode.id}
                          onChange={(e) => {
                            const node = nodes.find(n => n.id === parseInt(e.target.value));
                            setSelectedNode(node || null);
                          }}
                        >
                          {nodes.map(node => (
                            <option key={node.id} value={node.id}>
                              {node.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CPUChart nodeId={selectedNode.id} nodeName={selectedNode.name} />
                        <RAMChart nodeId={selectedNode.id} nodeName={selectedNode.name} />
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}`,

  'src/components/ui/card.tsx': `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`,

  'src/components/ui/button.tsx': `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,

  'src/components/ui/badge.tsx': `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }`,

  'src/components/ui/progress.tsx': `"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }`,

  'src/components/ui/tabs.tsx': `"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }`
};

// Write all files
console.log('🚀 Starting file generation...\n');

Object.entries(files).forEach(([filePath, content]) => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (dir !== '.') {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error creating ${filePath}:`, error.message);
  }
});

console.log('\n🎉 All files created successfully!');
console.log('\n📋 Next steps:');
console.log('   1. Run: npm install');
console.log('   2. Run: npm run dev');
console.log('   3. Open: http://localhost:3000');