/**
 * =============================================
 * 📍 위치: src/components/Header.js
 * 역할: 상단 Header/Navigation UI 컴포넌트
 * 사용처: app.js(또는 각 Page/레이아웃)에서 import 해서 렌더링
 * =============================================
 */
export const Header = () => {
   return `
    <header class='site-header' role='banner' aria-label='Site Header'>
      <nav class='site-nav' aria-label='Primary Navigation'>
        <div class='site-logo' aria-label='Brand'>
          <a href='/' data-link aria-label='Go to Home'>
            <img src='/assets/logo/logo.svg' alt='' />
          </a>
        </div>

        <ul class='nav-menu-list' aria-label='Main Menu'>
          <li>
            <a href='/product' data-link aria-label='Menu Item'>상품</a>
          </li>
        </ul>

        <ul class='nav-menu-icons' aria-label='Utility Menu'>
          <li>
            <a href='/search' data-link aria-label='Search'>
              <img src='/src/icons/search.svg' alt='' />
            </a>
          </li>
          <li>
            <a href='/auth' data-link aria-label='Login'>
              <img src='/src/icons/usericon.svg' alt='' />
            </a>
          </li>
          <li>
            <a href='/cart' data-link aria-label='Cart'>
              <img src='/src/icons/cart.svg' alt='' />
            </a>
          </li>
          <li class='mypage-icon'>
            <a href='/mypage' data-link aria-label='My Page'>
              <img src='/src/icons/category.svg' alt='' />
            </a>
          </li>
          <li class='admin-icon'>
            <a href='/admin' data-link aria-label='Admin'>
              <img src='/src/icons/lock.svg' alt='' />
            </a>
          </li>
          <li class='menu-bar-item'>
            <button
              class='site-menu-bar'
              type='button'
              aria-label='Open menu'
              aria-controls='mobile-sidebar'
              aria-expanded='false'
            >
              <img src='/src/icons/menubar.svg' alt='' aria-hidden='true' />
            </button>
          </li>
        </ul>

        <!-- Overlay -->
        <div class='sidebar-overlay' data-sidebar-overlay aria-hidden='true'></div>

        <!-- Mobile Sidebar (Off-canvas) -->
        <aside
          id='mobile-sidebar'
          class='mobile-sidebar'
          aria-label='Mobile Menu'
          aria-hidden='true'
        >
          <div class='mobile-sidebar__header'>
            <div class='mobile-title'></div>
            <button type='button' class='sidebar-close' aria-label='Close menu'>
              ✕
            </button>
          </div>

          <div class='mobile-icons'>
            <ul class='mobile-icons__list'>
              <li>
                <a href='/search' data-link aria-label='Search'>
                  <img src='/src/icons/search.svg' alt='' />
                </a>
              </li>
              <li>
                <a href='/auth' data-link aria-label='Login'>
                  <img src='/src/icons/usericon.svg' alt='' />
                </a>
              </li>
              <li>
                <a href='/cart' data-link aria-label='Cart'>
                  <img src='/src/icons/cart.svg' alt='' />
                </a>
              </li>
              <li class='mypage-icon'>
                <a href='/mypage' data-link aria-label='My Page'>
                  <img src='/src/icons/category.svg' alt='' />
                </a>
              </li>
              <li class='admin-icon'>
                <a href='/admin' data-link aria-label='Admin'>
                  <img src='/src/icons/lock.svg' alt='' />
                </a>
              </li>
            </ul>
          </div>

          <nav class='mobile-sidebar__nav' aria-label='Mobile Navigation'>
            <a href='/' data-link>Home</a>
            <a href='/product' data-link>상품</a>
            <a href='/search' data-link>Search</a>
            <a href='/cart' data-link>Cart</a>
            <a href='/auth' data-link>Login</a>
            <a href='/mypage' data-link>MyPage</a>
            <a href='/admin' data-link>Admin</a>
          </nav>
        </aside>
      </nav>
    </header>
  `;
};
