import React from 'react'
import { Faq } from '@/components/Faq'
import DynamicHeroSection from '@/components/MenhrtHero'
import WeightlossTherapySection from './_components/WeightlossTherapySection'
import WeightlossTherapyBenefitsSection from './_components/WeightlossTherapyBenefitsSection'


const page = () => {
  return (
    <div>
        <DynamicHeroSection
            bgImage="/weight.png"
            title={`Lose weight, feel\ngreat!`}
            description="TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most."
          />
      <WeightlossTherapySection/>
      <WeightlossTherapyBenefitsSection/>
      <Faq/>
    </div>
  )
}

export default page
