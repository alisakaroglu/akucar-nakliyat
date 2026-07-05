import { Truck, MapPin, Globe2, Home, FileCheck, Building2, Landmark, Navigation, type LucideIcon } from "lucide-react";

// Panelde string olarak saklanan ikon adlarını lucide bileşenine eşler.
export const iconMap: Record<string, LucideIcon> = {
  Truck, MapPin, Globe2, Home, FileCheck, Building2, Landmark, Navigation,
};
export const getIcon = (name?: string | null): LucideIcon => iconMap[name ?? ""] ?? Truck;
