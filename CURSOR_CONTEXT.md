\# SINDIKAT NCR ATLEOS - CURSOR AI CONTEXT



\## PROJECT OVERVIEW

Union membership management system with application form and admin panel.



\*\*Location\*\*: `C:\\Users\\savin\\sindikat-ncr-final`

\*\*Port\*\*: 3000

\*\*Old working CMS\*\*: `C:\\Users\\savin\\cms` (reference for working APIs)



---



\## CURRENT STATUS



\### ✅ WORKING

\- NextAuth authentication setup

\- Login page (needs branding)

\- Basic admin dashboard (needs expansion)

\- Membership application form (needs i18n + branding)

\- Middleware for route protection

\- Supabase connection



\### ❌ BROKEN/MISSING

1\. \*\*CRITICAL\*\*: Supabase API keys invalid in .env.local

2\. GET /api/members route missing

3\. Admin can't see member list

4\. No i18n system (needs SR/EN)

5\. No branding applied (using default colors)

6\. PDF generation API missing (exists in old CMS)

7\. Email with attachments API missing (exists in old CMS)



---



\## DATABASE SCHEMA (Supabase)



\### admins table

```sql

CREATE TABLE public.admins (

&nbsp; id uuid PRIMARY KEY,                    -- Must match auth.users.id

&nbsp; email varchar UNIQUE NOT NULL,

&nbsp; full\_name varchar,                      -- NOT 'name'!

&nbsp; role text,

&nbsp; created\_at timestamptz DEFAULT now(),

&nbsp; last\_login timestamptz

);

```



\### members table

```sql

CREATE TABLE public.members (

&nbsp; id serial PRIMARY KEY,                  -- Auto-increment INTEGER

&nbsp; full\_name varchar NOT NULL,

&nbsp; email varchar NOT NULL,

&nbsp; quicklook\_id varchar NOT NULL,

&nbsp; city varchar,

&nbsp; organization varchar,

&nbsp; phone varchar,

&nbsp; team varchar,

&nbsp; status enum\_members\_status DEFAULT 'active',  -- ENUM: 'active', 'inactive', 'pending'

&nbsp; consent boolean DEFAULT false,

&nbsp; agree\_join boolean DEFAULT false,

&nbsp; agree\_gdpr boolean DEFAULT false,

&nbsp; active\_participation boolean DEFAULT false,

&nbsp; send\_copy boolean DEFAULT false,

&nbsp; language varchar DEFAULT 'sr',          -- 'sr' or 'en'

&nbsp; member\_id varchar,

&nbsp; qr\_media\_id int,

&nbsp; card\_pdf\_id int,

&nbsp; joined\_at timestamptz,

&nbsp; created\_at timestamptz DEFAULT now(),

&nbsp; updated\_at timestamptz DEFAULT now()

);

```



\*\*IMPORTANT NOTES:\*\*

\- `admins.full\_name` NOT `name`

\- `members.id` is INTEGER (serial), NOT uuid

\- `members.status` is ENUM, NOT text

\- Always use `full\_name` when querying admins



---



\## ENVIRONMENT VARIABLES



\*\*File\*\*: `.env.local`

```env

\# Supabase (GET FROM: https://supabase.com/dashboard/project/loixkzynmlwlipwzqadt/settings/api)

NEXT\_PUBLIC\_SUPABASE\_URL=https://loixkzynmlwlipwzqadt.supabase.co

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE\_SERVICE\_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...



\# NextAuth

NEXTAUTH\_URL=http://localhost:3000

NEXTAUTH\_SECRET=generate\_with\_openssl\_rand\_base64\_32



\# Email

EMAIL\_HOST=smtp.gmail.com

EMAIL\_PORT=587

EMAIL\_USER=your-gmail@gmail.com

EMAIL\_PASS=your-16-char-app-password

UNION\_EMAIL=office@sindikatncr.com

```



\*\*ACTION NEEDED\*\*: Update Supabase keys from dashboard!



---



\## BRANDING \& DESIGN SYSTEM



\### Color Palette (MUST USE)

```css

/\* Add to src/app/globals.css \*/

:root {

&nbsp; --brand-navy: #0B2C49;      /\* Primary text, headers \*/

&nbsp; --brand-blue: #005B99;      /\* Links, buttons, primary UI \*/

&nbsp; --brand-orange: #F28C38;    /\* CTA buttons \*/

&nbsp; --brand-red: #C63B3B;       /\* Accents, warnings \*/

&nbsp; --neutral-900: #111827;

&nbsp; --neutral-700: #4A4A4A;

&nbsp; --neutral-500: #6B7280;

&nbsp; --neutral-200: #E5E7EB;

&nbsp; --neutral-50: #F8FAFC;

}

```



\### Tailwind Replacements

```

OLD → NEW

bg-blue-600 → bg-\[#005B99]

bg-blue-50 → bg-\[#F8FAFC]

text-blue-600 → text-\[#005B99]

text-gray-900 → text-\[#0B2C49]

border-blue-500 → border-\[#005B99]

```



\### Button Styles

```tsx

// Primary CTA

className="bg-\[#F28C38] hover:bg-\[#d97a2e] text-white"



// Secondary

className="bg-\[#005B99] hover:bg-\[#004a7a] text-white"



// Outline

className="border-2 border-\[#005B99] text-\[#005B99] hover:bg-\[#005B99] hover:text-white"

```



---



\## FILE STRUCTURE

```

src/

├── app/

│   ├── page.tsx                          ❌ TODO: Landing page

│   ├── layout.tsx                        ✅

│   ├── globals.css                       ⚠️  Needs branding colors

│   ├── nova-pristupnica/

│   │   └── page.tsx                      ⚠️  Works, needs i18n + branding

│   ├── admin/

│   │   ├── page.tsx                      ⚠️  Basic stats, needs member list

│   │   └── repository/

│   │       └── page.tsx                  ❌ Missing

│   ├── auth/

│   │   └── login/

│   │       └── page.tsx                  ⚠️  Works, needs branding

│   └── api/

│       ├── auth/

│       │   └── \[...nextauth]/

│       │       └── route.ts              ✅ Fixed for schema

│       ├── members/

│       │   ├── route.ts                  ❌ CRITICAL: Missing GET endpoint

│       │   └── update/

│       │       └── route.ts              ❌ Missing

│       ├── submit-application/

│       │   └── route.ts                  ✅ Fixed for schema

│       ├── generate-card/                ❌ Copy from C:\\Users\\savin\\cms

│       └── send-welcome-email/           ❌ Copy from C:\\Users\\savin\\cms

├── components/

│   └── ui/                               ✅ shadcn components

├── lib/

│   ├── supabase.ts                       ✅

│   └── i18n.ts                           ❌ Missing

├── locales/

│   ├── sr/

│   │   └── common.json                   ❌ Missing

│   └── en/

│       └── common.json                   ❌ Missing

└── middleware.ts                         ✅

```



---



\## CRITICAL FIXES NEEDED (Priority Order)



\### 1. Fix Supabase Keys (IMMEDIATE)

```bash

\# In .env.local, update with real keys from:

\# https://supabase.com/dashboard/project/loixkzynmlwlipwzqadt/settings/api

```



\### 2. Create GET /api/members Route

```typescript

// src/app/api/members/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { createClient } from '@supabase/supabase-js';

import { authOptions } from '../auth/\[...nextauth]/route';



const supabase = createClient(

&nbsp; process.env.NEXT\_PUBLIC\_SUPABASE\_URL!,

&nbsp; process.env.SUPABASE\_SERVICE\_KEY!

);



export async function GET(req: NextRequest) {

&nbsp; try {

&nbsp;   const session = await getServerSession(authOptions);

&nbsp;   if (!session) {

&nbsp;     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

&nbsp;   }



&nbsp;   const { data: members, error } = await supabase

&nbsp;     .from('members')

&nbsp;     .select('\*')

&nbsp;     .order('created\_at', { ascending: false });



&nbsp;   if (error) throw error;



&nbsp;   return NextResponse.json({ members });

&nbsp; } catch (error: any) {

&nbsp;   return NextResponse.json({ error: error.message }, { status: 500 });

&nbsp; }

}

```



\### 3. Apply Branding to All Pages

Update these files with branding colors:

\- src/app/nova-pristupnica/page.tsx

\- src/app/auth/login/page.tsx

\- src/app/admin/page.tsx



\### 4. Add i18n System

Create translation files and language switcher.



\### 5. Update Pristupnica Checkboxes

```typescript

// Required checkboxes:

// ☐ Prihvatam Statut i pravila sindikata. (mandatory)

// ☐ Potvrđujem da sam pročitao/la Politiku privatnosti (optional, link to /politika-privatnosti)

// ☐ Dajem saglasnost da primam email poruke (optional newsletter consent)

```



---



\## WORKING REFERENCE CODE



\### NextAuth authorize() - CORRECT VERSION

```typescript

async authorize(credentials) {

&nbsp; const { data: authData, error: authError } = await supabase.auth.signInWithPassword({

&nbsp;   email: credentials.email,

&nbsp;   password: credentials.password,

&nbsp; });



&nbsp; if (authError) throw new Error('Pogrešan email ili password');



&nbsp; const { data: admin } = await supabase

&nbsp;   .from('admins')

&nbsp;   .select('\*')

&nbsp;   .eq('email', credentials.email)

&nbsp;   .single();



&nbsp; if (!admin) throw new Error('Korisnik nije admin');



&nbsp; return {

&nbsp;   id: admin.id,

&nbsp;   email: admin.email,

&nbsp;   name: admin.full\_name,  // ⚠️ Use full\_name!

&nbsp;   role: admin.role,

&nbsp; };

}

```



\### Submit Application - CORRECT VERSION

```typescript

const { data: member, error } = await supabase

&nbsp; .from('members')

&nbsp; .insert({

&nbsp;   full\_name: fullName,

&nbsp;   email: email,

&nbsp;   quicklook\_id: quicklookId,

&nbsp;   city: city,

&nbsp;   organization: organization,

&nbsp;   status: 'active',        // ⚠️ ENUM value

&nbsp;   consent: true,

&nbsp;   agree\_join: true,

&nbsp;   agree\_gdpr: true,

&nbsp;   language: 'sr',

&nbsp; })

&nbsp; .select()

&nbsp; .single();

```



---



\## COMMON ERRORS \& SOLUTIONS



\### Error: "Invalid API key"

\*\*Solution\*\*: Update `.env.local` with correct Supabase keys from dashboard



\### Error: "column 'name' does not exist"

\*\*Solution\*\*: Use `full\_name` instead of `name` in admins queries



\### Error: "invalid input value for enum"

\*\*Solution\*\*: Use 'active', 'inactive', or 'pending' for members.status



\### Error: "401 Unauthorized on /api/members"

\*\*Solution\*\*: Check that admin user exists in BOTH auth.users AND admins table with same UUID



---



\## TESTING CHECKLIST

```bash

\# Start server

npm run dev



\# Test 1: Pristupnica

http://localhost:3000/nova-pristupnica

\# Fill form → Submit → Check terminal for success log → Verify in Supabase



\# Test 2: Admin Login

http://localhost:3000/auth/login

\# Email: admin@sindikatncr.com

\# Password: \[your password]

\# Should redirect to /admin



\# Test 3: Admin Dashboard

http://localhost:3000/admin

\# Should show stats and member list

```



---



\## DEPENDENCIES

```json

{

&nbsp; "next": "^15.5.5",

&nbsp; "react": "^19.0.0",

&nbsp; "next-auth": "^4.24.10",

&nbsp; "@supabase/supabase-js": "^2.47.10",

&nbsp; "framer-motion": "^11.15.0",

&nbsp; "recharts": "^2.15.0",

&nbsp; "date-fns": "^4.1.0",

&nbsp; "react-hot-toast": "^2.4.1",

&nbsp; "lucide-react": "latest",

&nbsp; "jspdf": "^2.5.2"

}

```



---



\## HELPFUL COMMANDS

```bash

\# Install missing dependencies

npm install



\# Add shadcn component

npx shadcn@latest add \[component-name]



\# Generate NextAuth secret

openssl rand -base64 32



\# Check Supabase connection

node -e "const {createClient}=require('@supabase/supabase-js');const c=createClient(process.env.NEXT\_PUBLIC\_SUPABASE\_URL,process.env.SUPABASE\_SERVICE\_KEY);c.from('members').select('count').then(console.log)"

```



---



\## LINKS



\- Supabase Dashboard: https://supabase.com/dashboard/project/loixkzynmlwlipwzqadt

\- Old working CMS: C:\\Users\\savin\\cms

\- Previous conversation: https://claude.ai/chat/1c6dba60-6e8e-474a-bcb6-2ceb21c1cdd5

```



\*\*Sačuvaj i zatvori.\*\*



---



\## 📝 \*\*KORAK 4: Cursor Composer Prompt (Glavna instrukcija)\*\*



U Cursor-u, pritisni \*\*Ctrl+I\*\* (Composer) i kopiraj:

```

Read CURSOR\_CONTEXT.md and .cursorrules files in this project root.



CRITICAL FIRST STEP:

I need to update .env.local with correct Supabase keys. The current keys are invalid.

Guide me step-by-step:

1\. What URL should I visit to get the correct keys?

2\. Which specific keys do I need (anon vs service\_role)?

3\. How do I safely update .env.local?



After .env.local is fixed, execute these tasks IN ORDER:



TASK 1: Create missing API route

\- File: src/app/api/members/route.ts

\- Implement GET endpoint to fetch all members from Supabase

\- Use getServerSession for auth

\- Return members array ordered by created\_at DESC

\- Add proper error handling and logging



TASK 2: Apply branding colors

\- Update src/app/globals.css with CSS variables from CURSOR\_CONTEXT.md

\- Replace all default blue colors in these files:

&nbsp; \* src/app/nova-pristupnica/page.tsx

&nbsp; \* src/app/auth/login/page.tsx

&nbsp; \* src/app/admin/page.tsx

\- Use branding colors: navy (#0B2C49), blue (#005B99), orange (#F28C38), red (#C63B3B)

\- Primary buttons: orange

\- Secondary buttons: blue

\- Headers: navy



TASK 3: Add internationalization (i18n)

\- Create src/lib/i18n.ts with useTranslations hook

\- Create src/locales/sr/common.json with Serbian translations

\- Create src/locales/en/common.json with English translations

\- Add language selector (SR/EN) to nova-pristupnica page (top right)

\- Make all user-facing text in pristupnica use translation keys



TASK 4: Update pristupnica checkboxes

Change checkbox labels to:

\- ☐ Prihvatam Statut i pravila sindikata. (obavezno)

\- ☐ Potvrđujem da sam pročitao/la i razumeo/la <a href="/politika-privatnosti">Politiku privatnosti</a>. (neobavezno)

\- ☐ Dajem saglasnost da primam informativne e-mail poruke. (dobrovoljno)



Add agree\_newsletter field to form state and API.



TASK 5: Test everything

After each task, show me:

\- What files were changed

\- What to test

\- Expected behavior



Start with TASK 1. After I confirm it works, move to TASK 2, etc.

```



---



\## 🎯 \*\*CURSOR TIPS\*\*



\### 1. \*\*Ctrl+K\*\* - Quick Edit

Za brze promene u trenutnom fajlu:

```

Change all blue-600 classes to brand-blue (#005B99)

```



\### 2. \*\*Ctrl+I\*\* - Composer

Za multi-file promene:

```

Add branding colors to all pages

```



\### 3. \*\*@filename\*\* - Reference fajl

```

@CURSOR\_CONTEXT.md Fix the Supabase connection based on this context

```



\### 4. \*\*Cmd+Shift+P\*\* - Command Palette

```

Cursor: Chat with Codebase

