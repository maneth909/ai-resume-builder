<div align="center">
  <img src="public/logo.png" alt="JDify Logo" width="100" height="100" />
  <h1>JDify - AI-Powered Resume Builder 🚀</h1>
</div>

## 📺 Demo
![demo](https://github.com/user-attachments/assets/05b09732-69b5-480a-bb7b-806a8d9a27ee)

---

## 🛠️ Built With

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **AI Engine:** Groq API

---

## 🚀 Getting Started

Want to run JDify locally? Let’s get you set up.

### ✅ Prerequisites

Make sure you have:
- [Node.js](https://nodejs.org/) **v18.17.0 or newer**
- npm, yarn, or pnpm

---

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/maneth909/ai-resume-builder.git
cd ai-resume-builder

```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install

```

### 3️⃣ Environment Variables (Very Important ⚠️)

JDify won’t work without these.

1. Create a file called `.env.local` in the project root
2. Copy the template below and add your keys:

```env
# --- Supabase ---
# From Supabase Dashboard 
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# From https://groq.com/
GROQ_API_KEY==your_api_key

```

### 4️⃣ Database Setup (Supabase) 🗄️

This project uses a relational database structure where every resume section resides in its own table.

You need to create separate tables corresponding to the interfaces in `types/resume.ts`

* `resume` (Parent table)
* `personal_info`
* `work_experience`
* `education`
* `skill`
* `language`
* `project` (etc...)

Then, you also need to establish relationship and enable security (RLS).


### 5️⃣ Start the Dev Server

Now that your database is ready:

```bash
npm run dev

```

Open your browser and go to:
👉 **[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)**

You should see it up and running! 🎉

---

## 🤝 Contributing

Open source gets better with friends!
If you want to improve JDify:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/cool-idea`)
3. Commit your changes (`git commit -m 'Add cool idea'`)
4. Push to your branch
5. Open a Pull Request

All contributions are welcome, big or small.
