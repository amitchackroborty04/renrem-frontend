import React from 'react'
import { Faq } from '@/components/Faq'
import DynamicHeroSection from '@/components/MenhrtHero'
import IvTherapyBenefitsSection from './_components/IvTherapyBenefitsSection'
import IvTherapySection from './_components/IvTherapySection'

const page = () => {
  return (
    <div>
        <DynamicHeroSection
            bgImage="/iv.png"
            title={`FEEL REFRESHED.\nRECOVER FASTER.`}
            description="IV Therapy delivers essential vitamins and nutrients directly into your bloodstream for fast, effective results."
          />
      <IvTherapySection/>
      <IvTherapyBenefitsSection/>
      <Faq/>
    </div>
  )
}

export default page
