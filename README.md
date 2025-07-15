# 🤖 Chatbot AI

A fully responsive, beautifully designed ChatGPT-style chatbot web app built with **vanilla HTML, CSS, and JavaScript**. This project mimics the modern UX of ChatGPT, complete with Markdown rendering, syntax highlighting, LaTeX math formatting, session history, and real-time streaming response.

---

## 🌐 Live Preview

<img width="1918" height="968" alt="image" src="https://github.com/user-attachments/assets/fb7fd7a7-ebd0-4b39-b9e5-6cb273c17d16" />

🟢 Deployed on: **[Vercel](https://chatbot-ai-pied-rho.vercel.app)**  
🔗 Live App: [https://chatbot-ai-pied-rho.vercel.app](https://chatbot-ai-pied-rho.vercel.app)

---

## ✨ Features

| Feature                         | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| 💬 **Streaming Chat UI**         | Responses appear in real-time like ChatGPT                                 |
| 📑 **Chat History**              | Sidebar with rename, delete, and restore sessions                          |
| 🌙 **Dark Mode UI**              | Sleek, modern dark UI with blur and depth                                  |
| 🧠 **Markdown Support**          | Render formatted text, links, bold, italics, lists                         |
| 💡 **Syntax Highlighting**       | Highlight code blocks using PrismJS                                        |
| 📋 **Copy Code Button**          | Instant copy-to-clipboard for all code blocks                              |
| 📐 **Math LaTeX Support**        | Render equations using MathJax `$E = mc^2$`                                |
| 🛑 **Stop Generating Button**    | Stop AI response mid-way with one click                                    |
| 💾 **LocalStorage Support**      | Persists all chat sessions locally                                         |
| ⚙️ **No Framework Used**         | 100% Vanilla JS, CSS, and HTML                                             |

---

## 📂 Project Structure

```text
chatbot-ai/
├── index.html     # Main layout
├── style.css      # Dark theme and modern styling
├── main.js        # Chat logic, rendering, and session handling
└── README.md      # You’re reading it now 😄
```

---

## 📸 Screenshots

> Gantilah gambar ini dengan tangkapan layar proyek kamu:

- ![Screenshot 1](https://user-images.githubusercontent.com/yourusername/screenshot-1.png)
- ![Screenshot 2](https://user-images.githubusercontent.com/yourusername/screenshot-2.png)

---

## 📚 How It Works

### 💡 Chat Session Lifecycle

1. User types a message  
2. Session created (if not exists)  
3. Message stored in `localStorage`  
4. AI response streamed word-by-word  
5. Markdown → HTML conversion via custom parser  
6. Code blocks rendered & highlighted  
7. Session persists on reload  

---

## 🧪 Technology Stack

| Category       | Tech Used                     | Purpose                              |
|----------------|-------------------------------|--------------------------------------|
| 💻 Frontend     | HTML5, CSS3, JavaScript       | Core UI, styling, behavior           |
| 🎨 Styling      | Pure CSS (no framework)       | Dark mode, animations, layout        |
| 🧠 AI Chat      | Any chat-completion API       | Handles streaming responses          |
| 📚 Markdown     | Custom parser in `main.js`    | Parses `**bold**`, `*italic*`, etc.  |
| 🔣 Highlighting | PrismJS                       | Code syntax highlight for JS, HTML   |
| 📐 Math         | MathJax                       | Render LaTeX math formulas           |
| 🌐 Deployment   | Vercel                        | Instant hosting                      |

---

## 🛠 Getting Started

1. **Clone the Repo**
git clone https://github.com/FikriAnwar0/chatbot-ai.git
cd chatbot-ai


2. **Open in Browser**
Just open index.html in your browser
start index.html


3. **Customize if Needed**

- Change model or API key inside `main.js`
- Modify style in `style.css`

---

## 🎨 Customization Guide

| Component     | File         | What You Can Customize                        |
|---------------|--------------|-----------------------------------------------|
| 🎨 Colors     | `style.css`  | Primary color, background, scrollbar, etc.    |
| 💬 Chat flow | `main.js`    | Message formatting, session logic             |
| 🚀 API        | `main.js`    | Endpoint, model, headers                      |
| 🖼 UI Layout  | `index.html` | HTML structure, icons, accessibility          |

---

## 📖 FAQ

> ❓ **Apakah chatbot ini bekerja offline?**  
🔸 Tidak, karena ia bergantung pada API eksternal untuk AI reply.

> ❓ **Apakah ini bisa dipakai dengan model selain GPT?**  
🔸 Ya! Kamu cukup ubah endpoint dan nama model di `main.js`.

> ❓ **Apakah ini aman digunakan?**  
🔸 Ya. Data tersimpan lokal (via `localStorage`), tidak dikirim ke server lain selain endpoint AI.

---

## 📃 License

MIT License © [FikriAnwar0](https://github.com/FikriAnwar0)

---

## 🙌 Acknowledgements

Thanks to:
- [Font Awesome](https://fontawesome.com)
- [MathJax](https://www.mathjax.org/)
- [PrismJS](https://prismjs.com/)
- Open Source ❤️

---

> ⭐ Jangan lupa kasih ⭐ star repo ini jika kamu suka. Pull requests dan kolaborasi sangat diterima!
