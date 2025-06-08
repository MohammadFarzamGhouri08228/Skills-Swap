import Link from 'next/link'
import React from 'react'

type Props = {
  title: string
}

export default function Breadcrumb({ title }: Props) {
  return (
    <section className="relative w-full overflow-x-hidden">
      {/* Full-width yellow block heading */}
      <div className="relative z-20 w-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 border-b-4 border-yellow-400 shadow-2xl">
        <div className="flex flex-col items-center gap-6 justify-center py-14">
          {/* Icon in a glowing circle */}
          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100/80 shadow-xl p-7 border-4 border-yellow-400 ring-4 ring-yellow-200/40 mb-4 animate-pulse">
            <svg
              className="w-16 h-16 text-yellow-500 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"
              />
            </svg>
          </span>
          {/* Modern glassy card for heading */}
          <div className="relative px-10 py-6 rounded-3xl shadow-2xl border-4 border-yellow-300 bg-white/70 backdrop-blur-xl flex flex-col items-center max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-tight text-yellow-700 text-center bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(255,215,0,0.35)]">
              <span className="italic text-yellow-900">{title}</span>
            </h1>
            {/* Decorative accent bar */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full blur-sm opacity-70"></div>
            {/* Breadcrumb navigation */}
            <div className="mt-6 text-yellow-700 font-medium flex items-center gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1 text-yellow-500">/</span>
              <span>{title}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}