import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../apis/auth";
import angleLeft from "../../assets/angle-left.svg";
import balanceScale from "../../assets/balance-scale-solid.svg";
import linkIcon from "../../assets/link-solid.svg";
import logoLeft from "../../assets/logo-left.svg";
import logoRight from "../../assets/logo-right.svg";
import LongButton from "../../components/Button";
import StatusBar from "../../components/StatusBar";
import { useUserProfile } from "../../hooks/useUserProfile";
import type { UserProfile } from "../../types/user";
import { isPhilosopherType } from "../../types/balanceGame";
import { getApiErrorMessage } from "../../utils/apiError";

function ProfileHero() {
  return (
    <section className="relative h-24.5 shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_110%,#4d4747_0%,transparent_100%)]" />
      <img
        src={logoRight}
        alt=""
        className="absolute top-5.5 left-[calc(50%-96px)] h-9 w-11"
      />
      <img
        src={logoLeft}
        alt=""
        className="absolute top-0 left-[calc(50%+48px)] h-9 w-11"
      />
      <div className="absolute bottom-0 left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-[5px] border-[0.5px] border-neutral-003 bg-neutral-001 text-[10px] text-neutral-006">
        profile
      </div>
    </section>
  );
}

function BattleRecord({ stats }: { stats: UserProfile["stats"] }) {
  return (
    <section className="flex shrink-0 flex-col gap-3 px-6">
      <div className="flex h-6 items-center gap-2">
        <span className="h-px min-w-0 flex-1 bg-linear-to-r from-secondary to-neutral-006" />
        <h2 className="text-subhead-r8 text-neutral-001">전투 기록</h2>
        <img src={balanceScale} alt="" className="size-6 shrink-0" />
        <span className="h-px min-w-0 flex-1 bg-linear-to-r from-neutral-006 to-secondary" />
      </div>

      <dl className="flex justify-center gap-20">
        {[
          { label: "승리", count: stats.wins },
          { label: "패배", count: stats.losses },
        ].map(({ label, count }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <dt className="text-body-m3 text-neutral-006">{label}</dt>
            <dd className="text-headline-sb3 text-white">{count}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const philosopherName = profile?.philosopher?.name;
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const isLogoutPending = useRef(false);

  const handleLogout = async () => {
    if (isLogoutPending.current) return;

    isLogoutPending.current = true;
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      setLogoutError(getApiErrorMessage(error));
    } finally {
      isLogoutPending.current = false;
      setIsLoggingOut(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const type = profile?.philosopher?.type;
      const shareUrl = new URL(
        isPhilosopherType(type) ? `/balance/result/${type}` : "/balance",
        window.location.origin,
      ).href;
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>

      <header className="flex h-12 shrink-0 items-center gap-2.5 px-6 py-2">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
        <h1 className="text-subhead-m5">My</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="ml-auto cursor-pointer text-body-r6 text-neutral-005 disabled:cursor-not-allowed disabled:opacity-50"
        >
          로그아웃
        </button>
      </header>

      {logoutError && (
        <p className="px-6 py-2 text-caption-r1 text-main">
          {logoutError}
        </p>
      )}

      {profile ? (
        <>
          <ProfileHero />

          <section className="flex shrink-0 flex-col items-center gap-1 px-6 pt-4 pb-7">
            <p className="text-subhead-r8 text-neutral-006">
              {philosopherName}
            </p>
            <h2 className="text-subhead-m5">{profile.nickname}</h2>
          </section>

          <BattleRecord stats={profile.stats} />

          <div className="flex flex-1 flex-col gap-5 py-10">
            <section className="flex flex-col">
              <h2 className="px-6 py-1 text-body-m3 text-neutral-006">
                내 정보
              </h2>
              <button
                type="button"
                onClick={() => navigate("/my/setting")}
                className="cursor-pointer border-b border-neutral-009 px-6 py-4 text-left text-body-r2"
              >
                내 프로필 설정
              </button>

              <div className="flex flex-col gap-5 border-b border-neutral-009 px-6 py-4">
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-body-r2">내 철학 유형</h3>
                  <p className="text-subhead-r3 text-neutral-006">
                    {philosopherName}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <LongButton
                    className="!bg-main !text-white hover:!bg-main-006"
                    onClick={() => navigate("/balance")}
                  >
                    밸런스 게임 하러가기
                  </LongButton>
                  <div className="flex flex-wrap items-center justify-between">
                    <p className="text-subhead-r8 text-neutral-006">
                      친구와 공유하고 유형을 비교해보세요.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex shrink-0 cursor-pointer items-center gap-1 text-body-r6 text-main hover:text-main-004"
                    >
                      {copyStatus === "success" ? "복사 완료" : "링크 복사"}
                      <img src={linkIcon} alt="" className="size-5" />
                    </button>
                    {copyStatus === "error" && (
                      <p className="w-full text-caption-r2 text-main">
                        링크를 복사하지 못했습니다. 다시 시도해주세요.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <button
                type="button"
                onClick={() => navigate("/my/bookmarks")}
                className="w-full cursor-pointer border-b border-neutral-009 px-6 py-5 text-left text-body-r2"
              >
                북마크
              </button>
            </section>
          </div>
        </>
      ) : (
        <div className="flex-1" />
      )}

      {/* 추후 Google 광고를 삽입할 독립 영역입니다. */}
      <aside className="h-17.5 shrink-0 bg-green" />
    </main>
  );
}

export default MyPage;
