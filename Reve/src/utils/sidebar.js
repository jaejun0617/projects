/**
 * =============================================
 * 위치: src/utils/sidebar.js
 * 역할: 모바일 사이드바(오프캔버스) 열기/닫기 제어
 * 사용처: app.js(또는 엔트리)에서 initSidebar() 1회 호출
 * =============================================
 *
 * 이 파일이 하는 일(요약)
 * 1) 햄버거 버튼(.site-menu-bar)을 누르면 사이드바가 왼쪽에서 등장
 * 2) 오버레이(배경) / 닫기 버튼 / 메뉴 링크를 누르면 사이드바가 닫힘
 * 3) ESC 키를 누르면 사이드바가 닫힘
 *
 * 동작 방식(핵심)
 * - body에 `is-sidebar-open` 클래스를 붙였다/떼면서 열림/닫힘을 제어
 * - CSS가 body.is-sidebar-open 상태를 보고 translateX 애니메이션을 실행
 */

// 1) HTML에서 찾아야 할 요소들을 한 곳에 모아둠(유지보수 쉬움)
const SELECTORS = {
   // 햄버거 버튼
   openBtn: '.site-menu-bar',

   // Header.js에서 만든 사이드바 id: id='mobile-sidebar'
   sidebar: '#mobile-sidebar',

   // Header.js에서 만든 오버레이: data-sidebar-overlay
   overlay: '[data-sidebar-overlay]',

   // 닫기 버튼(X)
   closeBtn: '.sidebar-close',

   // 사이드바 안의 라우팅 링크들(클릭하면 닫히게)
   navLink: '#mobile-sidebar a[data-link]',
};

/**
 * 접근성(aria) 상태를 업데이트
 * - aria-hidden: 화면에 보이는지 여부(보이면 false, 숨기면 true)
 * - aria-expanded: 버튼이 열림 상태인지 여부(true/false)
 */
function setAria({ sidebarEl, overlayEl, openBtnEl, isOpen }) {
   // 사이드바/오버레이는 열려있으면 aria-hidden=false
   if (sidebarEl) sidebarEl.setAttribute('aria-hidden', String(!isOpen));
   if (overlayEl) overlayEl.setAttribute('aria-hidden', String(!isOpen));

   // 햄버거 버튼은 열려있으면 aria-expanded=true
   if (openBtnEl) openBtnEl.setAttribute('aria-expanded', String(isOpen));
}

/**
 * 사이드바를 열거나 닫는 실제 함수
 * - isOpen === true  : 열기
 * - isOpen === false : 닫기
 */
function setOpen(isOpen) {
   // (1) 필요한 DOM 요소 찾기
   const body = document.body;
   const sidebarEl = document.querySelector(SELECTORS.sidebar);
   const overlayEl = document.querySelector(SELECTORS.overlay);
   const openBtnEl = document.querySelector(SELECTORS.openBtn);

   // (2) body 클래스 토글 -> CSS 애니메이션 트리거
   // components.css에서
   // body.is-sidebar-open .mobile-sidebar { transform: translateX(0); }
   body.classList.toggle('is-sidebar-open', isOpen);

   // (3) aria 상태 동기화
   setAria({ sidebarEl, overlayEl, openBtnEl, isOpen });
}

/**
 * initSidebar
 * - 앱 시작 시 1번만 호출
 * - 이벤트 위임 방식으로 클릭/키보드 이벤트를 한 곳에서 처리
 *   (Header가 재렌더 되어도 이벤트가 살아있음)
 */
export function initSidebar() {
   // ------------------------------
   // 클릭 이벤트(열기/닫기)
   // ------------------------------
   document.addEventListener('click', (e) => {
      // e.target: 클릭한 가장 안쪽 요소
      // closest(): 부모로 올라가면서 해당 셀렉터를 만족하는 요소를 찾음
      const openBtn = e.target.closest(SELECTORS.openBtn);
      const closeBtn = e.target.closest(SELECTORS.closeBtn);
      const overlay = e.target.closest(SELECTORS.overlay);
      const navLink = e.target.closest(SELECTORS.navLink);

      // (1) 햄버거 버튼을 눌렀으면 열기
      if (openBtn) {
         setOpen(true);
         return;
      }

      // (2) 닫기 트리거들: X 버튼 / 오버레이 / 메뉴 링크 클릭
      // 메뉴 링크를 클릭하면 라우터 이동도 되면서 사이드바도 닫힘
      if (closeBtn || overlay || navLink) {
         setOpen(false);
      }
   });

   // ------------------------------
   // 키보드 이벤트(ESC 닫기)
   // ------------------------------
   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
         setOpen(false);
      }
   });

   // 앱 시작 시 기본은 닫힌 상태
   setOpen(false);

   // 필요하면 외부에서 열기/닫기를 호출할 수도 있게 API 반환
   return {
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () =>
         setOpen(!document.body.classList.contains('is-sidebar-open')),
   };
}
