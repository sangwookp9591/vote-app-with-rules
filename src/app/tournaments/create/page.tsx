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
  formSelect,
  formDateInput,
  submitButton,
  cancelButton,
  buttonGroup,
} from './create.css';

export default function CreateTournamentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameType: 'LoL',
    startDate: '',
    endDate: '',
  });

  const gameTypes = [
    { value: 'LoL', label: 'League of Legends' },
    { value: 'PUBG', label: 'PUBG' },
    { value: 'Overwatch', label: 'Overwatch' },
    { value: 'Valorant', label: 'Valorant' },
    { value: 'CS2', label: 'Counter-Strike 2' },
    { value: 'Dota2', label: 'Dota 2' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
            <label htmlFor="gameType" className={formLabel}>
              게임 종류 *
            </label>
            <select
              id="gameType"
              name="gameType"
              value={formData.gameType}
              onChange={handleInputChange}
              className={formSelect}
              required
            >
              {gameTypes.map((game) => (
                <option key={game.value} value={game.value}>
                  {game.label}
                </option>
              ))}
            </select>
          </div>

          <div className={formGroup}>
            <label htmlFor="startDate" className={formLabel}>
              시작일 *
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={formDateInput}
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="endDate" className={formLabel}>
              종료일 *
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={formDateInput}
              required
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
