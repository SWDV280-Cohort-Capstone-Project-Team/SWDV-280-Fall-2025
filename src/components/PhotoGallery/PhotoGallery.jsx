import React, { useRef, useState, useEffect, useCallback } from 'react';
import './PhotoGallery.css';
import '../AboutSection/AboutSection.css'; // For section-title class

// Replace with your actual image imports or an array of image URLs
import image1 from '../../assets/images/Gallery1.jpg';
import image2 from '../../assets/images/Gallery2.jpg';
import image3 from '../../assets/images/Gallery3.jpg';
import image4 from '../../assets/images/Gallery4.jpg';

const IMAGES = [
  { id: 1, src: image1, alt: 'Gallery Image 1' },
  { id: 2, src: image2, alt: 'Gallery Image 2' },
  { id: 3, src: image3, alt: 'Gallery Image 3' },
  { id: 4, src: image4, alt: 'Gallery Image 4' },
];

const PhotoGallery = () => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [scrollDiff, setScrollDiff] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getCardWidth = useCallback(() => {
    if (carouselRef.current) {
      // Assuming all images are the same width as the first one
      const firstImage = carouselRef.current.querySelector('img');
      if (firstImage) {
        // Image width + 14px margin-left (from .carousel img in style.css)
        return firstImage.clientWidth + 14;
      }
    }
    return 0;
  }, []);

  // Helper function to toggle arrow visibility
  const toggleArrowIcons = useCallback(() => {
    if (!carouselRef.current) return;
    const carousel = carouselRef.current;
    const maxScroll = Math.round(carousel.scrollWidth - carousel.clientWidth);

    setShowLeftArrow(carousel.scrollLeft > 0);
    setShowRightArrow(Math.round(carousel.scrollLeft) < maxScroll);
  }, []);

  // Smoothly scroll the carousel on arrow click
  const scrollCarousel = useCallback((direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = getCardWidth();
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;

    carousel.scrollLeft = Math.min(Math.max(carousel.scrollLeft + scrollAmount, 0), maxScroll);

    // Use a small timeout to allow scroll to complete before checking arrow visibility
    setTimeout(toggleArrowIcons, 100);
  }, [getCardWidth, toggleArrowIcons]);


  // Automatic adjustment after dragging (snap to the nearest image)
  const autoCenterImage = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = getCardWidth();
    const offset = carousel.scrollLeft % cardWidth;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft > 0 && carousel.scrollLeft < maxScroll) {
      if (offset > cardWidth / 3) {
        // Snap to the next image
        carousel.scrollLeft += cardWidth - offset;
      } else {
        // Snap to the previous image
        carousel.scrollLeft -= offset;
      }
    }

    toggleArrowIcons();
  }, [getCardWidth, toggleArrowIcons]);

  // --- Dragging Logic ---

  const startDragging = (event) => {
    const pageX = event.pageX || event.touches[0].pageX;
    setIsDragging(true);
    setStartX(pageX);
    setScrollStart(carouselRef.current.scrollLeft);
    setScrollDiff(0);
    carouselRef.current.classList.add('dragging');
  };

  const duringDrag = useCallback((event) => {
    if (!isDragging || !carouselRef.current) return;
    const currentX = event.pageX || (event.touches ? event.touches[0].pageX : startX);
    const diff = currentX - startX;
    setScrollDiff(diff);
    carouselRef.current.scrollLeft = scrollStart - diff;
  }, [isDragging, startX, scrollStart]);

  const stopDragging = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    carouselRef.current.classList.remove('dragging');

    if (Math.abs(scrollDiff) > 10) {
      autoCenterImage();
    }
    setScrollDiff(0); // Reset scroll difference
  }, [isDragging, scrollDiff, autoCenterImage]);

  // Attach event listeners for mouse and touch drag interactions
  useEffect(() => {
    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchmove', duringDrag);
    document.addEventListener('touchend', stopDragging);

    // Initial check for arrow visibility and clean-up
    const handleResize = () => {
        // Small delay to ensure all DOM calculations are complete after resize
        setTimeout(toggleArrowIcons, 100);
    };
    window.addEventListener('resize', handleResize);
    toggleArrowIcons();

    return () => {
      document.removeEventListener('mousemove', duringDrag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchmove', duringDrag);
      document.removeEventListener('touchend', stopDragging);
      window.removeEventListener('resize', handleResize);
    };
  }, [duringDrag, stopDragging, toggleArrowIcons]);


  return (
    <section className="carousel-container" id='Gallery'>
        <h2 className="section-title">Photo Gallery</h2>         <div className="wrapper">
          {showLeftArrow && (
            <i id="left" className="fa-solid fa-angle-left" onClick={() => scrollCarousel('left')}></i>
          )}
          <div
            className="carousel"
            ref={carouselRef}
            onMouseDown={startDragging}
            onTouchStart={startDragging}
          >
            {IMAGES.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                draggable="false"
              />
            ))}
          </div>
          {showRightArrow && (
            <i id="right" className="fa-solid fa-angle-right" onClick={() => scrollCarousel('right')}></i>
          )}
        </div>
    </section>
  );
};

export default PhotoGallery;