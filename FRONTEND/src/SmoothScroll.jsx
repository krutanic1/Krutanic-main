
import { useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// Register the plugin
gsap.registerPlugin(ScrollToPlugin);

const SmoothScroll = () => {
  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: event.target.getAttribute('to') });
    };

    document.querySelectorAll('Link[to^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleScroll);
    });

    return () => {
      document.querySelectorAll('Link[to^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleScroll);
      });
    };
  }, []);

  return null;
};

export default SmoothScroll;