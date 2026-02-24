"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function Fir() {
  const[no,noIn]=useState(0)
  return (
    <div className='flex items-center justify-center mt-30'>
      <Button onClick={()=>{noIn(no+1)
        console.log(no)
      }}>press</Button>

    </div>
  )
}

export default Fir