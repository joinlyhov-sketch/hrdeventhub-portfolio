import GroupHeader from '@/components/group/GroupHeader';
import React from 'react'

export default function layout({children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div>
        {children}
    </div>
    </>
    
  )
}
