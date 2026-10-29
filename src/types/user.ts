export type UserProfile = {
  userId: number;
  nickname: string;
  email: string | null;
  isGuest: boolean;
  provider: "LOCAL" | "KAKAO" | "GOOGLE" | null;
  stats: {
    wins: number;
    losses: number;
  };
  philosopher: {
    type: string | null;
    name: string;
    alias: string | null;
  } | null;
  balanceGameRequired: boolean;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
