import { useState } from "react";
import { useNavigate } from "react-router-dom";

import angleLeft from "../../assets/angle-left.svg";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";
import { useUserProfile } from "../../hooks/useUserProfile";
import type { UserProfile } from "../../types/user";

function ProfileSettings({ profile }: { profile: UserProfile }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [password, setPassword] = useState("");
  const philosopherName = profile.philosopher?.name;

  return (
    <>
      <div className="flex shrink-0 items-center px-6 py-5">
        <div
          className="flex size-20 items-center justify-center rounded-[5px] border-[0.5px] border-neutral-003 bg-neutral-001 text-[10px] text-neutral-006"
        >
          profile
        </div>
      </div>

      <section className="flex shrink-0 flex-col items-start gap-1 px-6 py-1">
        <p className="text-subhead-r8 text-neutral-006">
          {philosopherName}
        </p>
        <p className="w-full break-all text-subhead-m5">
          {profile.email ??
            (profile.isGuest ? "비회원 계정" : "등록된 이메일이 없습니다.")}
        </p>
      </section>

      <section className="flex flex-1 flex-col items-start gap-5 py-5">
        <InputContainer
          label="닉네임"
          name="nickname"
          autoComplete="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.currentTarget.value)}
        />
        {!profile.isGuest && profile.provider === "LOCAL" && (
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
        )}
      </section>

      <footer className="flex shrink-0 flex-col items-start gap-3 self-stretch px-6 pt-2.5 pb-12.5">
        <LongButton
          onClick={() => navigate("/mypage")}
          className="!bg-main !text-white hover:!bg-main-006"
        >
          이대로 저장
        </LongButton>
      </footer>
    </>
  );
}

function MySettingPage() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-100.5 flex-col bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>
      <header className="flex h-12 shrink-0 items-center gap-2.5 px-6 py-2">
        <button
          type="button"
          onClick={() => navigate("/mypage")}
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
        <h1 className="text-subhead-m5">내 프로필 설정</h1>
      </header>

      {profile && (
        <ProfileSettings key={profile.userId} profile={profile} />
      )}
    </main>
  );
}

export default MySettingPage;
