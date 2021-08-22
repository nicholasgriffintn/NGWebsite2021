import ReturnImageFormattingUrl from '../../utils/returnImageFormattingUrl';
import Image from 'next/image';

const MarkedImage = (props) => {
  const { image } = props;

  return (
    <div
      className="post-image"
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight:
          image.properties.width && image.properties.height ? 'auto' : '450px',
        marginBotom: '20px',
      }}
    >
      {image.properties.width && image.properties.height ? (
        <Image
          alt={image.properties.alt}
          src={ReturnImageFormattingUrl(image.properties.src)}
          width={image.properties.width}
          height={image.properties.height}
          objectFit="contain"
          quality={80}
          placeholder="blur"
          blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
            image.properties.src
          )}&w=16&q=1`}
        />
      ) : (
        <Image
          alt={image.properties.alt}
          src={ReturnImageFormattingUrl(image.properties.src)}
          layout="fill"
          objectFit="contain"
          quality={80}
          placeholder="blur"
          blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
            image.properties.src
          )}&w=16&q=1`}
        />
      )}
    </div>
  );
};

export default MarkedImage;
