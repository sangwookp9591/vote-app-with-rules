// Tournament model utilities

export const gameTypes = [
  {
    value: 'LoL',
    label: 'League of Legends',
    icon: '🎮',
    description: '5v5 팀 전투 게임',
    teamSize: 5,
    animation: 'lol-animation',
  },
  {
    value: 'PUBG',
    label: 'PUBG',
    icon: '🔫',
    description: '배틀 로얄 슈팅 게임',
    teamSize: 4,
    animation: 'pubg-animation',
  },
  {
    value: 'Overwatch',
    label: 'Overwatch',
    icon: '⚡',
    description: '팀 기반 FPS 게임',
    teamSize: 6,
    animation: 'overwatch-animation',
  },
  {
    value: 'Valorant',
    label: 'Valorant',
    icon: '🎯',
    description: '전술적 FPS 게임',
    teamSize: 5,
    animation: 'valorant-animation',
  },
  {
    value: 'CS2',
    label: 'Counter-Strike 2',
    icon: '💣',
    description: '클래식 FPS 게임',
    teamSize: 5,
    animation: 'cs2-animation',
  },
  {
    value: 'Dota2',
    label: 'Dota 2',
    icon: '⚔️',
    description: 'MOBA 전략 게임',
    teamSize: 5,
    animation: 'dota2-animation',
  },
];

export const getGameTypeInfo = (gameType: string) => {
  return gameTypes.find((game) => game.value === gameType);
};

export const getGameIcon = (gameType: string) => {
  const game = getGameTypeInfo(gameType);
  return game?.icon || '🏆';
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'PREPARING':
      return '준비중';
    case 'TEAM_RECRUITING':
      return '팀 모집중';
    case 'VOTING':
      return '투표 진행중';
    case 'IN_PROGRESS':
      return '진행중';
    case 'COMPLETED':
      return '완료';
    case 'CANCELLED':
      return '취소됨';
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PREPARING':
      return '#ffc107';
    case 'TEAM_RECRUITING':
      return '#17a2b8';
    case 'VOTING':
      return '#6f42c1';
    case 'IN_PROGRESS':
      return '#28a745';
    case 'COMPLETED':
      return '#6c757d';
    case 'CANCELLED':
      return '#dc3545';
    default:
      return '#ffc107';
  }
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
