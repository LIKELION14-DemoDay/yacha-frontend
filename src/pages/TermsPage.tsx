import { Link } from "react-router-dom";

import PolicyLayout from "../components/PolicyLayout";
import { SELLER_EMAIL, SELLER_NAME } from "../utils/seller";

const TermsPage = () => {
  return (
    <PolicyLayout title="이용약관" lang="ko" alternatePath="/en/terms">
      <div className="flex flex-col gap-3">
        <p>
          이 약관은 {SELLER_NAME}(이하 "운영자")이 제공하는 야차판(이하
          "서비스")을 이용하는 데 필요한 조건을 정합니다. 서비스를 이용하면 이
          약관에 동의한 것으로 봅니다.
        </p>
        <p className="text-neutral-005">시행일: 2026년 11월 10일</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">1. 서비스 내용</h2>
        <p>
          서비스는 이용자가 AI의 도움을 받아 다른 이용자와 토론하는 웹 기반 토론
          플랫폼입니다. 토론 매칭, AI 판정, 1분 철학 등 기본 기능은 무료로
          제공하며, 일부 추가 기능은 유료 디지털 상품으로 제공합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">2. 계정</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            이용자는 이메일, 카카오 · 구글 계정으로 가입하거나 비회원으로 이용할
            수 있습니다.
          </li>
          <li>
            계정 정보는 본인이 관리해야 하며, 다른 사람에게 넘기거나 빌려줄 수
            없습니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">3. 유료 상품과 결제</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            유료 상품의 종류와 가격은{" "}
            <Link to="/pricing" className="underline underline-offset-2">
              가격 안내
            </Link>{" "}
            페이지에 표시합니다.
          </li>
          <li>모든 유료 상품은 일회성 구매이며, 정기 결제는 없습니다.</li>
          <li>
            상품은 결제가 끝나면 바로 이용자 계정에 디지털 방식으로 제공됩니다.
          </li>
          <li>
            주문은 온라인 판매 대행사인 Paddle.com이 처리합니다. Paddle.com은
            모든 주문의 판매자(Merchant of Record)로서 결제, 세금, 결제 관련
            고객 문의와 환불을 처리합니다.
          </li>
          <li>
            환불은{" "}
            <Link to="/refund" className="underline underline-offset-2">
              환불 정책
            </Link>
            을 따릅니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">4. 이용자의 의무</h2>
        <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>욕설, 혐오 표현, 다른 이용자를 괴롭히는 행위</li>
          <li>다른 사람의 개인정보를 올리거나 다른 사람을 사칭하는 행위</li>
          <li>
            서비스의 정상적인 운영을 방해하거나 허락 없이 자동화된 방법으로
            이용하는 행위
          </li>
          <li>관련 법령을 위반하는 행위</li>
        </ul>
        <p>위 행위가 확인되면 운영자는 서비스 이용을 제한할 수 있습니다.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">5. 게시물과 AI 판정</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>토론 중 작성한 글의 책임은 작성한 이용자에게 있습니다.</li>
          <li>
            AI 판정과 AI가 만든 글은 참고용이며, 정확성이나 특정 결과를 보장하지
            않습니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">6. 서비스 변경 및 중단</h2>
        <p>
          운영자는 서비스 내용을 바꾸거나 점검 등으로 잠시 중단할 수 있으며,
          중요한 변경은 서비스 화면을 통해 미리 알립니다. 이미 구매한 상품에
          영향이 있는 경우 환불 정책에 따라 처리합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">7. 개인정보</h2>
        <p>
          개인정보 처리는{" "}
          <Link to="/privacy" className="underline underline-offset-2">
            개인정보처리방침
          </Link>
          을 따릅니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">8. 약관 변경</h2>
        <p>이 약관이 바뀌면 시행 7일 전부터 서비스 화면을 통해 알려드립니다.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subhead-m7 text-white">9. 운영자 정보 및 문의</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>운영자: {SELLER_NAME}</li>
          <li>
            이메일:{" "}
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

export default TermsPage;
