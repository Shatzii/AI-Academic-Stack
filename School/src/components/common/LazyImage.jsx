import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==',
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);
    }
  }, [inView, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div ref={ref} className={`lazy-image-container ${className}`}>
      {!isInView && (
        <img
          src={placeholder}
          alt=""
          className="lazy-image-placeholder"
          style={{ filter: 'blur(10px)', transition: 'opacity 0.3s ease' }}
        />
      )}

      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            filter: isLoaded ? 'none' : 'blur(10px)'
          }}
          {...props}
        />
      )}

      {hasError && (
        <div className="lazy-image-error">
          <i className="fas fa-exclamation-triangle text-warning"></i>
          <span className="text-muted small ms-2">Failed to load image</span>
        </div>
      )}

      <style jsx>{`
        .lazy-image-container {
          position: relative;
          overflow: hidden;
        }

        .lazy-image-placeholder,
        .lazy-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .lazy-image.loading {
          position: absolute;
          top: 0;
          left: 0;
        }

        .lazy-image-error {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
