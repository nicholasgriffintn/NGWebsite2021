import ReturnImageFormattingUrl from '../../utils/returnImageFormattingUrl';
import Image from 'next/image';

const MarkedImage = (props) => {
  const { src, alt, height, width } = props;

  return (
    <div
      className="post-image"
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: width && height ? 'auto' : '450px',
        marginBotom: '20px',
      }}
    >
      {width && height ? (
        <Image
          alt={alt}
          src={ReturnImageFormattingUrl(src)}
          width={width}
          height={height}
          layout="responsive"
          quality={80}
          placeholder="blur"
          blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
            src
          )}&w=16&q=1`}
        />
      ) : (
        <Image
          alt={alt}
          src={ReturnImageFormattingUrl(src)}
          layout="fill"
          objectFit="contain"
          quality={80}
          placeholder="blur"
          blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
            src
          )}&w=16&q=1`}
        />
      )}
    </div>
  );
};

export default MarkedImage;
