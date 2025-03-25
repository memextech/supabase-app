import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateNoteForm from './components/create-note-form'
import NoteCard from './components/note-card'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-4 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Your Notes</h1>
      </div>

      {/* We'll create this as a client component for interactivity */}
      <CreateNoteForm />

      {!notes?.length ? (
        <p className="text-center text-gray-500">No notes found. Create your first note!</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              created_at={note.created_at}
            />
          ))}
        </div>
      )}
    </div>
  )
}
