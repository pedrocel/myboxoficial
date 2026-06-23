import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules'
import { useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

type Props = {
  images: string[]
  alt?: string
}

export function UnitGalleryCarousel({ images, alt = 'My Box' }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const slides = images.filter(Boolean)

  if (!slides.length) return null

  return (
    <section className="relative" data-aos="fade-up">
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="unit-gallery-main rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-mydark/40 to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          watchSlidesProgress
          className="unit-gallery-thumbs mt-3 px-1"
          breakpoints={{ 640: { slidesPerView: 5 }, 1024: { slidesPerView: 6 } }}
        >
          {slides.map((src, i) => (
            <SwiperSlide key={i} className="cursor-pointer">
              <img
                src={src}
                alt=""
                className="w-full h-16 sm:h-20 object-cover rounded-xl border-2 border-transparent swiper-thumb-img transition"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}
