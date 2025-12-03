import { useCountdown } from '../hooks';
import { formatDate } from '../utils';

export function Header({ theme, onToggleTheme }) {
  const countdown = useCountdown();
  const today = formatDate(new Date());

  return (
    <header className="text-center mb-8 animate-[fadeInDown_0.8s_ease-out]">
      <div className="flex justify-end">
        <button
          className="w-auto px-4 py-2 text-xl bg-transparent border border-text text-text rounded-full hover:bg-white/10 transition-colors"
          onClick={onToggleTheme}
        >
          <span>{theme === 'dark' ? '🌗' : '🌓'}</span>
        </button>
      </div>
      <h1 className="text-4xl mb-2.5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
        💪 Calorie Crusher
      </h1>
      <p className="text-text-muted italic">Friendly competition only—no shaming, just sweating (or napping)!</p>
      <p className="text-sm text-text-muted mt-2.5">📅 {today}</p>
      <p className="text-sm text-accent mt-1.5">
        ⏰ Time to Midnight: <span className="font-bold">{countdown}</span>
      </p>
      <p className="text-xs text-text-muted mt-1.5">Resets every Monday at 00:00</p>
    </header>
  );
}
