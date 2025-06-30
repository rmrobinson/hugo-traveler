import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipeDynamicCaption from '/photoswipe/photoswipe-dynamic-caption-plugin.esm.min.js';

class PhotoGallery {
    constructor(options) {
        this.gallery = options.gallery;
    }

    init() {
        const lightbox = new PhotoSwipeLightbox({
            gallery: this.gallery,
            childSelector: '.pswp-gallery__item',
            pswpModule: () => import('/photoswipe/photoswipe.esm.js')
        });
        const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
            mobileLayoutBreakpoint: 700,
            type: 'auto',
            mobileCaptionOverlapRatio: 1,
        });
        
        // Parse data-pswp-webp-src attribute
        lightbox.addFilter('itemData', (itemData, index) => {
          const webpSrc = itemData.element.dataset.pswpWebpSrc;
          if (webpSrc) {
            itemData.webpSrc = webpSrc;
          }
          return itemData;
        });
        
        // use <picture> instead of <img>
        lightbox.on('contentLoad', (e) => {
            const { content, isLazy } = e;
        
            if (content.data.webpSrc) {
              // prevent to stop the default behavior
              e.preventDefault();
        
              content.pictureElement = document.createElement('picture');
              
              const sourceWebp = document.createElement('source');
              sourceWebp.srcset = content.data.webpSrc;
              sourceWebp.type = 'image/webp';
        
              content.element = document.createElement('img');
              content.element.src = content.data.src;
              content.element.setAttribute('alt', '');
              content.element.className = 'pswp__img';
        
              content.pictureElement.appendChild(sourceWebp);
              content.pictureElement.appendChild(content.element);
        
              content.state = 'loading';
        
              if (content.element.complete) {
                content.onLoaded();
              } else {
                content.element.onload = () => {
                  content.onLoaded();
                };
        
                content.element.onerror = () => {
                  content.onError();
                };
              }
            }
        });
        
        // by default PhotoSwipe appends <img>,
        // but we want to append <picture>
        lightbox.on('contentAppend', (e) => {
          const { content } = e;
          if (content.pictureElement && !content.pictureElement.parentNode) {
            e.preventDefault();
            content.slide.container.appendChild(content.pictureElement);
          }
        });
        
        // for next/prev navigation with <picture>
        // by default PhotoSwipe removes <img>,
        // but we want to remove <picture>
        lightbox.on('contentRemove', (e) => {
          const { content } = e;
          if (content.pictureElement && content.pictureElement.parentNode) {
            e.preventDefault();
            content.pictureElement.remove();
          }
        });
        
        lightbox.init();
    }
}

export { PhotoGallery as default };
