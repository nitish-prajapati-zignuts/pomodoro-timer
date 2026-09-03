"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogIn, LogOut, X, ShieldCheck, Sparkles } from "lucide-react";

export function LoginButton() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (name = "Marcus Aurelius", email = "marcus@stoicfocus.com") => {
    try {
      setLoading(true);
      await signIn("credentials", {
        name,
        email,
        callbackUrl: "/",
        redirect: false,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    await handleDemoLogin(customName || "Ancient Scholar", customEmail);
  };

  if (status === "loading") {
    return <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="user-badge">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={26}
              height={26}
              className="user-avatar-img"
            />
          ) : (
            <div className="user-avatar-fallback">
              {session.user.name?.[0] || "S"}
            </div>
          )}
          <span className="user-name-text">
            {session.user.name || session.user.email}
          </span>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="iconbtn"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="streak-btn"
        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <LogIn size={15} style={{ color: "var(--gold-primary)" }} />
        <span>Sign In</span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Ancient Scholars Sanctuary</h3>
                  <p className="modal-subtitle">Save your streaks, tasks &amp; focus analytics</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* 1-Click Instant Demo Login */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("Marcus Aurelius", "marcus@ancientpomodoro.com")}
              className="demo-login-btn"
            >
              <Sparkles size={17} style={{ color: "var(--gold-primary)" }} />
              <span>One-Click Sign In (Scholar Profile)</span>
            </button>
            <p className="demo-login-subtext">
              Instant access — no external password or OAuth required
            </p>

            {/* Divider */}
            <div className="modal-divider">
              <div className="modal-divider-line" />
              <span className="modal-divider-text">Or Social Sign In</span>
              <div className="modal-divider-line" />
            </div>

            {/* Social Logins */}
            <div className="social-btn-stack">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="social-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
                  <path
                    fill="#EA4335"
                    d="M12 5c1.54 0 2.9.54 3.96 1.43l2.96-2.96C17.1 1.74 14.73 1 12 1 7.42 1 3.53 3.59 1.63 7.37l3.6 2.79C6.1 7.2 8.8 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.28c0-.82-.07-1.6-.2-2.28H12v4.51h6.47c-.28 1.48-1.12 2.74-2.38 3.58l3.65 2.83c2.14-1.97 3.76-4.9 3.76-8.64z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.23 14.84c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.63 7.69C.59 9.77 0 12.06 0 14.5s.59 4.73 1.63 6.81l3.6-2.79z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 6-1.07 8-2.92l-3.65-2.83c-1.08.73-2.47 1.18-4.35 1.18-3.2 0-5.9-2.2-6.77-5.16L1.63 16c1.9 3.78 5.79 6.37 10.37 6.37z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => signIn("github")}
                className="social-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white" style={{ flexShrink: 0 }}>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Custom sign in form */}
            <form onSubmit={handleCustomLogin} className="auth-form">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Scholar Name (e.g. Hypatia of Alexandria)"
                className="auth-input"
              />
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Email address"
                className="auth-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                Sign In with Custom Email
              </button>
            </form>

            <div className="security-badge">
              <ShieldCheck size={14} style={{ color: "var(--gold-primary)" }} />
              <span>Sessions are stored securely in MongoDB &amp; encrypted JWT</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
