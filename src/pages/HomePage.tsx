import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        className="rounded-lg bg-main px-6 py-3 text-white"
        type="button"
        onClick={handleLoginClick}
      >
        로그인
      </button>
    </main>
  );
}

export default HomePage;
