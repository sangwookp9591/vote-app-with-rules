'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createPageWrapper,
  createForm,
  formTitle,
  formGroup,
  formLabel,
  formInput,
  formTextarea,
  teamSize,
  submitButton,
  cancelButton,
  buttonGroup,
  dateTimePicker,
  dateTimePickerInput,
  dateTimePickerButton,
  dateTimePickerModal,
  dateTimePickerOverlay,
  dateTimePickerContent,
  dateTimePickerHeader,
  dateTimePickerTitle,
  dateTimePickerClose,
  dateTimePickerBody,
  dateTimePickerSection,
  dateTimePickerSectionTitle,
  dateTimePickerRow,
  dateTimePickerColumn,
  dateTimePickerOption,
  dateTimePickerOptionSelected,
  dateTimePickerFooter,
  dateTimePickerConfirm,
  dateTimePickerCancel,
  gameTypeSelector,
  gameTypeOption,
  gameTypeIcon,
  gameTypeLabel,
  gameTypeDescription,
} from './create.css';
import { useSession } from 'next-auth/react';

export default function CreateTournamentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameType: 'LoL',
    teamSize: 5,
    startDate: '',
    endDate: '',
  });

  const gameTypes = [
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

  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('session : ', session?.user);
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          streamerId: session?.user.id, // TODO: 실제 스트리머 ID로 교체
        }),
      });

      if (!response.ok) {
        throw new Error('토너먼트 생성에 실패했습니다.');
      }

      const result = await response.json();
      router.push(`/tournaments/${result.id}`);
    } catch (error) {
      console.error('토너먼트 생성 오류:', error);
      alert('토너먼트 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGameTypeChange = (gameType: string) => {
    const selectedGame = gameTypes.find((game) => game.value === gameType);
    setFormData((prev) => ({
      ...prev,
      gameType,
      teamSize: selectedGame?.teamSize || 5,
    }));
  };

  const CustomDateTimePicker = ({
    isOpen,
    onClose,
    value,
    onChange,
    title,
  }: {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (value: string) => void;
    title: string;
  }) => {
    const [tempDate, setTempDate] = useState(() => {
      if (value) {
        const date = new Date(value);
        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
        };
      }
      return {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      };
    });

    const handleConfirm = () => {
      const date = new Date(
        tempDate.year,
        tempDate.month - 1,
        tempDate.day,
        tempDate.hour,
        tempDate.minute,
      );
      onChange(date.toISOString());
      onClose();
    };

    const handleCancel = () => {
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className={dateTimePickerOverlay} onClick={onClose}>
        <div className={dateTimePickerModal} onClick={(e) => e.stopPropagation()}>
          <div className={dateTimePickerContent}>
            <div className={dateTimePickerHeader}>
              <h3 className={dateTimePickerTitle}>{title}</h3>
              <button className={dateTimePickerClose} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={dateTimePickerBody}>
              {/* 날짜 선택 */}
              <div className={dateTimePickerSection}>
                <div className={dateTimePickerSectionTitle}>날짜</div>
                <div className={dateTimePickerRow}>
                  <div className={dateTimePickerColumn}>
                    <div className={dateTimePickerSectionTitle}>년도</div>
                    <div
                      className="dateTimePickerScroll"
                      style={{ maxHeight: '130px', overflowY: 'auto' }}
                    >
                      {years.map((year) => (
                        <div
                          key={year}
                          className={`${dateTimePickerOption} ${tempDate.year === year ? dateTimePickerOptionSelected : ''} ${tempDate.year === year ? 'selected' : ''}`}
                          onClick={() => setTempDate((prev) => ({ ...prev, year }))}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={dateTimePickerColumn}>
                    <div className={dateTimePickerSectionTitle}>월</div>
                    <div
                      className="dateTimePickerScroll"
                      style={{ maxHeight: '130px', overflowY: 'auto' }}
                    >
                      {months.map((month, index) => (
                        <div
                          key={index}
                          className={`${dateTimePickerOption} ${tempDate.month === index + 1 ? dateTimePickerOptionSelected : ''} ${tempDate.month === index + 1 ? 'selected' : ''}`}
                          onClick={() => setTempDate((prev) => ({ ...prev, month: index + 1 }))}
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={dateTimePickerColumn}>
                    <div className={dateTimePickerSectionTitle}>일</div>
                    <div
                      className="dateTimePickerScroll"
                      style={{ maxHeight: '130px', overflowY: 'auto' }}
                    >
                      {days.map((day) => (
                        <div
                          key={day}
                          className={`${dateTimePickerOption} ${tempDate.day === day ? dateTimePickerOptionSelected : ''} ${tempDate.day === day ? 'selected' : ''}`}
                          onClick={() => setTempDate((prev) => ({ ...prev, day }))}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간 선택 */}
              <div className={dateTimePickerSection}>
                <div className={dateTimePickerSectionTitle}>시간</div>
                <div className={dateTimePickerRow}>
                  <div className={dateTimePickerColumn}>
                    <div className={dateTimePickerSectionTitle}>시</div>
                    <div
                      className="dateTimePickerScroll"
                      style={{ maxHeight: '130px', overflowY: 'auto' }}
                    >
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className={`${dateTimePickerOption} ${tempDate.hour === hour ? dateTimePickerOptionSelected : ''} ${tempDate.hour === hour ? 'selected' : ''}`}
                          onClick={() => setTempDate((prev) => ({ ...prev, hour }))}
                        >
                          {hour.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={dateTimePickerColumn}>
                    <div className={dateTimePickerSectionTitle}>분</div>
                    <div
                      className="dateTimePickerScroll"
                      style={{ maxHeight: '130px', overflowY: 'auto' }}
                    >
                      {minutes.map((minute) => (
                        <div
                          key={minute}
                          className={`${dateTimePickerOption} ${tempDate.minute === minute ? dateTimePickerOptionSelected : ''} ${tempDate.minute === minute ? 'selected' : ''}`}
                          onClick={() => setTempDate((prev) => ({ ...prev, minute }))}
                        >
                          {minute.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={dateTimePickerFooter}>
              <button className={dateTimePickerCancel} onClick={handleCancel}>
                취소
              </button>
              <button className={dateTimePickerConfirm} onClick={handleConfirm}>
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={createPageWrapper}>
      <div className={createForm}>
        <h1 className={formTitle}>새 토너먼트 생성</h1>

        <form onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label htmlFor="title" className={formLabel}>
              토너먼트 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={formInput}
              placeholder="예: 제 1회 LoL SWL"
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="description" className={formLabel}>
              토너먼트 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={formTextarea}
              placeholder="토너먼트에 대한 자세한 설명을 입력하세요..."
              rows={4}
            />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>게임 종류 *</label>
            <div className={gameTypeSelector}>
              {gameTypes.map((game) => (
                <div
                  key={game.value}
                  className={`${gameTypeOption} ${formData.gameType === game.value ? 'selected' : ''}`}
                  onClick={() => handleGameTypeChange(game.value)}
                >
                  <div className={`${gameTypeIcon} ${game.animation}`}>{game.icon}</div>
                  <div className={gameTypeLabel}>{game.label}</div>
                  <div className={gameTypeDescription}>{game.description}</div>
                  <div className={teamSize}>팀원 수: {game.teamSize}명</div>
                </div>
              ))}
            </div>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>시작일 *</label>
            <div className={dateTimePicker}>
              <input
                type="text"
                value={formatDateTime(formData.startDate)}
                readOnly
                className={dateTimePickerInput}
                placeholder="시작일을 선택하세요"
                required
              />
              <button
                type="button"
                className={dateTimePickerButton}
                onClick={() => setShowStartPicker(true)}
              >
                📅
              </button>
            </div>
            <CustomDateTimePicker
              isOpen={showStartPicker}
              onClose={() => setShowStartPicker(false)}
              value={formData.startDate}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, startDate: value }));
                setShowStartPicker(false);
              }}
              title="시작일 선택"
            />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>종료일 *</label>
            <div className={dateTimePicker}>
              <input
                type="text"
                value={formatDateTime(formData.endDate)}
                readOnly
                className={dateTimePickerInput}
                placeholder="종료일을 선택하세요"
                required
              />
              <button
                type="button"
                className={dateTimePickerButton}
                onClick={() => setShowEndPicker(true)}
              >
                📅
              </button>
            </div>
            <CustomDateTimePicker
              isOpen={showEndPicker}
              onClose={() => setShowEndPicker(false)}
              value={formData.endDate}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, endDate: value }));
                setShowEndPicker(false);
              }}
              title="종료일 선택"
            />
          </div>

          <div className={buttonGroup}>
            <Link href="/tournaments" className={cancelButton}>
              취소
            </Link>
            <button type="submit" className={submitButton} disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '토너먼트 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
