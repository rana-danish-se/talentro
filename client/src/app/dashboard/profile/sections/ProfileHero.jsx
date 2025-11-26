import React from 'react'
import BannerDP from '../components/BannerDP'
import Information from '../components/Information'

const ProfileHero = () => {
  return (
    <section className='max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border pb-10 mx-auto rounded-xl overflow-hidden mt-10'>
        <BannerDP />
        <Information/>
    </section>
  )
}

export default ProfileHero