'use client'

import { useState } from 'react'

export default function SlideViewer({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + urls.length) % urls.length)
  const next = () => setIndex((i) => (i + 1) % urls.length)

  return (
    <>
      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {urls.map((url, i) => (
          <button key={i} onClick={() => { setIndex(i); setOpen(true) }} className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Slide ${i + 1}`}
              className="h-40 w-auto rounded border border-gray-200 hover:opacity-80 transition-opacity"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setOpen(false)}
        >
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white text-4xl font-bold px-4 py-2 hover:text-gray-300"
          >
            ‹
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urls[index]}
              alt={`Slide ${index + 1}`}
              className="max-h-[90vh] w-auto rounded"
            />
            <div className="absolute bottom-3 left-0 right-0 text-center text-white text-sm">
              {index + 1} / {urls.length}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white text-4xl font-bold px-4 py-2 hover:text-gray-300"
          >
            ›
          </button>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
