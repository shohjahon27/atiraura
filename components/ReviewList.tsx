'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { format } from 'date-fns'

interface Review {
  _id: string
  name: string
  rating: number
  comment: string
  pros: string
  cons: string
  size: string
  color: string
  _createdAt: string
}

const ReviewCarousel = ({ reviews }: { reviews: Review[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, slidesToScroll: 1 })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  return (
    <div className="relative mt-10 px-4 max-w-7xl mx-auto">
      <div className="text-xl font-semibold text-center mb-6 text-gray-800">
        💬 Mijozlarning Fikrlari
      </div>

      {reviews.length === 0 ? (
        <div className="text-center text-gray-600 text-base bg-gray-100 rounded-xl py-8 px-4 shadow-sm">
          Hali bu mahsulot uchun sharhlar mavjud emas. <br />
          Birinchi bo‘lib sharh qoldiring!
        </div>
      ) : (
        <>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="min-w-[300px] sm:min-w-[360px] max-w-sm bg-white border border-gray-200 rounded-2xl p-4 flex-shrink-0 shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800">{review.name}</div>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    {format(new Date(review._createdAt), 'd MMMM')}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">O‘lcham: {review.size}</p>
                  <p className="text-sm">
                    <span className="font-medium">Kamchiliklari:</span>{' '}
                    {review.cons || "Yo‘q"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Izoh:</span> {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {canScrollPrev && (
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 -left-3 sm:-left-6 transform -translate-y-1/2 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              ←
            </button>
          )}
          {canScrollNext && (
            <button
              onClick={scrollNext}
              className="absolute top-1/2 -right-3 sm:-right-6 transform -translate-y-1/2 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              →
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewCarousel
