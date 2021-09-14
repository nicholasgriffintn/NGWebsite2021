import { withSentry } from '@sentry/nextjs';

const Github = (req, res) => {
  return new Promise((resolve) => {
    res.setHeader('Cache-Control', 'max-age=180000');
    res.json([
      {
        name: 'AccroPress',
        description:
          'During my time at Accrosoft, I built a custom CMS system that the company used for clients called AccroPress, it is a fully headless CMS system with a React frontend and Node Express backend.',
        url: 'https://accropress.com',
        image: 'https://cdn.nicholasgriffin.dev/images/projects/accropress.png',
      },
      {
        name: 'AccroPress Nova',
        description:
          'Alongside the main CMS service, I built a seperate website hosting platform that is linked to the CMS and provides extra capabilities to the sites that it hosts such as job hosting and more.',
        url: 'https://nova.accropress.com',
        image:
          'https://cdn.nicholasgriffin.dev/images/projects/accropress_nova.png',
      },
      {
        name: 'Whittlesey Electrical Ltd',
        description:
          'Whittlesey Electrical are NICEIC registered electricans that provide a range of electrical services, I built a new website for them so that they could grow their brand online. It uses Next.JS and Vercel for hosting.',
        url: 'https://www.whittleseyelectrical.co.uk/',
        image:
          'https://cdn.nicholasgriffin.dev/images/projects/whittleseyelectrical.png',
      },
      {
        name: 'Bouygues Construction UK Careers',
        description:
          'During my time at Vacancy Filler, I worked on a careers site for Bouygues Construction UK that helped to launch their new initiative for posting careers across the newly established groups, with cross promotion between the companies.',
        url: 'https://careers.bouygues-construction.co.uk/',
        image: 'https://cdn.nicholasgriffin.dev/images/projects/bouygues.png',
      },
      {
        name: 'TechNutty',
        description:
          'TechNutty was a technology news and reviews site that I started during college/uni in 2011, I ran it for some time as a side project and a way of experimenting with developement. Sadly, a few years back I did choose to shut down this site, so Ive included a link to wayback machine instead :)',
        url: 'https://web.archive.org/web/collections/*/https://technutty.co.uk',
        image: 'https://cdn.nicholasgriffin.dev/images/projects/technutty.png',
      },
      {
        name: 'Education Job Finder',
        description:
          'Education Job Finder was one of the first projects that I worked on at Vacancy Filler, it is an education-focused job board from Norfolk County Council that promotes vacancies across the region.',
        url: 'https://www.educationjobfinder.org.uk/',
        image:
          'https://cdn.nicholasgriffin.dev/images/projects/educationjobfinder.png',
      },
    ]);
    res.status(200).end();
    return resolve();
  });
};

export default withSentry(Github);
