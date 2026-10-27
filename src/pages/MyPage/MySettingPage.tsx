import { useState } from "react";
import { useNavigate } from "react-router-dom";

import angleLeft from "../../assets/angle-left.svg";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";

// 프로필 API와 유형별 이미지 연동 전 시안에 맞춘 예시 데이터입니다.
const profile = {
  nickname: "치이카와",
  philosophyType: "아리스토텔레스",
  email: "hachiware@example.com",
  imageUrl: "",
};

function MySettingPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [password, setPassword] = useState("");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-100.5 flex-col bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>

      <header className="flex h-12 shrink-0 items-center gap-2.5 px-6 py-2">
        <button
          type="button"
          onClick={() => navigate("/mypage")}
          aria-label="My 페이지로 돌아가기"
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
        <h1 className="text-subhead-m5">내 프로필 설정</h1>
      </header>

      <div className="flex shrink-0 items-center px-6 py-5">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt={`${profile.philosophyType}형 프로필`}
            className="size-20 rounded-[5px] object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${profile.philosophyType}형 프로필 이미지 준비 중`}
            className="flex size-20 items-center justify-center rounded-[5px] border-[0.5px] border-neutral-003 bg-neutral-001 text-[10px] text-neutral-006"
          >
            profile
          </div>
        )}
      </div>

      <section className="flex shrink-0 flex-col items-start gap-1 px-6 py-1">
        <p className="text-subhead-r8 text-neutral-006">
          {profile.philosophyType}형
        </p>
        <p aria-label="아이디" className="w-full break-all text-subhead-m5">
          {profile.email}
        </p>
      </section>

      <section
        aria-label="계정 정보"
        className="flex flex-1 flex-col items-start gap-5 py-5"
      >
        <InputContainer
          label="닉네임"
          name="nickname"
          autoComplete="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.currentTarget.value)}
        />
        <InputContainer
          label="비밀번호"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="**********"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          containerClassName="[&[data-state=unselected]>div:last-child]:border-neutral-006 [&[data-state=unselected]_input]:placeholder:text-neutral-006 [&[data-state=unselected]_button]:text-neutral-006"
        />
      </section>

      <footer className="flex shrink-0 flex-col items-start gap-3 self-stretch px-6 pt-2.5 pb-12.5">
        <LongButton
          onClick={() => navigate("/mypage")}
          className="!bg-main !text-white hover:!bg-main-006"
        >
          이대로 저장
        </LongButton>
      </footer>
    </main>
  );
}

export default MySettingPage;
