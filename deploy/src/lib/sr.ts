export interface SRCard {
  ef: number;          // ease factor (min 1.3, starts 2.5)
  interval: number;    // days until next review
  repetitions: number;
  dueDate: string;     // YYYY-MM-DD
}

export const NEW_CARD: SRCard = {
  ef: 2.5,
  interval: 1,
  repetitions: 0,
  dueDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })(),
};

// quality: 1=forgot, 3=hard, 5=easy
export function sm2Update(card: SRCard, quality: number): SRCard {
  let { ef, interval, repetitions } = card;
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ef);
    repetitions += 1;
  }
  ef = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const due = new Date();
  due.setDate(due.getDate() + interval);
  return { ef, interval, repetitions, dueDate: due.toISOString().slice(0, 10) };
}

export function isDue(card: SRCard | undefined): boolean {
  if (!card) return true; // never reviewed → due now
  return card.dueDate <= new Date().toISOString().slice(0, 10);
}

export function daysUntilDue(card: SRCard): number {
  const today = new Date().toISOString().slice(0, 10);
  if (card.dueDate <= today) return 0;
  const diff = new Date(card.dueDate).getTime() - new Date(today).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
