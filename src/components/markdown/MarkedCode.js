import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkedCode = (props) => {
  const { code, language } = props;

  return (
    <div className="post-code">
      <SyntaxHighlighter
        style={materialDark}
        language={language}
        children={code}
      />
    </div>
  );
};

export default MarkedCode;
