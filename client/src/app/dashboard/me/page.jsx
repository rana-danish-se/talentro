import React from 'react'
import ProfileHero from './sections/ProfileHero'
import ProfileAbout from './sections/ProfileAbout';
import Education from './sections/Education';
import ProfileProjects from './sections/ProfileProjects';
import ProfileSkills from './sections/ProfileSkills';
import ProfileExperience from './sections/ProfileExperience';
import ServicesSection from './sections/Services';

const page = () => {
  return (
    <main>
        <ProfileHero />
        <ProfileAbout />
        <Education />
        <ProfileProjects/>
        <ProfileSkills/>
        <ServicesSection/>
        <ProfileExperience/>
    </main>
  )
}
export default page;