# 협업 세팅

## 과정

1. 이슈 생성 : 커밋할 변경 사항에 대해 `이슈` 생성
2. 브랜치 생성 : main 브랜치에서 `브랜치 컨벤션`에 따라 분기
3. 커밋 : 하단에 작성된 `커밋 컨밴션` 에 맞게 커밋 메시지 작성
4. 풀 리퀘스트(PR) : main 브랜치로 병합 요청
5. main 브랜치 병합

## Issue 템플릿

```markdown
## 📄 설명

> 어떤 작업 또는 문제가 있는지 적어주세요.

## ✏️ 작업 내용

- [ ]
- [ ]
- [ ]

## 📌 참고 사항

> 관련 문서, 화면, 링크가 있다면 적어주세요.
```

## 브랜치 컨벤션

`<type>/<issue-number>-<short-description>`

ex)

- feature/114-add-typescript
- fix/202-create-profile-page

## **커밋 컨벤션**

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 동작 변화 없는 구조 개선
- `style`: CSS·UI 스타일 수정
- `docs`: 문서 수정
- `test`: 테스트 추가·수정
- `chore`: 설정, 라이브러리, 빌드 관련 작업

```
#예시

feat: 판례 검색 결과 목록 추가
feat: 인용 판례 비교 화면 추가
fix: 검색 필터 초기화 오류 수정
style: 판결문 본문 여백 조정
chore: Prettier 설정 추가
```

## PR 템플릿

```markdown
## #️⃣ 연관된 이슈

> ex) #이슈번호, #이슈번호

## 📝 작업 내용

> 이번 PR에서 작업한 내용을 간략히 설명해주세요.

## 📷 스크린샷 (선택)

> 작업한 화면에 대한 스크린샷을 첨부해주세요.

## 💬 참고사항 (선택)

> 리뷰어가 참고해야하는 사항이 있다면 작성해주세요.
```

## 코딩 컨벤션

- 컴포넌트·파일명은 PascalCase를 사용한다. 예: `CaseSearchPage.tsx`
- 함수·변수명은 camelCase를 사용한다. 예: `selectedCaseId`
- 타입 이름은 PascalCase를 사용한다. 예: `CaseDetail`
- `any` 사용을 피하고 필요한 타입을 명시한다.
- 재사용 가능한 UI는 `components`에, 화면은 `pages`에 둔다.
- API 요청 코드는 화면 컴포넌트에 직접 반복 작성하지 않고 `api` 폴더에서 관리한다.
- CSS 클래스명은 kebab-case를 사용한다. 예: `case-detail-panel`
- 코드 작성 후 `npm run lint`를 실행한다.
- 포맷은 Prettier 설정을 따르며, 커밋 전 `npx prettier . --write`를 실행한다.
