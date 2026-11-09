import PolicyLayout from "../components/PolicyLayout";
import PolicyTable from "../components/PolicyTable";

const PrivacyPolicyPage = () => {
  return (
    <PolicyLayout
      title="개인정보처리방침"
      lang="ko"
      alternatePath="/en/privacy"
    >
      <div className="flex flex-col gap-3">
        <p>
          야차판(이하 "서비스")은 이용자의 개인정보를 소중히 다루며, 어떤 정보를
          왜 받고 얼마나 보관하는지 아래와 같이 알려드립니다.
        </p>
        <p className="text-neutral-005">시행일: 2026년 10월 31일</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">1. 수집하는 개인정보</h2>
        <PolicyTable
          caption="수집하는 개인정보"
          headers={["언제", "항목"]}
          rows={[
            ["이메일 회원가입", "이메일, 비밀번호(암호화하여 저장), 닉네임"],
            [
              "카카오 · 구글 로그인",
              "카카오 · 구글 계정 식별값, 이메일(제공에 동의한 경우), 닉네임",
            ],
            ["비회원으로 시작", "자동으로 만든 닉네임 (이메일 등은 받지 않음)"],
            [
              "서비스 이용 중",
              "밸런스 게임 결과(철학자 유형), 토론 기록(주제, 입장, 승패, 참여 시각), 1분 철학 메모 · 북마크",
            ],
            ["자동으로 생성", "접속 IP 주소, 로그인 유지용 쿠키"],
          ]}
        />
        <p>
          토론 중 작성한 주장 · 반론 · 채팅은 게임이 진행되는 동안에만 서버
          메모리에 두고, 게임이 끝나면 저장하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">2. 이용 목적</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>회원 식별, 로그인 및 로그인 유지</li>
          <li>토론 매칭, 게임 진행, AI 판정 및 AI 상대(봇) 제공</li>
          <li>전적 · 철학자 유형 · 1분 철학 등 서비스 기능 제공</li>
          <li>비밀번호 찾기 인증번호 발송</li>
          <li>반복 요청 차단 등 서비스 보안 (접속 IP)</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">3. 보관 기간</h2>
        <PolicyTable
          caption="개인정보 보관 기간"
          headers={["항목", "보관 기간"]}
          rows={[
            ["회원 정보 · 서비스 이용 기록", "회원 탈퇴(삭제 요청) 시까지"],
            [
              "비회원 계정",
              "만든 지 14일이 지나고 로그인 유지 기록이 없으면 자동 삭제",
            ],
            ["로그인 유지 쿠키", "14일 (로그아웃하면 즉시 삭제)"],
            ["비밀번호 찾기 인증번호", "3분"],
            ["반복 요청 차단용 접속 IP 기록", "최대 24시간"],
            ["로그인 전 밸런스 게임 결과 쿠키", "1시간"],
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">
          4. 개인정보 처리 위탁 및 외부 서비스
        </h2>
        <p>서비스 제공을 위해 아래 업체에 개인정보 처리를 맡기고 있습니다.</p>
        <PolicyTable
          caption="개인정보 처리 위탁 및 외부 서비스"
          headers={["업체", "맡기는 일", "전달되는 정보"]}
          rows={[
            [
              "카카오, Google",
              "소셜 로그인",
              "로그인 시 각 업체가 제공하는 계정 정보",
            ],
            [
              "라이너(Liner)",
              "AI 판정, AI 상대, 1분 철학 글 생성",
              "토론 주제 · 입장 · 주장 · 반론 · 채팅 내용 (닉네임 · 이메일은 보내지 않음)",
            ],
            [
              "Google (Gmail)",
              "비밀번호 찾기 인증번호 메일 발송",
              "이메일 주소, 인증번호",
            ],
            [
              "Amazon Web Services",
              "서버 및 데이터베이스 운영",
              "서비스에 저장되는 정보 전체",
            ],
            ["Vercel", "웹사이트 제공", "접속 기록"],
            [
              "Paddle (Paddle.com)",
              "유료 상품 결제 · 환불 처리",
              "이메일, 결제 정보(카드 정보는 Paddle이 직접 받으며 서비스에 저장하지 않음), 국가",
            ],
          ]}
        />
        <p>
          위 경우를 제외하고 이용자의 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">5. 이용자의 권리</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            이용자는 언제든 자신의 개인정보를 열람 · 수정 · 삭제(탈퇴)하도록
            요청할 수 있습니다.
          </li>
          <li>닉네임은 마이페이지에서 바로 바꿀 수 있습니다.</li>
          <li>
            그 밖의 요청은 아래 이메일로 보내 주시면 지체 없이 처리합니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">6. 쿠키</h2>
        <p>
          로그인 유지와 로그인 전 밸런스 게임 결과 보관을 위해 쿠키를
          사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있지만, 이 경우 로그인
          유지가 되지 않을 수 있습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">7. 안전성 확보 조치</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>비밀번호는 복원할 수 없는 방식으로 암호화하여 저장합니다.</li>
          <li>모든 통신은 HTTPS로 암호화합니다.</li>
          <li>개인정보에 접근할 수 있는 인원을 운영진으로 제한합니다.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">8. 개인정보 보호책임자</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>책임자: 박수민</li>
          <li>
            이메일:{" "}
            <a
              href="mailto:yachaphilosophy@gmail.com"
              className="wrap-anywhere underline underline-offset-2"
            >
              yachaphilosophy@gmail.com
            </a>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">9. 변경 안내</h2>
        <p>이 방침이 바뀌면 시행 7일 전부터 서비스 화면을 통해 알려드립니다.</p>
      </section>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;
