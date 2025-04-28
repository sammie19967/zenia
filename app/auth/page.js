import AuthExample from '@/components/Auth'
import EmailAuth from '@/components/EmailAuth'
import GoogleAuth from '@/components/GoogleAuth'
import PhoneSignIn from '@/components/PhoneSignIn'
import React from 'react'

const page = () => {
  return (
    <div>
        <EmailAuth/>
        <GoogleAuth/>
        <PhoneSignIn/>
        
    </div>
  )
}

export default page