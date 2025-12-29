// ===================================================
// 모든 페이지에서 공통으로 실행될 초기화 함수
// ===================================================
function initPage() {
   // --- 1. 헤더 메뉴 기능 초기화 ---
   const header = document.querySelector('#header');
   const submenuBg = document.querySelector('.submenu-bg');
   const gnb = document.querySelector('.gnb');

   if (header && gnb && submenuBg) {
      const subMenus = document.querySelectorAll('.gnb > li .sub-menu');
      let maxHeight = 0;
      subMenus.forEach(menu => {
         if (menu.scrollHeight > maxHeight) {
            maxHeight = menu.scrollHeight;
         }
      });

      gnb.addEventListener('mouseenter', () => {
         header.classList.add('open');
         submenuBg.style.height = `${maxHeight + 30}px`;
      });

      header.addEventListener('mouseleave', () => {
         header.classList.remove('open');
         submenuBg.style.height = '0px';
      });
   }

   // --- 2. H2 타이핑 효과 초기화 ---
   const typingElement = document.querySelector('.typing-effect');
   if (typingElement) {
      const text = typingElement.textContent.trim();
      typingElement.innerHTML = '';
      text.split('').forEach((char, index) => {
         const span = document.createElement('span');
         span.innerHTML = char === ' ' ? '&nbsp;' : char;
         span.style.animationDelay = `${index * 60}ms`;
         typingElement.appendChild(span);
      });
   }

   // --- 3. AOS 초기화 ---
   AOS.init({
      once: true,
      duration: 1000,
   });

   // --- 4. 카카오 맵 모달 기능 초기화 ---
   // 카카오 API 스크립트가 로드되었는지 확인 후 실행
   if (typeof kakao !== 'undefined' && kakao.maps) {
      kakao.maps.load(initMapModal);
   }

   // --- 5. 공지사항 아코디언 기능 초기화 ---
   initAccordion();
}

// ===================================================
// 카카오 맵 모달 초기화 함수
// ===================================================
function initMapModal() {
   const mapButtons = document.querySelectorAll('.open-map-btn');
   const modal = document.getElementById('mapModal');
   const closeBtn = document.querySelector('.modal-content .close-btn');
   const mapContainer = document.getElementById('map');
   let map = null;

   if (!modal || !closeBtn) return;

   mapButtons.forEach(button => {
      button.addEventListener('click', e => {
         e.preventDefault();
         const lat = parseFloat(button.dataset.lat);
         const lng = parseFloat(button.dataset.lng);
         const title = button.dataset.title;

         if (!isNaN(lat) && !isNaN(lng)) {
            modal.style.display = 'flex';
            createMap(lat, lng, title);
         } else {
            // 지도 정보가 없는 버튼을 위한 경고 (선택사항)
            // alert('지도 정보가 등록되지 않았습니다.');
         }
      });
   });

   function createMap(lat, lng, title) {
      mapContainer.innerHTML = '';
      const options = {
         center: new kakao.maps.LatLng(lat, lng),
         level: 3, // 확대 레벨 조정
      };
      map = new kakao.maps.Map(mapContainer, options);

      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);

      const iwContent = `<div style="padding:5px; text-align:center; min-width:150px;">${title}</div>`;
      const infowindow = new kakao.maps.InfoWindow({
         content: iwContent,
         removable: true, // 사용자가 X 버튼으로 닫을 수 있도록 설정
      });

      infowindow.open(map, marker);

      setTimeout(() => {
         if (map) {
            map.relayout();
            map.setCenter(new kakao.maps.LatLng(lat, lng));
         }
      }, 100);
   }

   function closeModal() {
      modal.style.display = 'none';
   }

   closeBtn.addEventListener('click', closeModal);
   modal.addEventListener('click', e => {
      if (e.target === modal) {
         closeModal();
      }
   });
}

// ===================================================
// 공지사항 아코디언 초기화 함수
// ===================================================
function initAccordion() {
   const items = document.querySelectorAll('.notice-item');
   if (items.length === 0) return; // 공지사항 아이템이 없으면 함수 종료

   items.forEach(item => {
      const header = item.querySelector('.notice-header');

      header.addEventListener('click', () => {
         const body = item.querySelector('.notice-body');

         // 모든 아이템을 닫고, 현재 클릭한 아이템만 토글 (선택사항)
         items.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
               otherItem.classList.remove('active');
               otherItem.querySelector('.notice-body').style.maxHeight = '0px';
            }
         });

         // 현재 클릭한 아이템 열기/닫기
         item.classList.toggle('active');
         if (item.classList.contains('active')) {
            body.style.maxHeight = body.scrollHeight + 'px';
         } else {
            body.style.maxHeight = '0px';
         }
      });
   });
}

// ===================================================
// 최종 이벤트 리스너
// ===================================================

// 1. 페이지가 처음 로드될 때 모든 기능 초기화
document.addEventListener('DOMContentLoaded', initPage);
