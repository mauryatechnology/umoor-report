import { useEffect } from 'react';

export default function SEO({ title, description, url, image }) {
  useEffect(() => {
    // 1. Set Title
    document.title = title ? `${title} | Umoor Report` : 'Umoor Report Dashboard';
    
    // 2. Helper to set or create meta tags
    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:')) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const defaultDescription = "Comprehensive Umoor reporting dashboard with achievements, improvements, and gallery highlights.";
    const defaultImage = "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop";
    const defaultUrl = window.location.origin;

    // 3. Inject Meta Tags
    setMeta('description', description || defaultDescription);
    
    // Open Graph
    setMeta('og:title', title ? `${title} | Umoor Report` : 'Umoor Report Dashboard');
    setMeta('og:description', description || defaultDescription);
    setMeta('og:image', image || defaultImage);
    setMeta('og:url', url || defaultUrl);
    setMeta('og:type', 'website');
    
    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title ? `${title} | Umoor Report` : 'Umoor Report Dashboard');
    setMeta('twitter:description', description || defaultDescription);
    setMeta('twitter:image', image || defaultImage);

  }, [title, description, url, image]);

  return null;
}
