# Reve | Vite + JS Commerce SPA

## 0) 한 줄 컨셉 (앱 정체성)

- 명품 편집샵 Reve SPA
- 핵심 흐름: 검색/탐색 → 장바구니 → 로그인/구매 전환

---

## 1) 목표와 학습 포인트

- SPA 라우팅(커스텀 라우터)으로 페이지 전환 감 익히기
- Firebase(Auth/Firestore/Storage) 기반의 인증 및 데이터 흐름 경험하기
- 상태 관리(user/cart)와 UI 동기화(합계/수량/권한 가드) 경험하기
- 검색 UX, 장바구니/주문 플로우, 마이페이지, 관리자 기능까지 단계적으로 확장하기

---

## 2) 기술 스택 및 구조 (Tech Stack)

- Frontend: Vite (Bundler) + Vanilla JS (SPA 구현)
- Backend as a Service: Firebase (Auth, Firestore, Storage)
- Deployment: Netlify (CI/CD 자동화)
- Architecture: Feature-based Module 분리
   - src/api: Firebase 통신 로직
   - src/components: 재사용 UI (Header, Footer, Skeleton)
   - src/pages: 각 라우트별 독립 페이지 모듈
   - src/store: 전역 상태 관리 (간단한 Object 또는 Pub/Sub 패턴)

---

## 3) 라우팅 설계 (Public/Protected)

### Public

- 메인(Home)
- 상품 목록/상세(Product)
- 검색(Search)
- 장바구니(Cart)
- 인증(Auth: Login/Join)

### Protected (가드 필요)

- 주문(Checkout)
- 주문완료(Order Complete)
- 마이페이지(MyPage)
- 관리자(Admin Dashboard)

### 보호 로직(가드) 개요

- 페이지 진입 전 `onAuthStateChanged`로 인증 상태/권한 확인
- 비로그인 사용자는 `redirect?next=/checkout` 형태로 인증 페이지로 이동
- Admin은 `role === 'admin'` 조건 통과 시 접근 허용

---

## 4) 라우트 목록

| Route             | Page           | 타입      | 목적                                    |
| ----------------- | -------------- | --------- | --------------------------------------- |
| `/`               | Home           | Public    | 메인 진입. 추천/인기 상품으로 탐색 시작 |
| `/product`        | Product        | Public    | 상품 리스트 탐색(정렬/필터)             |
| `/product/:id`    | Product Detail | Public    | 상품 상세(이미지, 정보, 리뷰, 추천)     |
| `/search`         | Search         | Public    | 키워드 기반 결과 + 최근/인기 검색어     |
| `/cart`           | Cart           | Public    | 장바구니 관리 및 체크아웃 진입          |
| `/auth`           | Auth           | Public    | 로그인/회원가입 + next 복귀             |
| `/checkout`       | Checkout       | Protected | 주문서 작성 및 결제 진행                |
| `/order-complete` | Order Complete | Protected | 결제 완료 및 주문 확인                  |
| `/mypage`         | MyPage         | Protected | 프로필/배송지/주문내역/활동내역         |
| `/admin`          | Admin          | Protected | 상품/주문/매출 대시보드                 |

---

## 5) 핵심 기능 및 아키텍처 요약

### 5-1) 검색 UX

- 데이터 매칭: 상품명 + 영문/한글 태그 통합 검색(대소문자 구분 없음)
- 히스토리 관리: localStorage 기반 최근 검색어 CRUD 및 전체 삭제
- 추천/탭: 추천 검색어 노출 및 탭 전환(인기/최근)

### 5-2) 장바구니 및 주문 플로우

- 하이브리드 장바구니
   - 비로그인: localStorage 저장
   - 로그인: Firestore와 동기화(선택 또는 자동)
- 결제
   - Stripe 결제 연동 및 웹훅 처리
   - 주문서 작성 → 결제 승인 → 주문 내역 DB 저장 → 완료 페이지

### 5-3) 마이페이지 및 커뮤니티

- 프로필/배송지
   - 배송지 CRUD 및 기본 배송지 설정
- 리뷰 시스템
   - 별점/텍스트 리뷰
   - 이미지 업로드(Firebase Storage)
- 활동 내역
   - 찜(Wishlist)
   - 최근 본 상품(Session/Local Storage)

### 5-4) 운영(Admin)

- 대시보드
   - 총 매출 요약
   - 주문 상태 변경(배송준비/배송중/완료)
- 상품 관리
   - 상품 등록/수정/삭제

---

## 6) UX 및 데이터 알고리즘

- 상품 추천: 현재 보고 있는 상품의 tags 기반 유사 상품 추천(Similarity Logic)
- 할인 시스템: 쿠폰 코드 검증 및 실시간 할인율 적용
- UX 필수 세트
   - Skeleton UI: 데이터 로딩 시 레이아웃 안정
   - Error 처리: API 실패 시 재시도 제공
   - Empty State: 검색/장바구니가 비었을 때 쇼핑 유도 액션 제공

---

## 7) 페이지별 기획 설계

### 7-1) Home `/`

- 목표: 들어오자마자 탐색 시작
- 섹션 구성
   - Hero 배너(카테고리/이벤트)
   - 추천/인기 상품(6~8개)
   - 카테고리 바로가기

---

### 7-2) Product `/product`

- 목표: 상품 탐색의 본진
- UI 구성
   - 정렬: 인기/최신/가격낮은/가격높은
   - 필터: 카테고리/가격대/태그
   - 리스트: ProductCard Grid

---

### 7-3) Product Detail `/product/:id`

- 목표: 구매 결정을 돕는 상세 정보 제공
- 섹션 구성
   - 이미지 갤러리, 가격/할인, 옵션(선택)
   - 리뷰(별점/텍스트/이미지)
   - 유사 상품 추천

---

### 7-4) Search `/search`

- 목표: 의도 있는 유저를 빠르게 상품으로
- UI 구성
   - 검색창 + 추천/최근 탭
   - 결과 리스트 + 정렬/필터

---

### 7-5) Cart `/cart`

- 목표: 구매 직전 최종 정리 화면
- UI 구성
   - 아이템 리스트(수량 변경, 삭제)
   - 가격 요약(상품합계/할인/배송/총합)
   - CTA: 체크아웃

---

### 7-6) Checkout `/checkout`

- 목표: 주문서 작성 및 결제 흐름 제공
- UI 구성
   - 배송지 선택/입력
   - 결제 정보 및 최종 결제 금액
   - 결제 진행 및 완료 처리

---

### 7-7) Order Complete `/order-complete`

- 목표: 결제 완료 확인 및 주문 요약
- UI 구성
   - 주문 번호, 결제 금액, 배송 정보
   - 주문 내역 보기(마이페이지 연결)

---

### 7-8) Auth `/auth`

- 목표: 로그인 장벽 최소화
- 기능
   - 로그인/회원가입
   - next 복귀(`?next=/checkout`)

---

### 7-9) MyPage `/mypage`

- 목표: 유저 정보 및 활동 내역 제공
- 섹션 구성
   - 프로필/배송지 관리
   - 주문 내역
   - 찜 및 최근 본 상품

---

### 7-10) Admin `/admin`

- 목표: 운영 효율화
- 기능
   - 상품 등록/수정/삭제
   - 주문 상태 변경
   - 매출 요약

---

## 8) 구현 범위(MVP) 체크리스트

- [ ] 라우터: 경로 변경 시 페이지 렌더링(뒤로가기 포함)
- [ ] Home: 추천 리스트 섹션
- [ ] Product: 리스트 렌더 + 정렬/필터(최소 1개)
- [ ] Product Detail: 상세 페이지 뼈대 + 장바구니 담기
- [ ] Search: `?q=` 렌더 + 최근 검색어 저장
- [ ] Cart: 수량 변경/삭제 + 총합 계산
- [ ] Auth: 로그인 성공 처리 + next 복귀
- [ ] Checkout/Order Complete: Protected 라우트 가드 적용
- [ ] MyPage/Admin: 권한 가드 + 기본 뼈대
- [ ] 공통 UX: Skeleton / Empty / Error 최소 1회 적용

---

## 9) 폴더/역할 요약

- `app.js`: 앱 엔트리(조립 + 렌더 시작점)
- `src/api`: Firebase 통신 로직
- `src/components`: 재사용 UI 조각
- `src/pages`: 페이지 엔트리(뼈대 + 섹션)
- `src/store`: 상태 관리(user/cart)
- `src/utils`: 포맷/헬퍼

---

## 10) 다음 설계 후보(Backlog)

- [ ] 찜(Wishlist) 고도화(동기화/폴더)
- [ ] 검색 자동완성/추천 키워드 고도화
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 쿠폰/프로모션 UI
- [ ] 관리자 통계 차트

---

## 11) 메모

- 처음엔 목업 데이터(JSON)로 시작 → UI/라우팅/상태 관리 감부터 잡기
- Firebase/Stripe는 MVP 이후 단계적으로 연결
