'use client';

import { UserDetail } from '@/entities/user/detail';
import { fetchUserDetail } from '@/features/user-detail/api/userDetail';
import UserDetailCard from '@/features/user-detail/ui/UserDetailCard';
import UserDetailVod from '@/features/user-detail/ui/UserDetailVod';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function UserDetailWidget() {
  const params = useParams();

  const id = params?.id as string;
  const { data: userDetail, isLoading } = useQuery<UserDetail>({
    queryKey: ['userDetail', id],
    queryFn: () => fetchUserDetail(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div>
      UserDetailWidget
      {userDetail && (
        <>
          {' '}
          <UserDetailCard userDetail={userDetail} />
          <UserDetailVod vods={[]} />
        </>
      )}
    </div>
  );
}
