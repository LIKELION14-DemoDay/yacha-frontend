import { Link } from "react-router-dom";

import PolicyLayout from "../components/PolicyLayout";
import { SELLER_EMAIL } from "../utils/seller";

type Product = {
  name: string;
  price: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    name: "패스 (Pass)",
    price: "3,000원",
    description: "토론 플랫폼에서 추가 기능을 이용할 수 있는 이용권",
  },
  {
    name: "어택 팩 (Attack Pack)",
    price: "1,000원",
    description: "토론 중 사용할 수 있는 추가 기능 묶음",
  },
];

const PricingPage = () => {
  return (
    <PolicyLayout title="가격 안내" lang="ko" alternatePath="/en/pricing">
      <p>
        야차판은 AI의 도움을 받아 다른 이용자와 토론하는 웹 기반 토론
        플랫폼입니다. 기본 토론 기능은 무료로 이용할 수 있고, 아래 디지털 부가
        상품을 한 번씩 구매해 추가 기능을 이용할 수 있습니다.
      </p>

      <ul className="flex flex-col gap-3">
        {PRODUCTS.map((product) => (
          <li
            key={product.name}
            className="flex flex-col gap-2 rounded-[10px] bg-neutral-009 px-4 py-3.5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-subhead-m7 text-white">{product.name}</h2>
              <p className="shrink-0 text-subhead-m7 text-main">
                {product.price}
              </p>
            </div>
            <p>{product.description}</p>
            <p className="text-caption-r2 text-neutral-005">
              일회성 구매 · 정기 결제 없음
            </p>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">안내</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            모든 상품은 웹사이트에서 디지털 방식으로 제공되며, 실물 상품은
            판매하지 않습니다.
          </li>
          <li>
            모든 상품은 일회성 구매이며, 자동으로 다시 결제되는 정기 구독이
            아닙니다.
          </li>
          <li>
            표시된 가격은 대한민국 원(KRW) 기준이며, 결제 국가에 따라 세금이
            더해질 수 있습니다.
          </li>
          <li>결제는 판매 대행사인 Paddle(Paddle.com)을 통해 처리됩니다.</li>
          <li>
            환불은{" "}
            <Link to="/refund" className="underline underline-offset-2">
              환불 정책
            </Link>
            , 이용 조건은{" "}
            <Link to="/terms" className="underline underline-offset-2">
              이용약관
            </Link>
            을 확인해 주세요.
          </li>
          <li>
            문의:{" "}
            <a
              href={`mailto:${SELLER_EMAIL}`}
              className="wrap-anywhere underline underline-offset-2"
            >
              {SELLER_EMAIL}
            </a>
          </li>
        </ul>
      </section>
    </PolicyLayout>
  );
};

export default PricingPage;
