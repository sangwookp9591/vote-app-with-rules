'use client';

import UserProfileEditForm from '@/features/user-profile/ui/UserProfileEditForm';
import { fetchUser } from '@/features/user/api/user';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export default function UserProfileUpdateWidget() {
  const { data: session } = useSession();
  const { data: user } = useQuery({
    queryKey: ['fetchUser', session?.user?.id],
    queryFn: () => fetchUser(session?.user?.id || ''),
    enabled: !!session?.user?.id,
  });
  return <>{user && <UserProfileEditForm user={user} />}</>;
}
