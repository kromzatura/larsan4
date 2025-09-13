import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpDown,
  Bell,
  Blocks,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDot,
  Cloud,
  Code,
  Compass,
  Cpu,
  Dribbble,
  ExternalLink,
  GitBranch,
  Github,
  Globe,
  Home,
  Infinity,
  Landmark,
  LayoutGrid,
  LayoutList,
  Linkedin,
  List,
  LocateFixed,
  Lock,
  LucideIcon,
  MessagesSquare,
  MoveRight,
  Play,
  PlayCircle,
  Redo,
  Repeat,
  Rocket,
  Scaling,
  Scan,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Twitter,
  Users,
  WandSparkles,
  Wrench,
  XCircle,
  Zap,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
  iconVariant: string;
  strokeWidth?: number;
  size?: number;
};

// Map of icon names to their components
const iconComponents: Record<string, LucideIcon> = {
  "arrow-down-to-line": ArrowDownToLine,
  "arrow-right": ArrowRight,
  "arrow-up-down": ArrowUpDown,
  bell: Bell,
  blocks: Blocks,
  "building-2": Building2,
  "check-circle-2": CheckCircle2,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "circle-dot": CircleDot,
  cloud: Cloud,
  code: Code,
  compass: Compass,
  cpu: Cpu,
  dribbble: Dribbble,
  "external-link": ExternalLink,
  "git-branch": GitBranch,
  github: Github,
  globe: Globe,
  home: Home,
  infinity: Infinity,
  landmark: Landmark,
  "layout-grid": LayoutGrid,
  "layout-list": LayoutList,
  linkedin: Linkedin,
  list: List,
  "locate-fixed": LocateFixed,
  lock: Lock,
  "messages-square": MessagesSquare,
  "move-right": MoveRight,
  play: Play,
  "play-circle": PlayCircle,
  redo: Redo,
  repeat: Repeat,
  rocket: Rocket,
  scaling: Scaling,
  scan: Scan,
  sparkles: Sparkles,
  star: Star,
  timer: Timer,
  trophy: Trophy,
  twitter: Twitter,
  users: Users,
  "wand-sparkles": WandSparkles,
  wrench: Wrench,
  "x-circle": XCircle,
  zap: Zap,
  "zoom-in": ZoomIn,
};

export default function Icon({
  className,
  iconVariant,
  strokeWidth = 1,
  size = 4,
}: IconProps) {
  if (iconVariant === "none" || !iconComponents[iconVariant]) {
    return null;
  }

  const IconComponent = iconComponents[iconVariant];
  return (
    <IconComponent
      className={cn(`size-${size}`, className)}
      strokeWidth={strokeWidth}
    />
  );
}
