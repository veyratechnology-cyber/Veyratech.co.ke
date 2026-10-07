/**
 * Image Optimization Utilities
 * Helper functions for optimized image handling
 */

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <filter id="blur">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <rect width="100%" height="100%" fill="#1F1F1F" filter="url(#blur)" />
    </svg>
  `;

  const base64 = Buffer.from(canvas).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get responsive image sizes configuration
 */
export function getImageSizes(breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'all'): string {
  const sizes = {
    mobile: '100vw',
    tablet: '(max-width: 768px) 100vw, 50vw',
    desktop: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    all: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  };

  return sizes[breakpoint || 'all'];
}

/**
 * Image optimization configuration for next/image
 */
export const imageConfig = {
  // Logo and brand images
  logo: {
    width: 200,
    height: 50,
    quality: 90,
    priority: true,
  },

  // Hero/banner images
  hero: {
    width: 1920,
    height: 1080,
    quality: 85,
    priority: true,
    sizes: '100vw',
  },

  // Feature cards
  card: {
    width: 400,
    height: 300,
    quality: 80,
    sizes: getImageSizes('desktop'),
  },

  // Team member photos
  avatar: {
    width: 200,
    height: 200,
    quality: 85,
  },

  // Thumbnail images
  thumbnail: {
    width: 150,
    height: 150,
    quality: 75,
  },

  // Blog/insight featured images
  featured: {
    width: 1200,
    height: 630,
    quality: 85,
    sizes: '(max-width: 768px) 100vw, 75vw',
  },

  // Case study images
  caseStudy: {
    width: 800,
    height: 600,
    quality: 80,
    sizes: getImageSizes('tablet'),
  },
};

/**
 * Get Cloudinary optimized URL
 * (If using Cloudinary for image hosting)
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return '';

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options || {};

  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Lazy load image with Intersection Observer
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => imageObserver.observe(img));
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalFormat(): 'webp' | 'jpg' | 'png' {
  if (typeof window === 'undefined') return 'jpg';

  // Check WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      ? 'webp'
      : 'jpg';
  }

  return 'jpg';
}

/**
 * Calculate aspect ratio padding for responsive images
 */
export function getAspectRatioPadding(width: number, height: number): string {
  return `${(height / width) * 100}%`;
}

/**
 * Image loading priorities
 */
export const imagePriority = {
  // Critical images (above the fold)
  critical: true,
  
  // Important images (near top)
  high: false,
  
  // Standard images
  normal: false,
  
  // Below fold images
  low: false,
};

/**
 * Image quality by use case
 */
export const imageQuality = {
  hero: 90,
  product: 85,
  thumbnail: 75,
  background: 70,
  avatar: 85,
  icon: 90,
};
