
# Notes app with Supabase SQL Database and User based authentication Documentation

## Project Overview
TODO

## Prerequisites
- Supabase account (Person needs to register with [Supabase](https://supabase.com/) and setup new project)

## Setup Instructions

### Supabase CLI

#### Install Supabase CLI
```bash
npm install supabase --save-dev
```
or
```bash
brew install supabase/tap/supabase
```

#### Login to Supabase
```bash
npx supabase login
```

### Setup Subase in this project

#### Initialise Supabase
```bash
npx supabase init
```

Link your produciton project
```bash
npx supabase link --project-ref <your-project-ref-id>
```

### Create TABLE using migrations

Create migration to setup your first table
```bash
npx supabase migration new create_notes_table
```

Edit the generated migration file in supabase/migrations/[timestamp]_create_notes_table.sql
```
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up indexes
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies
CREATE POLICY "Users can read own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

Now you can push your migrations to production:
```bash
npx supabase db push
```

### Useful commands:

#### View pending migrations
    npx supabase migration list

#### Reset database (careful with production!)
    npx supabase db reset

#### Get current database changes
    npx supabase db diff

#### Generate migration from current changes
    npx supabase migration new --use-database


### Local Supabase Environment

Requires Docker

Start a local Supabase instance
```bash
npx supabase start
```

Then you can run your migrations:
```bash
npm run migration:up
```

If needed, stop and restart the Supabase services:
```bash
npx supabase stop
npx supabase start
```
Verify your Supabase configuration:
```bash
npx supabase status
```

## Coding Database Client in Typescript

Use drizzle-orm to code integrations with Supabase database

## Building and Running

### Run the App
```bash
npm run dev
```

## Deployment

### Vercel CLI Installation

```bash
npm i -g vercel
```

### Vercel Deployment

```bash
vercel
```