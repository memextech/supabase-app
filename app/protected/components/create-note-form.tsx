'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateNoteForm() {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        throw new Error('Not authenticated')
      }

      const { error: insertError } = await supabase
        .from('notes')
        .insert([
          {
            title,
            user_id: session.user.id
          }
        ])

      if (insertError) throw insertError

      setTitle('')
      router.refresh() // This will refresh the server component
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full p-2 border rounded-md"
          required
          minLength={3}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-2 text-white rounded-md ${
          isSubmitting 
            ? 'bg-gray-400' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Creating...' : 'Add Note'}
      </button>
    </form>
  )
} 