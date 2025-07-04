# Supabase Integration Guide for todo_frontend

This project uses [Supabase](https://supabase.com/) for authentication and todo CRUD. 

## Environment Variables

Set the following in `.env`:
```
REACT_APP_SUPABASE_URL=https://fhidlwkkhjarkfhosuyl.supabase.co
REACT_APP_SUPABASE_KEY=your_supabase_anon_key_here
```

## Todo Table Structure

Create a `todos` table in your Supabase project with (at minimum):

- **id**: integer, primary key, autoincrement
- **user_id**: uuid, (reference to auth.users.id)
- **title**: text
- **completed**: boolean, default:false

## Features

- Sign up, sign in, sign out (email/password)
- Only see your own todos (auth required)
- CRUD for todos, all operations filtered by `user_id`
- UI is minimal, light theme by default

## Usage

All Supabase operations use the environment variables for credentials.
