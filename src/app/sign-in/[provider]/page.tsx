"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

function SignInProviderPage({
  params,
}: {
  params: { provider: "naver" | "kakao" };
}) {
  const { data } = useSession();

  useEffect(() => {
    if (data) {
      window.close();
    } else {
      signIn(params.provider);
    }
  }, [data]);

  return null;
}

export default SignInProviderPage;
