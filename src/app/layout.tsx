import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Ancient Pomodoro Timer — Do more in less time, stress-free",
  description:
    "Free online Pomodoro timer with ambient focus soundscapes, built-in task list, custom intervals, daily streaks, challenges, and magnificent ancient civilization living backgrounds.",
  keywords: [
    "pomodoro timer",
    "pomodoro technique",
    "focus timer",
    "ancient backgrounds",
    "productivity timer",
    "study timer",
    "deep work",
  ],
  openGraph: {
    title: "Ancient Pomodoro Timer — Do more in less time, stress-free",
    description:
      "A Pomodoro timer with background music, a built-in to-do list, custom intervals, daily streaks and challenges.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
