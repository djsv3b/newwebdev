export interface Post {
  _id?: string; // Optional because it will be set by MongoDB
  content: string;
  done: boolean;
}
