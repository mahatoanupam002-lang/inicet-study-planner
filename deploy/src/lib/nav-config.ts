import type { ComponentType } from "react";

import {
  Calendar, Clock, Zap, BookOpen, Crosshair, Layers, FlaskConical, Flag,
  CalendarCheck, Sliders, Calculator, Eye, StickyNote, FileText, Brain,
  BarChart2, BookMarked, Pill, XCircle, Award, ExternalLink, MessageSquare,
  LayoutGrid, TrendingUp, Stethoscope, ScrollText, Trophy, Home, GraduationCap,
  Sparkles, Bot, Timer, Sun, Users, UserCheck, Heart, Radio, ClipboardList,
} from "lucide-react";

export type MainTab =
  | 'planner' | 'schedule' | 'circadian' | 'stress'
  | 'pyq' | 'drills' | 'rapid' | 'oneliners' | 'simulation' | 'revision'
  | 'dailyquiz' | 'aiquiz' | 'custommock' | 'psmcalc' | 'imagequiz' | 'microburst' | 'neetpg2026'
  | 'notes' | 'pdf' | 'ai' | 'mnemonics' | 'analysis' | 'flashcards'
  | 'doctable' | 'revschedule' | 'mistakelogbook' | 'aichat'
  | 'analytics' | 'toppers' | 'resources' | 'community' | 'weakheatmap'
  | 'cutoffhistory' | 'specialtyseats' | 'guidelines'
  | 'topicpredict' | 'studyrooms' | 'buddymatch'
  | 'rewards';

export type NavGroup = 'home' | 'practice' | 'learn' | 'insights' | 'rewards';

export interface NavTab {
  id: MainTab;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export interface NavGroupConfig {
  id: NavGroup;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  tabs: NavTab[];
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    id: 'home',
    label: 'Home',
    Icon: Home,
    tabs: [
      { id: 'planner',   label: 'Planner',   Icon: Calendar },
      { id: 'schedule',  label: 'Schedule',  Icon: Clock    },
      { id: 'circadian', label: 'Circadian', Icon: Sun      },
      { id: 'stress',    label: 'Wellbeing', Icon: Heart    },
    ],
  },
  {
    id: 'practice',
    label: 'Practice',
    Icon: Zap,
    tabs: [
      { id: 'pyq',        label: 'PYQ',        Icon: BookOpen     },
      { id: 'drills',     label: 'Drills',     Icon: Crosshair    },
      { id: 'rapid',      label: 'Rapid',      Icon: Timer        },
      { id: 'oneliners',  label: 'One-liners', Icon: Layers       },
      { id: 'simulation', label: 'Simulate',   Icon: FlaskConical },
      { id: 'revision',   label: 'Revision',   Icon: Flag         },
      { id: 'dailyquiz',  label: 'Daily Quiz', Icon: CalendarCheck},
      { id: 'aiquiz',     label: 'AI Quiz',    Icon: Sparkles     },
      { id: 'custommock', label: 'Custom Mock',Icon: Sliders      },
      { id: 'psmcalc',    label: 'PSM Calc',   Icon: Calculator   },
      { id: 'imagequiz',  label: 'Image Bank', Icon: Eye          },
      { id: 'microburst',  label: 'Micro Burst', Icon: Radio          },
      { id: 'neetpg2026', label: 'NEET PG 2026', Icon: ClipboardList  },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    Icon: GraduationCap,
    tabs: [
      { id: 'notes',          label: 'Notes',      Icon: StickyNote   },
      { id: 'pdf',            label: 'PDF',        Icon: FileText     },
      { id: 'ai',             label: 'HY Ref',     Icon: BookOpen     },
      { id: 'mnemonics',      label: 'Mnemonics',  Icon: Brain        },
      { id: 'analysis',       label: 'Analysis',   Icon: BarChart2    },
      { id: 'flashcards',     label: 'Flashcards', Icon: BookMarked   },
      { id: 'doctable',       label: 'DOC Table',  Icon: Pill         },
      { id: 'revschedule',    label: 'Rev Sched',  Icon: CalendarCheck},
      { id: 'mistakelogbook', label: 'Logbook',    Icon: XCircle      },
      { id: 'aichat',         label: 'AI Chat',    Icon: Bot          },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    Icon: BarChart2,
    tabs: [
      { id: 'analytics',      label: 'Analytics',  Icon: BarChart2    },
      { id: 'toppers',        label: 'Toppers',    Icon: Award        },
      { id: 'resources',      label: 'Resources',  Icon: ExternalLink },
      { id: 'community',      label: 'Community',  Icon: MessageSquare},
      { id: 'weakheatmap',    label: 'Weak Areas', Icon: LayoutGrid   },
      { id: 'cutoffhistory',  label: 'Cutoffs',    Icon: TrendingUp   },
      { id: 'specialtyseats', label: 'Specialties',Icon: Stethoscope  },
      { id: 'guidelines',     label: 'Guidelines',  Icon: ScrollText   },
      { id: 'topicpredict',   label: 'Predict',     Icon: TrendingUp   },
      { id: 'studyrooms',     label: 'Study Rooms', Icon: Users        },
      { id: 'buddymatch',     label: 'Buddy Match', Icon: UserCheck    },
    ],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    Icon: Trophy,
    tabs: [
      { id: 'rewards', label: 'Rewards', Icon: Trophy },
    ],
  },
];
