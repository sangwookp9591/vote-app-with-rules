import { TeamMember } from '@/entities/team/model/types';

interface TeamMemberManagerProps {
  members: TeamMember[];
  isLeader: boolean;
  onStatusChange: (memberId: string, inviteStatus: 'ACCEPTED' | 'REJECTED') => void;
  onKick: (memberId: string) => void;
}

export default function TeamMemberManager({
  members,
  isLeader,
  onStatusChange,
  onKick,
}: TeamMemberManagerProps) {
  if (!isLeader) return null;
  return (
    <div
      style={{
        background: '#f6faff',
        border: '2px solid #e0e7ef',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        boxShadow: '0 2px 12px #e0e7ef33',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18, color: '#4f9fff' }}>
        팀원 관리 패널
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {members.map((m) => (
          <li
            key={m.id}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}
          >
            <span style={{ fontWeight: 600 }}>
              {m.user.nickname}
              {m.isLeader && ' 👑'}
            </span>
            <span style={{ marginLeft: 8 }}>
              {m.inviteStatus === 'ACCEPTED'
                ? '수락'
                : m.inviteStatus === 'PENDING'
                  ? '대기'
                  : '거절'}
            </span>
            {!m.isLeader && (
              <>
                {m.inviteStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => onStatusChange(m.id, 'ACCEPTED')}
                      style={{
                        marginLeft: 8,
                        background: '#4f9fff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => onStatusChange(m.id, 'REJECTED')}
                      style={{
                        marginLeft: 4,
                        background: '#eee',
                        color: '#ff4f4f',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      거절
                    </button>
                  </>
                )}
                {m.inviteStatus === 'ACCEPTED' && (
                  <button
                    onClick={() => onKick(m.id)}
                    style={{
                      marginLeft: 8,
                      background: '#eee',
                      color: '#ff4f4f',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    추방
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
