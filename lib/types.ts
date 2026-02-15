export interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  mood?: 'happy' | 'reflective' | 'sad' | 'grateful' | 'anxious' | 'excited'
}
