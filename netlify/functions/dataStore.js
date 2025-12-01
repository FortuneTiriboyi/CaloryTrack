// Shared data store for Netlify Functions
// WARNING: This is in-memory storage and will reset on cold starts
// For production, use Netlify Blobs, KV storage, or external database

class DataStore {
  constructor() {
    if (!global.caloryTrackData) {
      global.caloryTrackData = {
        logs: [],
        lifetimeStats: {},
        lastReset: Date.now()
      };
    }
    this.data = global.caloryTrackData;
  }

  getLogs() {
    return this.data.logs || [];
  }

  addLog(log) {
    if (!this.data.logs) this.data.logs = [];
    this.data.logs.push(log);
  }

  updateLog(index, log) {
    if (!this.data.logs) this.data.logs = [];
    this.data.logs[index] = log;
  }

  findLogIndex(name, dateStr) {
    if (!this.data.logs) return -1;
    return this.data.logs.findIndex(
      log => log.name === name && 
      new Date(log.date).toDateString() === new Date(dateStr).toDateString()
    );
  }

  getLifetimeStats() {
    return this.data.lifetimeStats || {};
  }

  updateLifetimeStats(name, calories, isNewEntry) {
    if (!this.data.lifetimeStats) this.data.lifetimeStats = {};
    
    if (!this.data.lifetimeStats[name]) {
      this.data.lifetimeStats[name] = {
        name: name,
        total_calories: 0,
        entries_count: 0
      };
    }

    this.data.lifetimeStats[name].total_calories += calories;
    if (isNewEntry) {
      this.data.lifetimeStats[name].entries_count += 1;
    }
  }

  getLastReset() {
    return this.data.lastReset || Date.now();
  }

  reset() {
    this.data.logs = [];
    this.data.lifetimeStats = {};
    this.data.lastReset = Date.now();
  }

  cleanupOldScreenshots() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    if (this.data.logs) {
      this.data.logs = this.data.logs.map(log => {
        if (log.timestamp < todayTimestamp && log.proof) {
          return { ...log, proof: null };
        }
        return log;
      });
    }
  }
}

module.exports = DataStore;
