# ARCOA · Archive of Calm

ARCOA의 모바일 우선 링크 허브입니다. Firebase, 데이터베이스, 로그인 없이 동작하는 정적 사이트이며 GitHub Pages로 배포할 수 있습니다.

## 콘텐츠 수정

브랜드 문구, 서비스, Explore, Featured, 푸터 정보와 모든 URL은 [src/data.js](./src/data.js)에서 관리합니다.

- 서비스 필드: 영문명, 한글명, 제목, 설명, URL, 상태, Featured 여부
- URL이 비어 있는 서비스는 클릭되지 않고 상태만 표시됩니다.
- Explore의 `locales` 배열로 KR/EN 링크를 관리합니다.
- Footer의 소셜 URL과 아이콘 종류도 `footer.socials`에서 관리합니다.

## 로컬 확인

```bash
npm run lint
npm run build
npm run dev
```

`npm run dev` 실행 후 `http://127.0.0.1:4173`을 엽니다. 파일을 직접 더블 클릭하면 브라우저 보안 정책 때문에 스크립트가 다르게 동작할 수 있습니다.

## GitHub Pages 배포

1. 저장소의 기본 브랜치를 `main`으로 사용합니다.
2. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
3. `main`에 push하면 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)이 검사 후 자동 배포합니다.

### `now.arcoa.kr` 연결

저장소 루트의 [CNAME](./CNAME)에 `now.arcoa.kr`이 들어 있습니다. DNS 관리 화면에서 아래 레코드를 추가하고 GitHub Pages의 **Custom domain**에도 `now.arcoa.kr`을 입력합니다.

```text
Type: CNAME
Name: now
Value: <GitHub 사용자명>.github.io
```

## 구조

```text
.
├── index.html
├── styles.css
├── src/
│   ├── data.js       # 콘텐츠와 URL 데이터
│   └── app.js        # 데이터 렌더링과 외부 링크 처리
├── assets/
│   ├── ARCOA-header.png
│   ├── ARCOA-footer.png
│   ├── LINESeedKR-Rg.woff2
│   ├── LINESeedKR-Bd.woff2
│   └── og-image.png
├── CNAME
└── .github/workflows/deploy.yml
```
