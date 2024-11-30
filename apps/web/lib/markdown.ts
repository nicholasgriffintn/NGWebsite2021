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

  const normalizedInput = input
    .replace(/\\n/g, '\n')
    .replace(/<summary>/g, '<strong>Summary:</strong> ')
    .replace(/<\/summary>/g, '')
    .replace(/<questions>/g, '<strong>Questions:</strong> ')
    .replace(/<\/questions>/g, '')
    .replace(/<question>/g, '')
    .replace(/<\/question>/g, '')
    .replace(/<answer>/g, '')
    .replace(/<\/answer>/g, '')
    .replace(/<prompt_analysis>/g, '<strong>Analysis:</strong> ')
    .replace(/<\/prompt_analysis>/g, '')
    .replace(/<analysis>/g, '<strong>Analysis:</strong> ')
    .replace(/<\/analysis>/g, '')
    .replace(/<thought>/g, '<strong>Thought:</strong> ')
    .replace(/<\/thought>/g, '')
    .replace(/<action>/g, '<strong>Action:</strong> ')
    .replace(/<\/action>/g, '')
    .replace(/<unclear_parts>/g, '<strong>Unsure about:</strong> ')
    .replace(/<\/unclear_parts>/g, '')
    .replace(/<key_elements>/g, '<strong>Key Elements:</strong> ')
    .replace(/<\/key_elements>/g, '')
    .replace(
      /<key_elements_missing>/g,
      '<strong>Key Elements Missing:</strong> '
    )
    .replace(/<\/key_elements_missing>/g, '')
    .replace(/<suggestions>/g, '<strong>Suggestions:</strong> ')
    .replace(/<\/suggestions>/g, '')
    .replace(/<suggestion>/g, '')
    .replace(/<\/suggestion>/g, '')
    .replace(/<revised_prompt>/g, '<strong>Revised Prompt:</strong> ')
    .replace(/<\/revised_prompt>/g, '')
    .replace(/<problem_breakdown>/g, '<strong>Problem Breakdown:</strong> ')
    .replace(/<\/problem_breakdown>/g, '');

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