'use client'

import { Post } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

type Mood = Post['mood']

const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: 'happy',      emoji: '☀️', label: 'Happy' },
  { value: 'reflective', emoji: '🌙', label: 'Reflective' },
  { value: 'grateful',   emoji: '🍂', label: 'Grateful' },
  { value: 'excited',    emoji: '✨', label: 'Excited' },
  { value: 'anxious',    emoji: '🌿', label: 'Anxious' },
  { value: 'sad',        emoji: '🌧️', label: 'Sad' },
]

interface PostEditorProps {
  post?: Post | null
  onSave: (title: string, content: string, mood: Mood) => void
  onClose: () => void
}

export default function PostEditor({ post, onSave, onClose }: PostEditorProps) {
  const [title, setTitle]     = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [mood, setMood]       = useState<Mood>(post?.mood || undefined)
  const [error, setError]     = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSave = () => {
    if (!title.trim()) { setError('Please add a heading for your entry.'); return }
    if (!content.trim()) { setError('Your entry seems empty — write something!'); return }
    onSave(title.trim(), content.trim(), mood)
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2e2316]/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-[#fdf6ec] rounded-3xl shadow-2xl border border-[#e8ddd0] animate-fade-up overflow-hidden"
        style={{ animationFillMode: 'forwards', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c9694a] via-[#d4924a] to-[#7a8c6e] shrink-0" />

        <div className="p-8 overflow-y-auto flex-1">
          {/* Modal title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-[#2e2316]">
              {post ? 'Edit entry' : 'New entry'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#a8916c] hover:bg-[#f5ead6] hover:text-[#4d3d28] transition-colors text-xl font-sans"
            >
              ×
            </button>
          </div>

          {/* Title input */}
          <div className="mb-5">
            <label className="block text-xs font-sans font-medium text-[#a8916c] uppercase tracking-wider mb-2">
              Heading
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError('') }}
              placeholder="What's on your mind?"
              className="w-full bg-[#f5ead6] border border-[#e8ddd0] rounded-xl px-4 py-3 font-display text-lg text-[#2e2316] placeholder-[#c9b89e] focus:border-[#c9694a] focus:ring-2 focus:ring-[#c9694a]/20 transition-all"
            />
          </div>

          {/* Mood picker */}
          <div className="mb-5">
            <label className="block text-xs font-sans font-medium text-[#a8916c] uppercase tracking-wider mb-2">
              Mood (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(mood === m.value ? undefined : m.value)}
                  className={`text-sm px-3 py-1.5 rounded-xl border font-sans transition-all ${
                    mood === m.value
                      ? 'bg-[#2e2316] text-[#fdf6ec] border-[#2e2316]'
                      : 'bg-[#f5ead6] text-[#7a6248] border-[#e8ddd0] hover:border-[#c9b89e]'
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content textarea */}
          <div className="mb-2">
            <label className="block text-xs font-sans font-medium text-[#a8916c] uppercase tracking-wider mb-2">
              Your thoughts
            </label>
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setError('') }}
              placeholder="Pour your heart out here… this is your safe space."
              rows={8}
              className="w-full bg-[#f5ead6] border border-[#e8ddd0] rounded-xl px-4 py-3 font-body text-[#2e2316] placeholder-[#c9b89e] focus:border-[#c9694a] focus:ring-2 focus:ring-[#c9694a]/20 transition-all leading-relaxed"
            />
            <p className="text-right text-xs text-[#a8916c] font-sans mt-1">{wordCount} word{wordCount !== 1 ? 's' : ''}</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 font-sans bg-red-50 px-4 py-2 rounded-lg mb-4">{error}</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-8 py-5 border-t border-[#e8ddd0] bg-[#faf2e6] flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 font-sans font-medium text-sm rounded-xl text-[#7a6248] bg-[#f5ead6] hover:bg-[#e8ddd0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 font-sans font-medium text-sm rounded-xl text-[#fdf6ec] bg-[#c9694a] hover:bg-[#b04d30] transition-colors shadow-md"
          >
            {post ? 'Save changes' : 'Publish entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
