
export interface AdminUser {
  id: string;
  user_id: string;
  added_by: string | null;
  created_at: string;
}

export interface AdminStats {
  userCount: number;
  channelCount: number;
  messageCount: number;
}
