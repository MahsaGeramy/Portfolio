# Mahsa Geramy — Portfolio

A modern, responsive personal portfolio built with **Next.js, TypeScript, and Tailwind CSS**.

The portfolio showcases my frontend development experience, selected projects, technical skills, and provides a way to get in touch with me.

🌐 **Live Website:** [mahsageramy.ir](https://mahsageramy.ir)

---

## ✨ Features

* 🎨 Modern and responsive UI
* 📱 Fully responsive design for mobile, tablet, and desktop
* ⚡ Built with Next.js App Router
* 🧩 Reusable and typed React components
* 🖼️ Optimized images with Next.js Image
* 🎯 Smooth section navigation with active navigation state
* 💼 Projects showcase with horizontal slider
* 📩 Functional contact form
* ✉️ Email delivery using Resend
* 🌐 Custom domain with Vercel
* 🌙 Dark mode support
* ♿ Accessible semantic HTML and interactive elements
* 🚀 Production deployment with Vercel
* 🔧 TypeScript for type safety
* 📦 Clean and maintainable project structure

---

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**

### UI & Icons

* **Lucide React**
* **React Icons**

### Backend / Services

* **Next.js API Routes**
* **Resend** — Contact form email delivery

### Deployment

* **Vercel**
* **Custom `.ir` domain**

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── _components/
│   │   ├── sections/
│   │   ├── slider/
│   │   └── ui/
│   │
│   ├── api/
│   │   └── contact/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
public/
├── images/
└── fonts/
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MahsaGeramy/Portfolio.git
```

### 2. Navigate to the project

```bash
cd Portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com
```

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📬 Contact Form

The portfolio includes a server-side contact form powered by **Resend**.

The flow is:

```text
User
  ↓
Contact Form
  ↓
Next.js API Route
  ↓
Resend
  ↓
Email Inbox
```

The API route handles the form submission and sends the message to the configured email address.

---

## 🎯 Goals

This project is more than a personal website. It is also a continuously evolving project where I experiment with:

* Modern frontend architecture
* Performance optimization
* Responsive UI development
* Accessibility
* Server-side rendering
* Type-safe React development
* Clean component architecture
* Production deployment

---

## 🔗 Links

* **Portfolio:** [mahsageramy.ir](https://mahsageramy.ir)
* **GitHub:** [github.com/MahsaGeramy](https://github.com/MahsaGeramy)

---

## 👩🏻‍💻 About Me

I'm **Mahsa Geramy**, a Frontend Developer focused on building modern, scalable, and user-friendly web applications.

My current focus is on strengthening my frontend engineering skills while developing a broader understanding of software engineering, backend systems, and modern development workflows.

---

## 📄 License

This project is for personal portfolio purposes.
