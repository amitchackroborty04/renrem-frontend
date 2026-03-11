import React from 'react'
import PeptideTherapySection from './_components/PeptideTherapySection'
import PeptideTherapyBenefitsSection from './_components/PeptideTherapyBenefitsSection'
import { Faq } from '@/components/Faq'
import DynamicHeroSection from '@/components/MenhrtHero'

const page = () => {
  return (
    <div>
        <DynamicHeroSection
            bgImage="/ppp.png"
            title={`FEEL STRONGER\nHEAL FASTER`}
            description="Peptide therapy helps your body recover, regenerate, and perform at its best—naturally and effectively."
          />
      <PeptideTherapySection/>
      <PeptideTherapyBenefitsSection/>
      <Faq/>
    </div>
  )
}

export default page
