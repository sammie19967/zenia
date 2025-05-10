// This is the main entry point for the application
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import SponsoredAds from '@/components/SponsoredAds'
import React from 'react'

const page = () => {
  return (
    <div>
     
      <Hero/>
      <SponsoredAds/>
      
    </div>
  )
}
export default page