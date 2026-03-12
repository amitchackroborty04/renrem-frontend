import React from 'react'
import { Faq } from '@/components/Faq'
import DynamicHeroSection from '@/components/MenhrtHero'
import WonenHRTSection from './_components/WonenHRTSection'
import WonenHrtBenefitsSection from './_components/WonenHrtBenefitsSection'


const page = () => {
  return (
    <div>
        <DynamicHeroSection
            bgImage="/women.png"
            title={`FEEL BALANCED. FEEL LIKE YOURSELF AGAIN.`}
            description="TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most."
          />
      <WonenHRTSection/>
      <WonenHrtBenefitsSection/>
      <Faq/>
    </div>
  )
}

export default page
