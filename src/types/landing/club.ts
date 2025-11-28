export interface ClubResponse {
  id: string;
  name: string;
  description: string;
  location: string;
  members: number;
  ord: number;
  thumbnailUrl: string | null;
}
