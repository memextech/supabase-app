'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react' // If you want to use an icon

type NoteProps = {
  id: string
  title: string
  created_at: string
}

export default function NoteCard({ id, title, created_at }: NoteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error

      router.refresh() // Refresh the server component to update the list
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg shadow-sm flex justify-between items-start">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          Created: {new Date(created_at).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-2 rounded-md transition-colors ${
          isDeleting 
            ? 'bg-gray-100 text-gray-400' 
            : 'hover:bg-red-50 text-red-500 hover:text-red-700'
        }`}
        title="Delete note"
      >
        {isDeleting ? (
          <span className="text-sm">Deleting...</span>
        ) : (
          <Trash2 size={18} /> // Or use a simple "Delete" text if you don't want icons
        )}
      </button>
    </div>
  )
} 