'use client'

import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Post } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PostEditor from '@/components/PostEditor'
import Footer from '@/components/ui/Footer'
import EntryBtn from '@/components/EntryBtn'
import Search from '@/components/Search'
import Header from '@/components/ui/Header'


const STORAGE_KEY = 'cozy-journal-posts'

function loadPosts(): Post[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [mounted, setMounted] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setPosts(loadPosts())
    setMounted(true)
  }, [])

  // Memo function for Search
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts
    const q = search.toLowerCase()
    return posts.filter(
      p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    )
  }, [posts, search])

  const handleSave = (title: string, content: string, mood: Post['mood']) => {
    let updated: Post[]
    if (editPost) {
      updated = posts.map(p =>
        p.id === editPost.id
          ? { ...p, title, content, mood, updatedAt: new Date().toISOString() }
          : p
      )
    } else {
      const now = new Date().toISOString()
      const newPost: Post = { id: uuidv4(), title, content, mood, createdAt: now, updatedAt: now }
      updated = [newPost, ...posts]
    }
    setPosts(updated)
    savePosts(updated)
    setShowEditor(false)
    setEditPost(null)
  }

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id)
    setPosts(updated)
    savePosts(updated)
  }

  const handleEdit = (post: Post) => {
    setEditPost(post)
    setShowEditor(true)
  }

  const openNew = () => {
    setEditPost(null)
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditPost(null)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <Header />

      {/* ── Controls bar ── */}
      <div className="sticky top-0 z-30 bg-[#faf2e6]/90 backdrop-blur-md border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* Search */}
          <Search handleSearch={(val) => setSearch(val)} />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8916c] hover:text-[#4d3d28] transition-colors text-lg leading-none"
            >×</button>
          )}
          {/* New entry button */}
          <EntryBtn handleNew={openNew} />
        </div>
      </div>

      {/* ── Posts ── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Stats row */}
        {posts.length > 0 && (
          <p className="text-xs font-sans text-[#a8916c] mb-6">
            {search.trim()
              ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${search}"`
              : `${posts.length} entr${posts.length !== 1 ? 'ies' : 'y'} in your journal`
            }
          </p>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-24 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="text-6xl mb-4">🕯️</div>
            <h2 className="font-display text-2xl text-[#4d3d28] mb-2">Your journal awaits</h2>
            <p className="font-body italic text-[#a8916c] mb-8">Begin with a single thought…</p>
            <button
              onClick={openNew}
              className="px-6 py-3 bg-[#c9694a] text-[#fdf6ec] rounded-xl font-sans font-medium hover:bg-[#b04d30] transition-colors shadow-md"
            >
              Write your first entry
            </button>
          </div>
        )}

        {/* No search results */}
        {posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-16 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="text-5xl mb-3">🍃</div>
            <p className="font-body italic text-[#a8916c]">No entries match your search.</p>
          </div>
        )}

        {/* Post grid */}
        <div className="space-y-5">
          {filteredPosts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              index={i}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Editor Modal ── */}
      {showEditor && (
        <PostEditor
          post={editPost}
          onSave={handleSave}
          onClose={closeEditor}
        />
      )}
    </main>
  )
}
