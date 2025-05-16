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
      <body>
        {children}
      </body>
    </html>
  );
}
