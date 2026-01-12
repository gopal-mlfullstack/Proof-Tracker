"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trophy,
  Zap,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Info,
  X,
  Lightbulb,
  Brain,
  Heart,
  CheckCircle2,
} from "lucide-react";

interface Tracker {
  id: string;
  title: string;
  startTime: number;
  achieved: string[];
}

export default function ProofTracker() {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [customStart, setCustomStart] = useState<string>("");
  const [tick, setTick] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const milestones = [
    {
      threshold: 60 * 60,
      message: "1 hour completed. Proof of initial control.",
      icon: "🎯",
    },
    {
      threshold: 6 * 60 * 60,
      message: "6 hours. Steady progress.",
      icon: "⚡",
    },
    {
      threshold: 12 * 60 * 60,
      message: "12 hours. Half a day strong.",
      icon: "💪",
    },
    { threshold: 24 * 60 * 60, message: "1 day. Foundation set.", icon: "🏆" },
    {
      threshold: 3 * 24 * 60 * 60,
      message: "3 days. Momentum building.",
      icon: "🔥",
    },
    {
      threshold: 7 * 24 * 60 * 60,
      message: "7 days. Discipline forming.",
      icon: "💎",
    },
    {
      threshold: 14 * 24 * 60 * 60,
      message: "14 days. Habit shifting.",
      icon: "🌟",
    },
    {
      threshold: 21 * 24 * 60 * 60,
      message: "21 days. Resilience proven.",
      icon: "👑",
    },
    {
      threshold: 30 * 24 * 60 * 60,
      message: "30 days. Milestone achieved.",
      icon: "🏅",
    },
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("proof-trackers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTrackers(parsed);
      } catch (e) {
        console.error("Failed to parse saved trackers:", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (trackers.length > 0) {
        localStorage.setItem("proof-trackers", JSON.stringify(trackers));
      } else {
        localStorage.removeItem("proof-trackers");
      }
    } catch (e) {
      console.error("Failed to save trackers:", e);
    }
  }, [trackers]);

  // Live update every second
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const computeElapsed = (
    startTime: number,
  ): {
    display: string;
    parts: { days: number; hours: number; minutes: number; seconds: number };
  } => {
    const now = Date.now();
    if (startTime > now)
      return {
        display: "00d 00h 00m 00s",
        parts: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      };

    const totalSeconds = Math.floor((now - startTime) / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      display: `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`,
      parts: { days, hours, minutes, seconds },
    };
  };

  const getTotalSeconds = (startTime: number): number => {
    const now = Date.now();
    if (startTime > now) return 0;
    return Math.floor((now - startTime) / 1000);
  };

  useEffect(() => {
    setTrackers((prev) =>
      prev.map((tracker) => {
        const total = getTotalSeconds(tracker.startTime);
        const newAchieved = [...tracker.achieved];
        let changed = false;

        milestones.forEach((m) => {
          if (total >= m.threshold && !newAchieved.includes(m.message)) {
            newAchieved.push(m.message);
            changed = true;
          }
        });

        return changed ? { ...tracker, achieved: newAchieved } : tracker;
      }),
    );
  }, [tick]);

  const addTracker = (startTime: number) => {
    if (!newTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    const tracker: Tracker = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      startTime,
      achieved: [],
    };
    setTrackers([...trackers, tracker]);
    setNewTitle("");
    setCustomStart("");
  };

  const handleStartNow = () => addTracker(Date.now());
  const handleCustomStart = () => {
    if (!customStart) return alert("Please select date & time");
    const time = new Date(customStart).getTime();
    if (isNaN(time)) return alert("Invalid date");
    if (time > Date.now()) return alert("Future dates not allowed");
    addTracker(time);
  };

  const handleReset = (id: string) => {
    if (
      confirm(
        "Are you sure you want to reset this tracker? This cannot be undone.",
      )
    ) {
      setTrackers(trackers.filter((t) => t.id !== id));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getProgressPercentage = (achieved: number, total: number): number => {
    return Math.min((achieved / total) * 100, 100);
  };

  // Get max date for datetime-local (current date/time)
  const getMaxDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
                Proof Tracker
              </h1>
              <Zap className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400 animate-pulse" />
            </div>
            <p className="mt-3 text-lg sm:text-xl text-gray-300 font-medium">
              Track your discipline. Build your legacy. Prove yourself daily.
            </p>

            {/* Guide Button */}
            <button
              onClick={() => setShowGuide(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              <Info className="w-5 h-5" />
              How This Works
            </button>
          </div>

          {/* User Guide Modal */}
          {showGuide && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/30">
                <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    How Proof Tracker Works
                  </h2>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* The Science Section */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-8 h-8 text-blue-400" />
                      <h3 className="text-2xl font-bold text-white">
                        The Science Behind It
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      Your brain creates new neural pathways through repetition.
                      Every hour, every day you track builds stronger discipline
                      circuits in your brain. This isn't just motivation—it's
                      neuroscience.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      The visible timer creates accountability. Watching time
                      pass makes your commitment real and tangible, turning
                      abstract goals into concrete proof of your willpower.
                    </p>
                  </div>

                  {/* How to Use Section */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-8 h-8 text-yellow-400" />
                      <h3 className="text-2xl font-bold text-white">
                        How to Use
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold">
                            1. Create Your Proof
                          </p>
                          <p className="text-gray-400 text-sm">
                            Name your commitment (NoFap, Quit Smoking, Early
                            Wake-up, etc.)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold">
                            2. Start Now or Set Past Date
                          </p>
                          <p className="text-gray-400 text-sm">
                            Click "Start Now" to begin immediately, or use the
                            datetime picker to set when you actually started
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold">
                            3. Watch Your Progress
                          </p>
                          <p className="text-gray-400 text-sm">
                            Live timer updates every second. Earn milestone
                            badges as you progress through hours and days
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-white font-semibold">
                            4. Never Break the Chain
                          </p>
                          <p className="text-gray-400 text-sm">
                            The longer you go, the more you'll hate to reset.
                            That's the power of visual commitment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Milestone System */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-8 h-8 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">
                        Milestone System
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {milestones.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50"
                        >
                          <span className="text-2xl">{m.icon}</span>
                          <div>
                            <p className="text-white text-sm font-semibold">
                              {m.threshold >= 86400
                                ? `${m.threshold / 86400} day${m.threshold > 86400 ? "s" : ""}`
                                : `${m.threshold / 3600} hour${m.threshold > 3600 ? "s" : ""}`}
                            </p>
                            <p className="text-gray-400 text-xs">{m.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why This Works Section */}
                  <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-2xl p-6 border border-red-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-8 h-8 text-red-400" />
                      <h3 className="text-2xl font-bold text-white">
                        Why This Works
                      </h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          <strong>Visual Accountability:</strong> You see
                          exactly how long you've been disciplined
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          <strong>Loss Aversion:</strong> The bigger the number,
                          the harder it is to reset to zero
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          <strong>Gamification:</strong> Milestones make
                          progress feel rewarding and achievable
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          <strong>Identity Shift:</strong> Watching days stack
                          up transforms how you see yourself
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Pro Tips */}
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-8 h-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">
                        Pro Tips
                      </h3>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex gap-2">
                        <span className="text-green-400">→</span>
                        <span>
                          Check your tracker every morning to reinforce
                          commitment
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-400">→</span>
                        <span>Screenshot milestones to track your journey</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-400">→</span>
                        <span>
                          Track multiple habits to build a complete discipline
                          system
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-400">→</span>
                        <span>
                          If you relapse, reset immediately and start again—no
                          shame, just truth
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add new tracker card */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Create New Proof
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NoFap, Quit Smoking, Early Wake-up..."
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 bg-slate-900/50 border-2 border-slate-700 rounded-2xl text-lg sm:text-xl font-semibold text-white
                             focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                             transition-all duration-300 placeholder:text-gray-500 placeholder:font-medium"
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleStartNow}
                    className="flex-1 py-4 sm:py-5 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg sm:text-xl font-bold
                               rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-400
                               transform transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Start Now
                  </button>

                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="datetime-local"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        max={getMaxDateTime()}
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-slate-900/50 border-2 border-slate-700 rounded-2xl text-base sm:text-lg text-white
                                   focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20
                                   transition-all duration-300 [color-scheme:dark]"
                      />
                    </div>
                    <button
                      onClick={handleCustomStart}
                      className="py-4 sm:py-5 px-6 sm:px-8 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-lg sm:text-xl font-bold
                                 rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-purple-500 hover:to-purple-400
                                 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 sm:w-auto w-full"
                    >
                      <Calendar className="w-5 h-5" />
                      Set Past Date
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trackers grid */}
          {trackers.length === 0 ? (
            <div className="text-center py-16 sm:py-24 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50">
              <Target className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-xl sm:text-2xl font-medium text-gray-400">
                No proofs yet. Start building your discipline above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {trackers.map((tracker) => {
                const elapsed = computeElapsed(tracker.startTime);
                const recent =
                  tracker.achieved[tracker.achieved.length - 1] || null;
                const isExpanded = expandedId === tracker.id;
                const progress = getProgressPercentage(
                  tracker.achieved.length,
                  milestones.length,
                );
                const recentMilestone = milestones.find(
                  (m) => m.message === recent,
                );

                return (
                  <div
                    key={tracker.id}
                    className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-blue-500/20
                               border border-slate-700/50 hover:border-blue-500/50 flex flex-col overflow-hidden
                               transition-all duration-500 hover:scale-[1.02] relative group"
                  >
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="p-5 sm:p-6 pb-4 flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight break-words">
                          {tracker.title}
                        </h3>
                        <Award className="w-6 h-6 text-yellow-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Timer display with individual boxes */}
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-4 mb-5">
                        {[
                          { label: "DAYS", value: elapsed.parts.days },
                          { label: "HRS", value: elapsed.parts.hours },
                          { label: "MIN", value: elapsed.parts.minutes },
                          { label: "SEC", value: elapsed.parts.seconds },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/80 rounded-xl p-2 sm:p-3 text-center border border-slate-700/50"
                          >
                            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400">
                              {item.value.toString().padStart(2, "0")}
                            </div>
                            <div className="text-[10px] sm:text-xs font-bold text-gray-500 mt-1">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Achievement badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-400">
                          {tracker.achieved.length} / {milestones.length}{" "}
                          Milestones
                        </div>
                        <div className="text-sm font-bold text-blue-400">
                          {Math.round(progress)}%
                        </div>
                      </div>

                      {recent && (
                        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-4 mb-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                          <div className="relative z-10 flex items-start gap-3">
                            <span className="text-2xl sm:text-3xl flex-shrink-0">
                              {recentMilestone?.icon}
                            </span>
                            <p className="text-white text-sm sm:text-base font-semibold leading-snug">
                              {recent}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
                      {tracker.achieved.length > 1 && (
                        <button
                          onClick={() => toggleExpand(tracker.id)}
                          className="w-full py-3 sm:py-4 px-5 sm:px-6 bg-slate-700/50 hover:bg-slate-700 text-white text-sm sm:text-base font-bold rounded-xl
                                     transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600/50"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          {isExpanded
                            ? "Hide Milestones"
                            : "View All Milestones"}
                        </button>
                      )}

                      {isExpanded && (
                        <div className="max-h-52 overflow-y-auto pr-2 space-y-2 text-sm">
                          {tracker.achieved.map((msg, i) => {
                            const milestone = milestones.find(
                              (m) => m.message === msg,
                            );
                            return (
                              <div
                                key={i}
                                className="bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-700/50 text-gray-300 font-medium flex items-start gap-2 sm:gap-3"
                              >
                                <span className="text-lg sm:text-xl flex-shrink-0">
                                  {milestone?.icon}
                                </span>
                                <span className="text-xs sm:text-sm">
                                  {msg}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => handleReset(tracker.id)}
                        className="w-full py-3 sm:py-4 px-5 sm:px-6 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm sm:text-base font-bold rounded-xl
                                   transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reset Proof
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer / Copyright */}
          <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Made with 💪 by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
                Gopal
              </span>
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              © {new Date().getFullYear()} Proof Tracker. Build discipline, one
              second at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
