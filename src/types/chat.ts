
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  data?: any[]; // Optional data for rendering tables or other content
}

export interface ApiResponse {
  output?: string;
  data?: any[]; // Optional data for rendering tables or other content
}
