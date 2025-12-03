import { useState } from 'react';
import { getBadges } from '../utils';

export function LeaderboardItem({ user, rank, totalUsers, onShowImage, onDoubleClick, showHistory = true }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const badge = getBadges(rank, totalUsers);
  const badgeEmoji = badge ? badge.split(' ')[0] : '';
  const badgeText = badge ? badge.substring(2) : '';

  return (
    <li
      className={`flex items-center bg-card-bg p-4 mb-2.5 rounded-lg transition-transform hover:scale-[1.01] border-l-[5px] border-transparent ${rank === 0 ? 'border-l-[#FFD700] bg-gradient-to-r from-[#2d2d2d] to-[#3a3a20]' :
          rank === 1 ? 'border-l-[#C0C0C0]' :
            rank === 2 ? 'border-l-[#CD7F32]' : ''
        }`}
      onDoubleClick={() => onDoubleClick?.(user.name, user.totalCalories)}
    >
      <div className="text-2xl font-bold w-10 text-center mr-4">#{rank + 1}</div>
      <div className="flex-grow">
        <div className="text-xl font-bold flex items-center gap-2">
          {user.name}
          {badge && <span className="text-xl" title={badge}>{badgeEmoji}</span>}
        </div>
        {badge && <div className="text-xs text-gray-400">{badgeText}</div>}

        {showHistory && user.logs && (
          <>
            <button
              className="bg-none border-none text-text-muted cursor-pointer text-sm p-1 underline hover:text-primary"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              View History ({user.logs.length})
            </button>
            <div className={`hidden mt-2.5 pt-2.5 border-t border-gray-700 w-full ${historyOpen ? '!block' : ''}`}>
              {user.logs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-gray-800">
                  <span>{log.date.split(',')[0]} - {log.calories} cal</span>
                  {log.proof && (
                    <img
                      src={log.proof}
                      className="w-10 h-10 object-cover rounded cursor-pointer border border-gray-600"
                      onClick={() => onShowImage(log.proof)}
                      title="View Proof"
                      alt="Proof"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!showHistory && user.entries !== undefined && (
          <div className="text-xs text-gray-400">{user.entries} entries</div>
        )}
      </div>
      <div className="text-xl text-accent font-bold">
        {user.totalCalories}
        <span className="text-sm text-text-muted font-normal"> kcal</span>
      </div>
    </li>
  );
}
