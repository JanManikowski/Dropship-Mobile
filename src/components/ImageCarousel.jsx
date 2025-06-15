import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(i => Math.min(i + 1, images.length - 1)),
    onSwipedRight: () => setCurrentIndex(i => Math.max(i - 1, 0)),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="mb-3">
      {/* OUTER wrapper */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: '16px',
          width: '100%',
        }}
      >
        {/* SLIDE TRACK */}
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease-out',
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                width: '100%',
                flexShrink: 0,
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <img
                src={img}
                alt={`Slide ${i + 1}`}
                className="img-fluid"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="d-flex justify-content-center gap-2 mt-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: i === currentIndex ? '#000' : '#ccc',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
