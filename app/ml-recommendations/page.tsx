"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MLRecommendationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/sathi');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Opening Sathi 🧳 AI Companion...</p>
      </div>
    </div>
  )
}
