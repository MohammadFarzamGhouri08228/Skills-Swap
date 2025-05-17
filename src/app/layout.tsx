import "../styles/index.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkillSwap - Education Platform",
  description: "A platform for sharing and learning skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
