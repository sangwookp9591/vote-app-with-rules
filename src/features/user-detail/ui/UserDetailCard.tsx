import { UserDetail } from '../../../entities/user/detail/model/types';
export default function UserDetailCard({ userDetail }: { userDetail: UserDetail }) {
  return (
    <>
      <div>상단 페이지</div>
      <div>{userDetail?.id || '조회 실패'}</div>
    </>
  );
}
