import { tamilChapters } from '../../../../../data/grade10/tamil.js';
import concepts from '../concepts/unit-2.js';

const base = tamilChapters.find((c) => c.unit === 2) ?? tamilChapters[1];
export default { ...base, concepts };
