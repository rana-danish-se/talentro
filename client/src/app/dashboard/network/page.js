import React from 'react'
import Connections from './sections/Connections'
import ManageNetwork from './sections/Manage';

const NetworkPage = () => {
      const sampleNetworkStats = {
    connections: 1646,
    groups: 17,
    pages: 80,
    newsletters: 8
  };
  return (
    <main className='py-10  flex items-start  gap-10 justify-center'>
         <ManageNetwork networkStats={sampleNetworkStats} />
        <Connections/>
    </main>
  )
}

export default NetworkPage