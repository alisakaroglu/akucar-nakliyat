import { Truck, MapPin, Globe2, Home, FileCheck, type LucideIcon } from "lucide-react";

// Panelde string olarak saklanan ikon adlarını lucide bileşenine eşler.
export const iconMap: Record<string, LucideIcon> = {
  Truck, MapPin, Globe2, Home, FileCheck,
};
export const getIcon = (name?: string | null): LucideIcon => iconMap[name ?? ""] ?? Truck;
