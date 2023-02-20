import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthenticatedPage() {
  const router = useRouter();

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!localStorage.getItem('sessionId')) {
      router.push('/');
    }
  }, []);

  return <div>인증된 페이지</div>;
}