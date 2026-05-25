export interface MediaItem{
    id: string;
    title: string;
    description?: string;
    category?: 'GATHERING' | 'SUCCESS STORY';
    imageUrl: string;
    videoUrl?: string;

}