'use client'

import { Post } from '@/lib/types'
import { useState } from 'react'

interface PostCardProps {
  post: Post
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  index: number
}

const moodConfig: Record<string, { emoji: string; label: string; color: string }> = {
  happy:      { emoji: '☀️', label: 'Happy',      color: 'bg-amber-100 text-amber-700' },
  reflective: { emoji: '🌙', label: 'Reflective', color: 'bg-indigo-100 text-indigo-700' },
  sad:        { emoji: '🌧️', label: 'Sad',        color: 'bg-blue-100 text-blue-700' },
  grateful:   { emoji: '🍂', label: 'Grateful',   color: 'bg-orange-100 text-orange-700' },
  anxious:    { emoji: '🌿', label: 'Anxious',    color: 'bg-green-100 text-green-700' },
  excited:    { emoji: '✨', label: 'Excited',    color: 'bg-yellow-100 text-yellow-700' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function PostCard({ post, onEdit, onDelete, index }: PostCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mood = post.mood ? moodConfig[post.mood] : null
  const wasEdited = post.updatedAt !== post.createdAt
  const delayClass = ['delay-100','delay-200','delay-300','delay-400'][index % 4]

  return (
    <article
      className={`post-card animate-fade-up opacity-0 ${delayClass} bg-[#fdf6ec] rounded-2xl shadow-md border border-[#e8ddd0] overflow-hidden`}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#c9694a] via-[#d4924a] to-[#7a8c6e]" />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-display text-xl font-semibold text-[#2e2316] leading-snug">
            {post.title}
          </h2>
          {mood && (
            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-sans font-medium ${mood.color}`}>
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>

        {/* Content preview */}
        <p className="text-[#4d3d28] font-body text-sm leading-relaxed line-clamp-4 mb-4">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e8ddd0]">
          <div className="text-xs text-[#a8916c] font-sans space-y-0.5">
            <p>{formatDate(post.createdAt)} · {formatTime(post.createdAt)}</p>
            {wasEdited && (
              <p className="italic">Edited {formatDate(post.updatedAt)}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post)}
              className="text-xs font-sans font-medium px-3 py-1.5 rounded-lg bg-[#f5ead6] text-[#7a6248] hover:bg-[#eecb8a] hover:text-[#4d3d28] transition-colors"
            >
              Edit
            </button>
            {confirmDelete ? (
              <div className="flex gap-1">
                <button
                  onClick={() => onDelete(post.id)}
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs font-sans font-medium px-3 py-1.5 rounded-lg bg-[#f5ead6] text-[#7a6248] hover:bg-[#e8ddd0] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-sans font-medium px-3 py-1.5 rounded-lg bg-[#f5ead6] text-[#a8916c] hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
