Based on your screenshot (`image_de8945.jpg`), the issue is that **my previous conversational text was pasted into the file** along with the code.

You currently have this text at the top of your file:

> *"still working on it... Here is the complete README.md file content..."*

This is breaking the layout because GitHub treats it as the first paragraph of your document, pushing the title down and making it look messy.

### The Fix

**Delete everything** currently in your `README.md` file. Then, copy **only** the code block below and paste it in.

```markdown
<div align="center">
  <img src="public/logo.png" alt="JDify Logo" width="100" height="100" />
  <h1>JDify - AI-Powered Resume Builder 🚀</h1>
  <p>
    <strong>Your resume, built by you. Judged by AI.</strong>
  </p>
</div>

---

JDify is a modern, AI-powered resume builder designed to help users craft professional, ATS-friendly resumes in seconds. It goes beyond simple formatting by offering AI-driven insights—letting your resume be "Judged by AI" to ensure it matches your target job description perfectly.

## 📺 Demo

Watch JDify in action:

[![Watch the Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://youtu.be/YOUR_VIDEO_ID)

*If the video above doesn't load, you can find the demo file in the repository at `public/demo.mp4`.*

---

## ✨ Features

-   **🤖 AI Resume Writing:** Auto-generate professional summaries and bullet points.
-   **⚖️ Judged by AI:** Get real-time feedback and a match score against specific job descriptions.
-   **📝 Real-time Preview:** See changes instantly as you edit your resume.
-   **🔐 Secure Authentication:** User accounts managed securely via Supabase (Email/Password & Magic Links).
-   **📄 PDF Export:** Download high-quality, ATS-optimized PDFs.
-   **🎨 Modern UI:** A responsive and interactive interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend/Auth:** [Supabase](https://supabase.com/)
-   **AI Integration:** OpenAI API (or compatible LLM provider)

---

## 🏁 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18.17.0 or later)
-   npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone [https://github.com/maneth909/ai-resume-builder.git](https://github.com/maneth909/ai-resume-builder.git)
cd ai-resume-builder

```

### 2. Install Dependencies

```bash
npm install
# or
yarn install

```

### 3. Environment Variables (Crucial Step!) ⚠️

This project relies on **Supabase** for authentication/database and an **AI Provider** for generating content. You must set up your environment variables for the app to function.

1. Create a file named `.env.local` in the root directory of the project.
2. Copy the code below and fill in your specific keys:

```env
# --- Supabase Configuration ---
# Get these from your Supabase Dashboard -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# --- AI Configuration ---
# Get this from platform.openai.com (or your specific provider)
OPENAI_API_KEY=your_openai_api_key

# --- App Configuration ---
# The URL of your app (default for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

> **Note:** If you do not have a Supabase project, create a free one at [database.new](https://database.new).

### 4. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Built with ❤️ by <a href="https://www.google.com/search?q=https://github.com/maneth909">Maneth</a>
</div>

```

```
