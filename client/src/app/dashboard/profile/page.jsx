import React from 'react'
import ProfileHero from './sections/ProfileHero'
import ProfileAbout from './sections/ProfileAbout';
import Education from './sections/Education';
import ProfileProjects from './sections/ProfileProjects';
import ProfileSkills from './sections/ProfileSkills';
import ProfileExperience from './sections/ProfileExperience';

const page = () => {
  return (
    <main>
        <ProfileHero />
        <ProfileAbout />
        <Education />
        <ProfileProjects/>
        <ProfileSkills/>
        <ProfileExperience/>
    </main>
  )
}
export default page;