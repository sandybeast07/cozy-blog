'use client'

import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Post } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PostEditor from '@/components/PostEditor'

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

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const [posts, setPosts]           = useState<Post[]>([])
  const [mounted, setMounted]       = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editPost, setEditPost]     = useState<Post | null>(null)
  const [search, setSearch]         = useState('')

  useEffect(() => {
    setPosts(loadPosts())
    setMounted(true)
  }, [])

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
      <header className="relative overflow-hidden bg-[#2e2316] text-[#fdf6ec]">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#c9694a]/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#d4924a]/15 blur-2xl pointer-events-none" />
        <div className="absolute top-8 left-1/2 w-32 h-32 rounded-full bg-[#7a8c6e]/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="font-sans text-sm font-medium text-[#c9b89e] uppercase tracking-widest mb-3 animate-fade-in opacity-0" style={{animationFillMode:'forwards', animationDelay:'100ms'}}>
            {greeting()} ✦
          </p>
          <h1 className="font-display text-5xl font-bold text-[#fdf6ec] mb-4 animate-fade-up opacity-0 leading-tight" style={{animationFillMode:'forwards', animationDelay:'200ms'}}>
            My Cozy Journal
          </h1>
          <p className="font-body italic text-[#c9b89e] text-lg animate-fade-up opacity-0" style={{animationFillMode:'forwards', animationDelay:'300ms'}}>
            A warm place for your thoughts, feelings, and quiet reflections.
          </p>
        </div>
      </header>

      {/* ── Controls bar ── */}
      <div className="sticky top-0 z-30 bg-[#faf2e6]/90 backdrop-blur-md border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8916c] text-base pointer-events-none">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your entries…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f5ead6] border border-[#e8ddd0] text-[#2e2316] font-sans text-sm placeholder-[#c9b89e] focus:border-[#c9694a] focus:ring-2 focus:ring-[#c9694a]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8916c] hover:text-[#4d3d28] transition-colors text-lg leading-none"
              >×</button>
            )}
          </div>

          {/* New entry button */}
          <button
            onClick={openNew}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#c9694a] text-[#fdf6ec] rounded-xl font-sans font-medium text-sm hover:bg-[#b04d30] transition-colors shadow-md"
          >
            <span className="text-lg leading-none">＋</span>
            New entry
          </button>
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
          <div className="text-center py-24 animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
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
          <div className="text-center py-16 animate-fade-in opacity-0" style={{animationFillMode:'forwards'}}>
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
      <footer className="text-center pb-12 pt-6">
        <p className="font-body italic text-[#c9b89e] text-sm">
          ✦ Keep writing. Keep feeling. Keep being you. ✦
        </p>
      </footer>

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
