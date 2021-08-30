import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkedCode = (props) => {
  const { children, className } = props;

  return (
    <div className={`post-code ${className}`}>
      {/* eslint-disable */}
      <SyntaxHighlighter
        style={materialDark}
        language={className ? className.replace('language-', '') : ''}
        children={children}
        showLineNumbers={true}
      />
      {/* eslint-enable */}
    </div>
  );
};

export default MarkedCode;
