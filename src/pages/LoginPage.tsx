function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5">
      <h1 className="text-headline-sb3">로그인 페이지</h1>
      <button
        className="flex h-13 w-full max-w-80 items-center justify-center gap-2 rounded-xl bg-yellow text-body-m3 text-black"
        type="button"
      >
        카카오로 로그인
      </button>
    </main>
  );
}

export default LoginPage;
