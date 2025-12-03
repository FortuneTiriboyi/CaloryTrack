import { useState, useEffect, useRef, useCallback } from 'react';
import { Header, EntryForm, Leaderboard, Tabs, ImageModal } from './components';
import { useTheme, useLeaderDuration } from './hooks';
import { fetchWeeklyData, fetchMonthlyData, fetchLifetimeData, resetData } from './api';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('weekly');
  const [weeklyData, setWeeklyData] = useState({ users: [], lastReset: Date.now() });
  const [monthlyData, setMonthlyData] = useState({ users: [], month: '' });
  const [lifetimeData, setLifetimeData] = useState({ users: [] });
  const [modalImage, setModalImage] = useState(null);
  const entryFormRef = useRef(null);

  const leaderInfo = useLeaderDuration(weeklyData.users);

  const loadAllData = useCallback(async () => {
    try {
      const [weekly, monthly, lifetime] = await Promise.all([
        fetchWeeklyData(),
        fetchMonthlyData(),
        fetchLifetimeData()
      ]);
      setWeeklyData(weekly);
      setMonthlyData(monthly);
      setLifetimeData(lifetime);

      // Check for weekly reset
      checkWeeklyReset(weekly.lastReset);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  const checkWeeklyReset = async (lastReset) => {
    const now = new Date();
    const lastResetDate = new Date(lastReset);

    // Get current Monday 00:00
    const currentMonday = new Date(now);
    const day = currentMonday.getDay();
    const diff = currentMonday.getDate() - day + (day === 0 ? -6 : 1);
    currentMonday.setDate(diff);
    currentMonday.setHours(0, 0, 0, 0);

    // If last reset was before this week's Monday, reset
    if (lastResetDate < currentMonday) {
      console.log("Weekly Reset Triggered!");
      try {
        const result = await resetData();
        setWeeklyData({ users: [], lastReset: result.lastReset });
        alert("It's a new week! Leaderboard has been reset. Good luck! 🚀");
      } catch (err) {
        console.error('Error resetting:', err);
      }
    }
  };

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleReset = async () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      try {
        await resetData();
        loadAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleItemDoubleClick = (name, calories) => {
    entryFormRef.current?.setFormValues(name, calories);
    entryFormRef.current?.scrollIntoView();
  };

  const renderLeaderStatus = () => {
    if (!leaderInfo.name) return null;
    return (
      <div className="text-center text-text-muted text-sm mb-2.5 italic">
        👑 <strong>{leaderInfo.name}</strong> has been leading for{' '}
        <strong className="text-accent">{leaderInfo.duration}</strong>
      </div>
    );
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-4xl mx-auto p-5">
        <EntryForm ref={entryFormRef} onSubmitSuccess={loadAllData} />

        <section>
          <h2 className="mb-4 text-accent flex justify-between items-center text-xl font-bold">
            Leaderboards
            <button className="w-auto text-xs px-2.5 py-1 bg-input-bg border border-input-border text-text rounded" onClick={handleReset}>
              Reset Demo
            </button>
          </h2>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className={`${activeTab === 'weekly' ? 'block' : 'hidden'}`}>
            <Leaderboard
              users={weeklyData.users}
              emptyMessage="No entries yet. Be the first! 🏋️"
              onShowImage={setModalImage}
              onItemDoubleClick={handleItemDoubleClick}
              showHistory={true}
              headerContent={renderLeaderStatus()}
            />
          </div>

          <div className={`${activeTab === 'monthly' ? 'block' : 'hidden'}`}>
            <Leaderboard
              users={monthlyData.users}
              emptyMessage="No entries this month yet. 📅"
              onShowImage={setModalImage}
              showHistory={false}
              headerContent={
                <p className="text-center text-text-muted text-sm mb-2.5 italic">{monthlyData.month}</p>
              }
            />
          </div>

          <div className={`${activeTab === 'lifetime' ? 'block' : 'hidden'}`}>
            <Leaderboard
              users={lifetimeData.users}
              emptyMessage="No lifetime data yet. 🏆"
              onShowImage={setModalImage}
              showHistory={false}
              headerContent={
                <p className="text-center text-text-muted text-sm mb-2.5 italic">All-time champions 🌟</p>
              }
            />
          </div>
        </section>
      </main>

      <ImageModal imageSrc={modalImage} onClose={() => setModalImage(null)} />
    </>
  );
}

export default App;
