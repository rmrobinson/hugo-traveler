import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipeDynamicCaption from '/photoswipe/photoswipe-dynamic-caption-plugin.esm.min.js';
import covertSizesToAspectRatios from '/justified-layout/index.js';

class PhotoGallery {
    constructor(options) {
        this.galleryName = options.galleryName;
        this.justified = options.justified;
    }

    init() {
        // Setup the PhotoSwipe lightbox to support using the <picture> element along with the caption plugin.
        const lightbox = new PhotoSwipeLightbox({
            gallery: '#' + this.galleryName,
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

        // If using the justified layout param, set it up now.
        if (this.justified) {
            const gallery = document.getElementById(this.galleryName);
            const galleryItems = gallery.querySelectorAll(".pswp-gallery__item");

            this.aspectRatios = Array.from(galleryItems).map((item) => {
                const img = item.querySelector("img");
                img.style.width = "100%";
                img.style.height = "auto";
                return parseFloat(img.getAttribute("width"))/parseFloat(img.getAttribute("height"));
            });
            this.containerWidth = 0;

            window.addEventListener("resize", () => {
                this.updateGallery(this.galleryName);
            });
            window.addEventListener("orientationchange", () => {
                this.updateGallery(this.galleryName);
            });

            this.updateGallery(this.galleryName);
            this.updateGallery(this.galleryName);
        }
    }

    updateGallery(galleryName) {
        const gallery = document.getElementById(galleryName);
        const galleryItems = gallery.querySelectorAll(".pswp-gallery__item");

        if (this.containerWidth === gallery.getBoundingClientRect().width) {
            return;
        }
        this.containerWidth = gallery.getBoundingClientRect().width;

        const layout = covertSizesToAspectRatios(this.aspectRatios, {
            containerWidth: this.containerWidth
        });

        galleryItems.forEach((item, i) => {
            const { width, height, top, left } = layout.boxes[i];
            item.style.position = "absolute";
            item.style.width = width + "px";
            item.style.height = height + "px";
            item.style.top = top + "px";
            item.style.left = left + "px";
            item.style.overflow = "hidden";
        });

        gallery.style.position = "relative";
        gallery.style.height = layout.containerHeight + "px";
        gallery.style.visibility = "";
    }
}

export { PhotoGallery as default };
