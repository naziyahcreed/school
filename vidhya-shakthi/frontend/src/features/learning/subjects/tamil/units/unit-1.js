import { tamilChapters } from '../../../../../data/grade10/tamil.js';
import concepts from '../concepts/unit-1.js';

const base = tamilChapters.find((c) => c.unit === 1) ?? tamilChapters[0];
export default { ...base, concepts };
