import type { GitHubGists } from '@/types/github';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/components/Link';
import { buttonVariants } from '@/components/ui/button';

export function SnippetsList({ gists }: { gists: GitHubGists | undefined }) {
  return (
    <section>
      {gists && gists.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {gists.map((gist) => {
            return (
              <Card key={gist.id} className="overflow-hidden">
                <CardHeader>
                  {gist.description && (
                    <CardTitle>{gist.description}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  {gist.files && Object.keys(gist.files).length > 0 ? (
                    <ul className="pb-5">
                      <li className="item-content-files-title">
                        <span>Files:</span>
                      </li>
                      {Object.keys(gist.files).map((file, index) => {
                        if (!gist.files[file]) return null;

                        return (
                          <li
                            key={`file-${gist.files[file].filename}-${index}`}
                            className="item-content-files-file"
                          >
                            <strong>{gist.files[file].filename}</strong>
                            <span className="item-card__meta">
                              Type: {gist.files[file].type}
                            </span>
                            <span className="item-card__meta">
                              Size: {gist.files[file].size}
                            </span>
                            {gist.files[file].language ? (
                              <span className="item-card__meta">
                                <span
                                  className="item-card__language-icon"
                                  style={{
                                    color:
                                      gist.files[file].language === 'JavaScript'
                                        ? '#f7df1c'
                                        : gist.files[file].language === 'PHP'
                                        ? '#777bb4'
                                        : gist.files[file].language === 'HTML'
                                        ? '#e34f25'
                                        : gist.files[file].language === 'Vue'
                                        ? '#42b883'
                                        : gist.files[file].language === 'Go'
                                        ? '#00ADD8'
                                        : gist.files[file].language === 'C++'
                                        ? '#f34b7d'
                                        : gist.files[file].language === 'C#'
                                        ? '#178600'
                                        : gist.files[file].language === 'Python'
                                        ? '#3572A5'
                                        : gist.files[file].language ===
                                          'TypeScript'
                                        ? '#2b7489'
                                        : gist.files[file].language === 'CSS'
                                        ? '#563d7c'
                                        : gist.files[file].language === 'Swift'
                                        ? '#F05138'
                                        : gist.files[file].language === 'Java'
                                        ? '#b07219'
                                        : gist.files[file].language === 'C'
                                        ? '#555555'
                                        : gist.files[file].language === 'Ruby'
                                        ? '#701516'
                                        : gist.files[file].language ===
                                          'CoffeeScript'
                                        ? '#244776'
                                        : gist.files[file].language === 'Rust'
                                        ? '#dea584'
                                        : gist.files[file].language === 'Dart'
                                        ? '#89e051'
                                        : gist.files[file].language ===
                                          'PowerShell'
                                        ? '#012456'
                                        : gist.files[file].language ===
                                          'Dockerfile'
                                        ? '#384d54'
                                        : gist.files[file].language === 'YAML'
                                        ? '#000'
                                        : '#fff',
                                  }}
                                >
                                  ●
                                </span>{' '}
                                {gist.files[file].language}
                              </span>
                            ) : null}
                            <span className="item-card__meta">
                              <a
                                href={gist.files[file].raw_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View File
                              </a>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  <div className="w-full flex justify-left">
                    <Link
                      href={gist.html_url}
                      muted
                      target="_blank"
                      rel="noopener noreferer"
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                      })}
                      underline={false}
                    >
                      View Gist
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
