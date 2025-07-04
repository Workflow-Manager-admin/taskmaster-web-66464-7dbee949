# Supabase Integration Guide for todo_frontend

This project uses [Supabase](https://supabase.com/) for authentication and todo CRUD. 

## Environment Variables

Set the following in `.env`:
```
REACT_APP_SUPABASE_URL=https://fhidlwkkhjarkfhosuyl.supabase.co
REACT_APP_SUPABASE_KEY=your_supabase_anon_key_here
```

## Todo Table Structure

The `todos` table has been provisioned as described, with:

- **id**: integer, primary key, auto-increment (identity)
- **user_id**: uuid, (foreign key reference to auth.users.id)
- **title**: text
- **completed**: boolean, default:false

**Access Control & Auth:**  
- [x] [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security) enabled.
- [x] Policy: *Users can only perform CRUD on their own todos (user_id must match logged-in user)*.
- [x] All authentication/sign-in (sign up, sign in, sign out) is via Supabase Auth (email/password).
- [x] All queries for todos are filtered by `user_id` (applies on both backend and frontend).

## Features

- Sign up, sign in, sign out (email/password)
- Only see your own todos (auth required)
- CRUD for todos, all operations filtered by `user_id`
- Table security: Strong RLS for user isolation
- UI is minimal, light theme by default

## Usage

All Supabase operations use the environment variables for credentials.

**Table & Auth last updated:** [Configured via automated setup]
