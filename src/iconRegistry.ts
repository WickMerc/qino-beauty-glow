// =====================================================================
// QINO — Icon Registry
// Maps abstract iconKey strings (used in mock data) to lucide components.
// Keeping data icon-library-agnostic means we can swap libraries later.
// =====================================================================

import {
  Activity, Camera, ChevronRight, Clock, Droplet, Eye, Flame,
  Gem, Heart, Home, Layers, Lightbulb, Lock, Minus, MessageCircle,
  MessageSquare, Moon, Pencil, Scan, Scissors, Send, Sparkle,
  Sparkles, Stethoscope, Sun, Syringe, User, Zap, Beaker,
  BarChart3, Plus, ArrowRight, ArrowUpRight, Check, X, Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconRegistry: Record<string, LucideIcon> = {
  activity: Activity,
  camera: Camera,
  "chevron-right": ChevronRight,
  clock: Clock,
  droplet: Droplet,
  eye: Eye,
  flame: Flame,
  gem: Gem,
  heart: Heart,
  home: Home,
  layers: Layers,
  lightbulb: Lightbulb,
  lock: Lock,
  minus: Minus,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  moon: Moon,
  pencil: Pencil,
  scan: Scan,
  scissors: Scissors,
  send: Send,
  sparkle: Sparkle,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  sun: Sun,
  syringe: Syringe,
  user: User,
  zap: Zap,
  beaker: Beaker,
  "bar-chart-3": BarChart3,
  plus: Plus,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  check: Check,
  x: X,
  bell: Bell,
};

/**
 * Returns the icon component for a given key, falling back to Sparkle.
 * Components should call this rather than reading the registry directly.
 */
export const getIcon = (key?: string): LucideIcon => {
  if (!key) return Sparkle;
  return iconRegistry[key] ?? Sparkle;
};
