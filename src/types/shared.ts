export type ItemStatus = 'Active' | 'Archived' | 'Complete' | 'Pending';

export interface MediaFile {
  url: string;
  name: string;
  contentType: string;
  createdAt: string;
}

export interface VoiceNote {
  id: string;
  url: string;
  createdAt: string;
  duration?: number;
}