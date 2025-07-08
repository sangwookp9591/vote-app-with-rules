import { FaCrown, FaUserMinus, FaCheck, FaTimes } from 'react-icons/fa';
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
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18, color: '#4f9fff' }}>
        팀원 관리 패널
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 18,
        }}
      >
        {members.map((m) => (
          <div
            key={m.id}
            style={{
              background: '#f8fbff',
              borderRadius: 12,
              padding: '12px 16px',
              boxShadow: m.isLeader ? '0 0 0 2px #4f9fff55' : undefined,
              border: m.isLeader ? '2px solid #4f9fff' : '1px solid #e0e7ef',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              minWidth: 180,
              transition: 'box-shadow 0.2s',
            }}
          >
            <img
              src={m.user.profileImageUrl || '/images/default-profile.png'}
              alt={m.user.nickname}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 12,
                border: m.isLeader ? '2px solid #ffd700' : '2px solid #e0e7ef',
              }}
            />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{m.user.nickname}</div>
            <div
              style={{
                fontSize: 13,
                color: m.isLeader ? '#ffd700' : '#888',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {m.isLeader ? (
                <>
                  <FaCrown color="#ffd700" /> 팀장
                </>
              ) : (
                '팀원'
              )}
            </div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              {m.inviteStatus === 'ACCEPTED' ? (
                <span style={{ color: '#4caf50', fontWeight: 600 }}>수락됨</span>
              ) : m.inviteStatus === 'PENDING' ? (
                <span style={{ color: '#ffc107', fontWeight: 600 }}>대기중</span>
              ) : (
                <span style={{ color: '#ff4d4f', fontWeight: 600 }}>거절됨</span>
              )}
            </div>
            {!m.isLeader && (
              <div style={{ display: 'flex', gap: 8 }}>
                {m.inviteStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => onStatusChange(m.id, 'ACCEPTED')}
                      style={{
                        background: '#4caf50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600,
                      }}
                      title="승인"
                    >
                      <FaCheck /> 승인
                    </button>
                    <button
                      onClick={() => onStatusChange(m.id, 'REJECTED')}
                      style={{
                        background: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600,
                      }}
                      title="거절"
                    >
                      <FaTimes /> 거절
                    </button>
                  </>
                )}
                {m.inviteStatus === 'ACCEPTED' && (
                  <button
                    onClick={() => onKick(m.id)}
                    style={{
                      background: '#eee',
                      color: '#ff4d4f',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 600,
                    }}
                    title="추방"
                  >
                    <FaUserMinus /> 추방
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
