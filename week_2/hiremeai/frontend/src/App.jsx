
import { useState, useRef, useEffect } from "react";
import "./App.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

const suggestions = [
  "What are your technical skills?",
  "Tell me about your projects",
  "What is your educational background?",
];

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = question) {
    const cleanQuestion = text.trim();

    if (!cleanQuestion || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: cleanQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      if (!API_BASE_URL) {
        throw new Error(
          "VITE_API_URL missing hai. Vercel Environment Variables check karo."
        );
      }

      // Validate the backend URL before sending the request.
      let apiUrl;

      try {
        apiUrl = new URL(API_BASE_URL);
      } catch {
        throw new Error(
          `Invalid backend URL: ${API_BASE_URL}`
        );
      }

      if (!["https:", "http:"].includes(apiUrl.protocol)) {
        throw new Error("Backend URL ka protocol invalid hai.");
      }

      // Prevent accidentally sending requests to the frontend domain.
      if (apiUrl.hostname.endsWith("vercel.app")) {
        throw new Error(
          "VITE_API_URL mein frontend URL hai. Render backend URL set karo."
        );
      }

      const chatUrl = `${apiUrl.origin}${apiUrl.pathname.replace(/\/+$/, "")}/chat`;

      console.log("HireMeAI API URL:", chatUrl);

      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
        }),
      });

      // Read the response as text first, because errors may not be JSON.
      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Backend ne valid JSON nahi diya. HTTP ${response.status}. Response: ${responseText.slice(0, 200)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.detail || `Backend error: HTTP ${response.status}`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No answer received.",
        },
      ]);
    } catch (error) {
      console.error("HireMeAI request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Request failed: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function newConversation() {
    setMessages([]);
    setQuestion("");
    inputRef.current?.focus();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-icon">H</span>
          <span>
            HireMe<span className="brand-accent">AI</span>
          </span>
        </a>

        <button className="new-chat" onClick={newConversation}>
          <span className="plus-icon">+</span>
          New conversation
        </button>

        <div className="sidebar-section">
          <div className="sidebar-label">YOUR ASSISTANT</div>
          <div className="sidebar-note">
            <span className="status-dot" />
            Resume-powered assistant
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">MS</div>
          <div className="profile-info">
            <strong>Manan Sahni</strong>
            <span>Candidate profile</span>
          </div>
          <span className="profile-status" title="Profile loaded">
            ●
          </span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <span className="status-dot" />
            <span>
              HireMeAI <span className="topbar-muted">/ Assistant</span>
            </span>
          </div>
          <span className="topbar-tag">RESUME ASSISTANT</span>
        </header>

        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">H</div>

              <div className="eyebrow">
                YOUR PERSONAL CANDIDATE ASSISTANT
              </div>

              <h1>
                Get to know
                <br />
                <span>Manan Sahni.</span>
              </h1>

              <p className="welcome-description">
                Curious about my skills, projects, or experience?
                Ask a question and explore my professional profile.
              </p>

              <div className="suggestion-heading">
                <span>GET STARTED</span>
                <span className="suggestion-count">03 SUGGESTIONS</span>
              </div>

              <div className="suggestions">
                {suggestions.map((item, index) => (
                  <button
                    key={item}
                    className="suggestion"
                    onClick={() => sendMessage(item)}
                    disabled={loading}
                  >
                    <span className="suggestion-number">
                      0{index + 1}
                    </span>
                    <span className="suggestion-text">{item}</span>
                    <span className="suggestion-arrow">↗</span>
                  </button>
                ))}
              </div>

              <div className="welcome-footnote">
                <span className="mini-dot" />
                Answers based on my professional resume
              </div>
            </div>
          ) : (
            <div className="messages">
              <div className="conversation-label">
                <span className="mini-dot" />
                CONVERSATION
              </div>

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? "Y" : "H"}
                  </div>

                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-name">
                        {message.role === "user" ? "You" : "HireMeAI"}
                      </span>

                      {message.role === "assistant" && (
                        <span className="assistant-label">
                          ASSISTANT
                        </span>
                      )}
                    </div>

                    <div className="message-text">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row assistant">
                  <div className="message-avatar">H</div>

                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-name">HireMeAI</span>
                      <span className="assistant-label">
                        ASSISTANT
                      </span>
                    </div>

                    <div className="message-text typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <footer className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about skills, projects, education..."
              aria-label="Your message"
              disabled={loading}
            />

            <button
              className="send-button"
              type="submit"
              disabled={loading || !question.trim()}
              aria-label="Send message"
            >
              ↑
            </button>
          </form>

          <p className="disclaimer">
            <span>↳</span> AI-generated responses based on available
            resume information.
          </p>
        </footer>
      </main>
    </div>
  );
}

