"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperType from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

//****** swiper and slider implementation needed to be studied */

interface ImageSliderProps {
  urls: string[];
}

const ImageSlider = ({ urls }: ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1, // end of the images count
  });

  // useEffect is used to track the counting of images
  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300';
  const inactiveStyles = 'hidden text-gray-400';

  return (
    <div className='group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl'>
      <div className='absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition'>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, 'right-3 trasition', {
            [inactiveStyles]: slideConfig.isEnd,
            'hover:bg-primary-300 text-primary-800 opacity-100':
              !slideConfig.isEnd,
          })}
          aria-label='next image'
        >
          <ChevronRight className='h-4 w-4 text-zinc-700' />{' '}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, 'left-3 trasition', {
            [inactiveStyles]: slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100':
              !slideConfig.isBeginning,
          })}
          aria-label='previous image'
        >
          <ChevronLeft className='h-4 w-4 text-zinc-700' />{' '}
        </button>
      </div>
      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination]}
        className='h-full w-full'
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className='-z-10 relative h-full w-full'>
            <Image
              src={url}
              alt='Product Image'
              fill
              loading='eager'
              className='-z-10 h-full w-full object-cover object-center'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
