// 1) 썸네일 ↔ 메인: thumbs로 안정 동기화
const thumbnailSlider = new Swiper('.thumbnail-slider', {
   slidesPerView: 1, // 필요시 여러 개로 변경
   spaceBetween: 0,
   freeMode: true,
   effect: 'fade',
   watchSlidesProgress: true,
});

const mainImageSlider = new Swiper('.main-image-slider', {
   effect: 'fade',
   loop: true,
   autoplay: {
      delay: 5000, // 5초마다
      disableOnInteraction: false, // 유저 조작해도 autoplay 유지
   },
   thumbs: { swiper: thumbnailSlider },
   controller: { by: 'slide' },
});

// 2) 텍스트 ↔ 메인: controller로 상호 동기화
const textSlider = new Swiper('.text-slider', {
   loop: true,
   autoplay: {
      delay: 5000,
      disableOnInteraction: false,
   },
   pagination: { el: '.swiper-pagination', clickable: true },
   navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
   controller: { by: 'slide' },
});

// 서로 연결
mainImageSlider.controller.control = textSlider;
textSlider.controller.control = mainImageSlider;
