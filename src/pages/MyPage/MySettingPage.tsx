import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { clearAccessToken } from "../../apis/tokenStore";
import { changeMyPassword, updateMyNickname } from "../../apis/users";
import angleLeft from "../../assets/angle-left.svg";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";
import { useUserProfile } from "../../hooks/useUserProfile";
import type { UserProfile } from "../../types/user";
import { getApiErrorCode, getApiErrorMessage } from "../../utils/apiError";

function ProfileSettings({ profile }: { profile: UserProfile }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [savedNickname, setSavedNickname] = useState(profile.nickname);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isRequestPending = useRef(false);
  const philosopherName = profile.philosopher?.name;
  const canChangePassword = !profile.isGuest && profile.provider === "LOCAL";
  const hasNicknameChange = nickname.trim() !== savedNickname;
  const hasPasswordChange =
    canChangePassword && Boolean(currentPassword || newPassword);
  const canSave =
    !profile.isGuest &&
    nickname.trim().length > 0 &&
    (hasNicknameChange || hasPasswordChange) &&
    (!hasPasswordChange ||
      (currentPassword.length > 0 &&
        newPassword.length >= 8 &&
        newPassword.length <= 72));

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRequestPending.current || !canSave) return;

    isRequestPending.current = true;
    setIsSaving(true);
    setErrorMessage("");

    try {
      if (hasNicknameChange) {
        const updatedProfile = await updateMyNickname(nickname);
        // 비밀번호 변경이 실패해도 저장된 닉네임을 중복 요청하지 않습니다.
        setSavedNickname(updatedProfile.nickname);
        setNickname(updatedProfile.nickname);
      }
      if (hasPasswordChange) {
        await changeMyPassword({ currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }
      navigate("/mypage");
    } catch (error: unknown) {
      const code = getApiErrorCode(error);
      if (
        code === "UNAUTHORIZED" ||
        (axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          code !== "CURRENT_PASSWORD_MISMATCH")
      ) {
        clearAccessToken();
        navigate("/login", { replace: true });
        return;
      }
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      isRequestPending.current = false;
      setIsSaving(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSave} className="flex flex-1 flex-col">
      <div className="flex shrink-0 items-center px-6 py-5">
        <div className="flex size-20 items-center justify-center rounded-[5px] border-[0.5px] border-neutral-003 bg-neutral-001 text-[10px] text-neutral-006">
          profile
        </div>
      </div>

      <section className="flex shrink-0 flex-col items-start gap-1 px-6 py-1">
        <p className="text-subhead-r8 text-neutral-006">{philosopherName}</p>
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
          readOnly={isSaving || profile.isGuest}
          onChange={(event) => {
            setNickname(event.currentTarget.value);
            setErrorMessage("");
          }}
        />
        {canChangePassword && (
          <>
            <InputContainer
              label="현재 비밀번호"
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="현재 비밀번호를 입력해주세요."
              value={currentPassword}
              readOnly={isSaving}
              onChange={(event) => {
                setCurrentPassword(event.currentTarget.value);
                setErrorMessage("");
              }}
            />
            <div className="flex w-full flex-col gap-1">
              <InputContainer
                label="새 비밀번호"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="새 비밀번호를 입력해주세요."
                value={newPassword}
                readOnly={isSaving}
                onChange={(event) => {
                  setNewPassword(event.currentTarget.value);
                  setErrorMessage("");
                }}
              />
              <p className="px-6 text-body-r6 text-neutral-007">
                *비밀번호는 8자 이상이어야 합니다.
              </p>
            </div>
          </>
        )}
        {errorMessage && (
          <p className="px-6 text-caption-r1 text-main">{errorMessage}</p>
        )}
      </section>

      <footer className="flex shrink-0 flex-col items-start gap-3 self-stretch px-6 pt-2.5 pb-12.5">
        <LongButton
          type="submit"
          disabled={isSaving || !canSave}
          className="!bg-main !text-white enabled:hover:!bg-main-006 disabled:!bg-neutral-008"
        >
          이대로 저장
        </LongButton>
      </footer>
    </form>
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

      {profile && <ProfileSettings key={profile.userId} profile={profile} />}
    </main>
  );
}

export default MySettingPage;
