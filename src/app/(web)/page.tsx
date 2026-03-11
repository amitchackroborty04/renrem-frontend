import HomeHero from '@/components/HomeHero'
import React from 'react'
import HealthMove from './_components/HealthMove'
import Menhormone from './_components/Menhormone'
import HomeCarusal from './_components/HomeCarusal'
import MembersSection from './_components/MembersSection'
import FAQSection from './_components/FAQSection'
import UnlockSection from './_components/UnlockSection'

function page() {
  return (
    <div>
        <HomeHero />
        <HealthMove />
        <Menhormone />
        <HomeCarusal />
        <MembersSection />
        <FAQSection />
        <UnlockSection />
    </div>
  )
}

export default page