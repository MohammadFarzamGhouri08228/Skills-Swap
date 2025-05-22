import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillSwap - User Dashboard',
  description: 'Welcome to your SkillSwap dashboard. Manage your profile, view your skills, and connect with other users.',
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 