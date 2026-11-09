import PolicyLayout from "../components/PolicyLayout";
import { SELLER_EMAIL } from "../utils/seller";

const RefundPolicyPage = () => {
  return (
    <PolicyLayout title="환불 정책" lang="ko" alternatePath="/en/refund">
      <div className="flex flex-col gap-3">
        <p>
          야차판의 유료 디지털 상품(패스, 어택 팩 등) 환불 기준을 아래와 같이
          안내합니다.
        </p>
        <p className="text-neutral-005">시행일: 2026년 11월 10일</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">1. 환불 기간</h2>
        <p>구매일로부터 14일 안에 요청하면 결제 금액 전액을 환불해 드립니다.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">2. 환불 신청 방법</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            아래 이메일로 주문 번호(또는 결제 영수증)와 환불 사유를 보내 주세요.
          </li>
          <li>
            결제 영수증 메일에 있는 Paddle 링크로 Paddle에 직접 환불을 요청할
            수도 있습니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">3. 처리 기간</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>환불 요청을 받으면 영업일 기준 3일 안에 처리합니다.</li>
          <li>
            환불 금액은 결제한 수단으로 돌아가며, 카드사 · 결제사에 따라 실제
            입금까지 5~10영업일이 걸릴 수 있습니다.
          </li>
          <li>환불이 끝나면 해당 상품은 더 이상 이용할 수 없습니다.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">4. 결제 처리</h2>
        <p>결제와 환불은 판매 대행사인 Paddle(Paddle.com)을 통해 처리됩니다.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">5. 문의</h2>
        <p>
          이메일:{" "}
          <a
            href={`mailto:${SELLER_EMAIL}`}
            className="wrap-anywhere underline underline-offset-2"
          >
            {SELLER_EMAIL}
          </a>
        </p>
      </section>
    </PolicyLayout>
  );
};

export default RefundPolicyPage;
