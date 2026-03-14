import { Faq } from '@/components/Faq'
import DynamicHeroSection from '@/components/MenhrtHero'
import React from 'react'

export default function page() {
  return (
<>
     <DynamicHeroSection
      bgImage="/menhtrt-hero.png"
      title={`FEEL LIKE\nYOU AGAIN`}
      description="TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most."
    />
    <Faq/>
</>
  )
}
 