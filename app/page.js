import AdList from '@/components/AdList'
import DynamicForm from '@/components/DynamicForm'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import SponsoredAds from '@/components/SponsoredAds'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <SponsoredAds/>
      
    </div>
  )
}

export default page