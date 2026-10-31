// Grammar curriculum index.
import a1 from './grammar-a1.js';
import a2 from './grammar-a2.js';
import b1 from './grammar-b1.js';
import b2 from './grammar-b2.js';
import c1 from './grammar-c1.js';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const TOPICS = [...a1, ...a2, ...b1, ...b2, ...c1];
const BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
export const topic = (id) => BY_ID.get(id);
export const topicsByLevel = (lvl) => TOPICS.filter((t) => t.level === lvl);
