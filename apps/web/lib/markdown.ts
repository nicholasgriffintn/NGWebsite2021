import parse from 'html-react-parser';

const URL_REGEX =
  /(^|\s)((?:(?:https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))/g;

export function parseMarkdown(
  input: string,
  muted = false,
  classNames: { p?: string } = {}
) {
  if (!input) return input;

  const linkClassName = `underline text-${
    muted ? 'muted' : 'primary'
  }-foreground inline font-bold p-0 transition-colors hover:underline hover:outline-none decoration-1 decoration-skip-ink-none underline-offset-[0.25em] hover:decoration-2`;

  const normalizedInput = input.replace(/\\n/g, '\n');

  const paragraphs = normalizedInput.split('\n').map((paragraph, index) => {
    const html = paragraph
      .replace(/^(?:\s[^\n])+##### ([^\n]+)\n/gm, '<h5>$1</h5>')
      .replace(/^(?:\s[^\n])+#### ([^\n]+)\n/gm, '<h4>$1</h4>')
      .replace(/^(?:\s[^\n])+### ([^\n]+)\n/gm, '<h3>$1</h3>')
      .replace(/^(?:\s[^\n])+## ([^\n]+)\n/gm, '<h2>$1</h2>')
      .replace(
        /`([^`]*)`/g,
        '<pre><span className="sr-only" aria-hidden="true">`</span>$1<span className="sr-only" aria-hidden="true">`</span></pre>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        `<a href="$2" target="_blank" rel="noopener noreferrer" class="${linkClassName}">$1</a>`
      )
      .replace(
        URL_REGEX,
        `<a href="$2" target="_blank" rel="noopener noreferrer" class="${linkClassName}">$1</a>`
      )
      .replace(/(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\1/gm, '<strong>$2</strong>');

    return `<p class="${classNames.p}">${html}</p>`;
  });

  // Join the paragraphs back together
  const result = paragraphs.join('');

  return parse(result);
}