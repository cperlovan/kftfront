export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entity {
  id: string;
  name?: string;
  type: "BUSINESS" | "PERSON";
  position?: string;
  userId: string;
  locations: Location[];
  photos: Photo[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  entityId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  entityId: string;
  url: string;
  createdAt: string;
}

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface EntityLocation {
  id: string
  entityId: string
  address: string
  latitude?: number
  longitude?: number
  phone?: string
  createdAt: string
  updatedAt: string
}


export type RatingType = "raya" | "regular" | "fino";

export function getRatingType(rating: number): RatingType {
  if (rating <= 2) return "raya";
  if (rating >= 4) return "fino";
  return "regular";
}

export function getRatingLabel(type: RatingType): string {
  switch (type) {
    case "raya":
      return "Raya (Malo)";
    case "regular":
      return "Regular";
    case "fino":
      return "Fino (Bueno)";
    default:
      return "Sin calificar";
  }
}

export function getRatingColor(type: RatingType): string {
  switch (type) {
    case "raya":
      return "text-orange-600 border-orange-600 bg-orange-50";
    case "regular":
      return "text-amber-600 border-amber-600 bg-amber-50";
    case "fino":
      return "text-green-600 border-green-600 bg-green-50";
    default:
      return "text-slate-600 border-slate-600 bg-slate-50";
  }
}
