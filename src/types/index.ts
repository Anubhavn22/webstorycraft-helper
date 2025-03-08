
export interface StorySlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

export interface StoryData {
  id: string;
  title: string;
  slides: StorySlide[];
  createdAt: number;
}
