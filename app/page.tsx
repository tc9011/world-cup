"use client";

import { useStore } from "@/store/useStore";

export default function Home() {
  const { bears, increasePopulation, removeAllBears } = useStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <p className="text-xl font-bold">
            Next.js + Tailwind + TypeScript + Zustand
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
          Bears: {bears}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={increasePopulation}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Add Bear
          </button>
          <button
            onClick={removeAllBears}
            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 transition-colors"
          >
            Remove All
          </button>
        </div>
      </div>
    </main>
  );
}
