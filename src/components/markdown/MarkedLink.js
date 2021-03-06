import Link from 'next/link';

const MarkedLink = (props) => {
  const { href, children } = props;

  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

  if (isInternalLink === true) {
    return (
      <Link href={href}>
        <a {...props}>{children}</a>
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

export default MarkedLink;
