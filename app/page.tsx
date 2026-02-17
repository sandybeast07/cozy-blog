'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PostEditor from '@/components/PostEditor'
import Footer from '@/components/ui/Footer'
import EntryBtn from '@/components/EntryBtn'
import Search from '@/components/Search'
import Header from '@/components/ui/Header'


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
    setMounted(true)
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setPosts(data)
    setLoading(false)
  }

  // Memo function for Search
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts
    const q = search.toLowerCase()
    return posts.filter(
      p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    )
  }, [posts, search])

  const handleSave = async (title: string, content: string, mood: Post['mood']) => {
    if (editPost) {
      const { data, error } = await supabase
        .from('posts')
        .update({ title, content, mood, updated_at: new Date().toISOString() })
        .eq('id', editPost.id)
        .select()
        .single()
      if (!error && data) {
        setPosts(prev => prev.map(p => p.id === editPost.id ? data : p))
      }
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({ title, content, mood })
        .select()
        .single()
      if (!error && data) {
        setPosts(prev => [data, ...prev])
      }
    }
    setShowEditor(false)
    setEditPost(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) setPosts(prev => prev.filter(p => p.id !== id))
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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 animate-pulse">🕯️</div>
            <p className="font-body italic text-[#a8916c] dark:text-[#7a6248]">Loading your journal…</p>
          </div>
        )}

        {/* Empty state */}
         {!loading && posts.length === 0 && (
          <div className="text-center py-24 animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
            <div className="text-6xl mb-4">🕯️</div>
            <h2 className="font-display text-2xl text-[#4d3d28] dark:text-[#c9b89e] mb-2">Your journal awaits</h2>
            <p className="font-body italic text-[#a8916c] dark:text-[#7a6248] mb-8">Begin with a single thought…</p>
            <button onClick={openNew} className="px-6 py-3 bg-[#c9694a] text-[#fdf6ec] rounded-xl font-sans font-medium hover:bg-[#b04d30] transition-colors shadow-md">
              Write your first entry
            </button>
          </div>
        )}

        {/* No search results */}
         {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-16 animate-fade-in opacity-0" style={{animationFillMode:'forwards'}}>
            <div className="text-5xl mb-3">🍃</div>
            <p className="font-body italic text-[#a8916c] dark:text-[#7a6248]">No entries match your search.</p>
          </div>
        )}

        <div className="space-y-5">
          {filteredPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} onEdit={handleEdit} onDelete={handleDelete} />
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
