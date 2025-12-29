/**
 * ===================================================================================
 * ✨ Config Loader - Google OAuth ✨
 * ===================================================================================
 *
 * 역할:
 *  - google_config.json에서 Google OAuth Client ID와 Scope 정보를 비동기적으로 불러옵니다.
 *  - 순수 HTML/CSS/JS 환경에서도 API 키를 안전하게 관리할 수 있도록 설계됨.
 *
 * 특징:
 *  - fetch 요청 최소화를 위해 캐싱 지원
 *  - 실패 시 오류 로그와 alert로 사용자에게 알림
 *
 * 반환값:
 *  - 성공: { CLIENT_ID: string, SCOPES: string }
 *  - 실패: null
 * ===================================================================================
 */

// -------------------- 캐싱 --------------------
// 이미 로드된 설정을 저장하여 불필요한 fetch 요청을 방지
let cachedConfig = null;

/**
 * [핵심 함수] Google OAuth 설정 로드
 *
 * google_config.json을 fetch하여 OAuth 설정 객체를 반환합니다.
 * SPA 환경이나 모듈화된 JS 프로젝트에서 안전하게 사용 가능
 *
 * @returns {Promise<{CLIENT_ID: string, SCOPES: string} | null>}
 *          성공 시 OAuth 설정 객체, 실패 시 null
 */
export async function loadGoogleConfig() {
   // 캐시된 설정이 있으면 즉시 반환
   if (cachedConfig) {
      return cachedConfig;
   }

   try {
      // 프로젝트 루트의 data 폴더에서 설정 파일 가져오기
      const response = await fetch('./data/google_config.json');

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const config = await response.json();

      // 필요한 필드만 추출하여 캐싱
      cachedConfig = {
         CLIENT_ID: config.CLIENT_ID,
         SCOPES: config.SCOPES,
      };

      return cachedConfig;
   } catch (err) {
      console.error('⚠️ Google config 파일 로드 또는 파싱 실패:', err);

      // UI 알림: 일부 기능 제한 가능성 안내
      alert(
         '설정 파일을 불러오는 데 실패했습니다. 일부 기능이 작동하지 않을 수 있습니다.',
      );

      return null;
   }
}
