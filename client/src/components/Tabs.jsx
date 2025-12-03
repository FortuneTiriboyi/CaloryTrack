export function Tabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'weekly', label: '📅 Weekly' },
    { id: 'monthly', label: '📆 Monthly' },
    { id: 'lifetime', label: '🏆 Lifetime' }
  ];

  return (
    <div className="flex gap-2.5 mb-5 border-b-2 border-input-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-5 py-2.5 bg-transparent border-none text-text-muted cursor-pointer text-base border-b-[3px] border-transparent transition-all hover:text-primary w-auto ${activeTab === tab.id ? 'text-accent border-b-accent font-bold' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
