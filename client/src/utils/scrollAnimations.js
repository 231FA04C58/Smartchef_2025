/**
 * Utility functions for scroll-based animations
 */

/**
 * Initialize scroll reveal for all elements with .scroll-reveal class
 */
export const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optionally unobserve after revealing
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  return revealObserver;
};

/**
 * Add stagger animation to a container's children
 */
export const addStaggerAnimation = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const children = Array.from(container.children);
  children.forEach((child, index) => {
    child.classList.add('stagger-item');
    child.style.animationDelay = `${index * 0.1}s`;
  });
};

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (element, offset = 0) => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Parallax effect for background elements
 */
export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  const handleScroll = () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};

