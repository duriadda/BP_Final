# BP Term Project

> 2026-2 초급프로젝트 Term Project · Vue 3 + Firebase + JCloud
> (주제 확정 후 서비스 소개를 이 자리에 작성)

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프런트엔드 | Vue 3 (Composition API), TypeScript, Vite, Vue Router, Pinia |
| 인증·데이터 | Firebase Authentication (이메일/비밀번호), Cloud Firestore |
| 테스트 | Vitest |
| CI | GitHub Actions (타입 검사 → 단위 테스트 → 빌드) |
| 배포 | JCloud 인스턴스 + nginx |

## 로컬 실행

요구 사항: Node.js 24 이상

```bash
npm install
cp .env.example .env.local   # Firebase 웹 앱 설정 값 입력
npm run dev                  # http://localhost:5173
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run type-check` | TypeScript 타입 검사 |
| `npm test` | 단위 테스트 실행 |
| `npm run build` | 배포용 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 로컬 확인 |

## Firebase 설정

1. Firebase 콘솔 → Authentication → 로그인 방법에서 **이메일/비밀번호**를 사용 설정합니다.
2. Firestore Database를 생성합니다.
3. 프로젝트 설정 → 내 앱(웹)의 구성 값을 `.env.local`에 입력합니다.
4. Authentication → 설정 → **승인된 도메인**에 JCloud 배포 주소(IP 또는 도메인)를 추가합니다.
5. 저장소의 `firestore.rules` 내용을 Firestore → 규칙 탭에 게시합니다.

## 폴더 구조

```
src/
├── infrastructure/   # Firebase 초기화 등 외부 서비스 연결
├── stores/           # Pinia 전역 상태 (로그인 상태)
├── router/           # 라우트 정의와 로그인 가드
├── views/            # 페이지 단위 화면
├── components/       # 재사용 UI 컴포넌트
├── utils/            # 순수 함수 (오류 문구 변환 등)
└── styles/
tests/unit/           # Vitest 단위 테스트
firestore.rules       # Firestore Security Rules
deploy/nginx.conf     # JCloud nginx 설정 예시
```

## JCloud 배포

```bash
# 로컬에서 빌드 후 인스턴스로 복사
npm run build
scp -r dist/* <user>@<jcloud-host>:/tmp/app/

# 인스턴스에서
sudo apt install -y nginx
sudo mkdir -p /var/www/app && sudo cp -r /tmp/app/* /var/www/app/
sudo cp nginx.conf /etc/nginx/sites-available/app
sudo ln -sf /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

배포 후 확인: 외부 브라우저 접속 → 로그인 → 하위 경로에서 새로고침 → 로그아웃
