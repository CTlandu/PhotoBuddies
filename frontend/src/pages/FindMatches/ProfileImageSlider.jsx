import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProfileImageSlider = ({ profile, role }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const roleInfo = profile[`${role}_info`] || {};
  let images = roleInfo[`${role}_images`] || [];

  // 确保 images 是一个数组
  if (typeof images === "object" && !Array.isArray(images)) {
    images = Object.values(images);
  } else if (!Array.isArray(images)) {
    images = [];
  }

  const settings = {
    dots: false,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: images.length > 1 ? <NextArrow /> : null,
    prevArrow: images.length > 1 ? <PrevArrow /> : null,
    afterChange: (index) => setCurrentIndex(index),
  };

  if (images.length === 0) {
    return <p>No images to display.</p>;
  }

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="relative w-full overflow-hidden mt-4">
      <style>{`
        .arrow-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.3s;
          z-index: 50;
          border: none;
          outline: none;
        }
        .arrow-button:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .arrow-button:active {
          background-color: rgba(0, 0, 0, 0.9);
        }
        @media (prefers-color-scheme: dark) {
          .arrow-button {
            background-color: rgba(255, 255, 255, 0.5);
            color: black;
          }
          .arrow-button:hover {
            background-color: rgba(255, 255, 255, 0.7);
          }
          .arrow-button:active {
            background-color: rgba(255, 255, 255, 0.9);
          }
        }
        .arrow-button:focus {
          outline: none;
        }
        .arrow-button::-moz-focus-inner {
          border: 0;
        }
      `}</style>
      <Slider ref={sliderRef} {...settings} className="w-full">
        {images.map((image, index) => (
          <div key={index} className="w-full p-1">
            <div className="w-full max-w-[70%] aspect-square relative rounded-lg overflow-hidden mx-auto">
              <img
                src={image}
                alt={`${role.charAt(0).toUpperCase() + role.slice(1)} Image ${
                  index + 1
                }`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
      {images.length > 1 && ( // 只有多张图片时才显示页码
        <div className="text-center mt-2">
          <p>
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
      <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer flex-shrink-0 ${
              index === currentIndex ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="arrow-button right-2"
      onClick={onClick}
      aria-label="Next"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="arrow-button left-2"
      onClick={onClick}
      aria-label="Previous"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default ProfileImageSlider;
