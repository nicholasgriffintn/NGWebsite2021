import { useAppContext } from '../context/store';
import { useQuery } from 'react-query';
import Image from 'next/image';

import ReturnImageFormattingUrl from '../utils/returnImageFormattingUrl';

const FeaturedProjectsWidget = () => {
  const { fetchProjects } = useAppContext();

  const { isLoading, error, data } = useQuery('projects_hp', () =>
    fetchProjects()
  );

  return (
    <div className="github-widget">
      {isLoading === true ? (
        <p>Please wait just one sec while the projects load...</p>
      ) : error ? (
        <p>An error occurred while fetching the projects.</p>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="item-cards">
              {data.map((project) => {
                return (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-card"
                    key={`item-card-${project.name}`}
                  >
                    <div className="item-image">
                      <Image
                        alt={project.name}
                        src={ReturnImageFormattingUrl(project.image)}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                        placeholder="blur"
                        blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
                          project.image
                        )}&w=16&q=1`}
                      />
                    </div>
                    <div className="item-content">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <p>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit the site
                        </a>
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default FeaturedProjectsWidget;
