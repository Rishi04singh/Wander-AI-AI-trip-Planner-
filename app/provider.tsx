import React from 'react'
import Header from './_components/Header';

function provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        
        <Header/>
        
        {children}</div>
  )
}   

export default provider