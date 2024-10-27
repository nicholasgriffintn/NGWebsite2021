import type { Projects } from '@/types/projects';

const data: Projects = [
  {
    name: 'BBC Projects',
    description:
      'Recently I worked on rebuilding the site to transition it to the new [WebCore](https://www.bbc.co.uk/webarchive/https%3A%2F%2Fwww.bbc.co.uk%2Fblogs%2Finternet%2Fentries%2F8673fe2a-e876-45fc-9a5f-203c049c9f9c) service for a more performant and maintainable site, while renewing it to be more accessible and user friendly. Alongside that, I also spend time working on open source projects such as [SQS Consumer](https://github.com/bbc/sqs-consumer) and my general day job, which involves helping teams enhance their data and experimentation capabilities.',
    url: 'https://bbc.co.uk/opensource',
    image: '/images/projects/bbc_open_source.png',
  },
  {
    name: 'A custom CMS',
    description:
      'During my time at Accrosoft, I built a custom CMS system that the company used for clients called AccroPress, it is a fully headless CMS system with a React frontend and Node Express backend. It was used by a number of school and job sites around the world as a hosted service. It also provided a number of microservices such as image processing, contact forms, and more.',
    url: 'https://accropress.com',
    image: '/images/projects/accropress.png',
  },
  {
    name: 'Careers Sites',
    description:
      'During my time at Vacancy Filler, I worked on a number of careers sites, like Bouygues Construction UK who I helped to launch their new initiative for posting careers across the newly established groups, with cross promotion between the companies. I have also worked on a number of others across the UK such as Woodland Trust, Longleat, Devonshire Group, and many more.',
    url: 'https://careers.bouygues-construction.co.uk/',
    image: '/images/projects/bouygues.png',
  },
  {
    name: 'TechNutty',
    description:
      'TechNutty was a technology news and reviews site that I started during college/uni in 2011, I ran it for some time as a side project and a way of experimenting with developement. Sadly, a few years back I did choose to shut down this site, so Ive included a link to wayback machine instead :)',
    url: 'https://web.archive.org/web/collections/*/https://technutty.co.uk',
  },
  {
    name: 'Side Projects',
    description:
      'Alongside my day job, I have a number of side projects that I work on, some of which are open source and can be found on my GitHub. I have a number of projects that I have worked on over the years, some of which are still in development, others are just experiments.',
    url: 'https://github.com/nicholasgriffintn',
  },
];

export async function getProjects(): Promise<Projects | null> {
  return data;
}
