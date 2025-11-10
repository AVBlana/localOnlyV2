export interface Experience {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  hostName?: string | null;
  hostImage?: string | null;
}

