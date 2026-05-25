import {
  BarChart3,
  Bot,
  Bug,
  Cloud,
  DatabaseZap,
  Gauge,
  Newspaper,
  RadioTower,
  Settings,
  ShieldAlert,
  Skull,
  Siren,
} from "lucide-react";

export const navItems = [
  { path: "/dashboard", key: "dashboard", icon: Gauge },
  { path: "/vulnerabilities", key: "vulnerabilities", icon: Bug },
  { path: "/news", key: "cyberNews", icon: Newspaper },
  { path: "/trends", key: "trends", icon: BarChart3 },
  { path: "/sources", key: "sources", icon: RadioTower },
  { path: "/kev", key: "kev", icon: ShieldAlert },
  { path: "/zero-day", key: "zeroDay", icon: Siren },
  { path: "/ransomware", key: "ransomware", icon: Skull },
  { path: "/cloud-security", key: "cloudSecurity", icon: Cloud },
  { path: "/ai-security", key: "aiSecurity", icon: Bot },
  { path: "/supply-chain", key: "supplyChain", icon: DatabaseZap },
  { path: "/settings", key: "settings", icon: Settings },
] as const;
