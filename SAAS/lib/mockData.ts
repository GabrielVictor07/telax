export interface MovieItem {
  id: string;
  title: string;
  category: string;
  year: number;
  rating: number;
  duration: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  isFeatured: boolean;
  isFavorite?: boolean;
}

