import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkedCode = (props) => {
  const { children, className } = props;

  return (
    <div className={`post-code ${className}`}>
      <SyntaxHighlighter
        style={materialDark}
        language={className.replace('language-', '')}
        children={children}
      />
    </div>
  );
};

export default MarkedCode;
