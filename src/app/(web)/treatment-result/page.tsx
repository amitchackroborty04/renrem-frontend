import React, { Suspense } from 'react'
import TreatmentResultPage from './TreatmentResultPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <TreatmentResultPage/>
      </Suspense>
    </div>
  )
}

export default page
