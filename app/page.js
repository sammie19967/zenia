import AdList from '@/components/AdList'
import DynamicForm from '@/components/DynamicForm'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <AdList />
    </div>
  )
}

export default page