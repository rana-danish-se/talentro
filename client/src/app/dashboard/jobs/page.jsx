import React from 'react'
import JobsSection from './sections/Jobs';
import PostJob from './sections/PostJob';

const JobPage = () => {
  return (
    <main className='flex items-start px-10  justify-center gap-10'>
        <PostJob/>
        <JobsSection/>
    </main>
  )
}

export default JobPage;
