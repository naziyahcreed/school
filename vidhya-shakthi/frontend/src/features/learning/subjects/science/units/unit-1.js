import { scienceChapters } from '../../../../../data/grade10/science.js';
import concepts from '../concepts/unit-1.js';

const base = scienceChapters.find((c) => c.unit === 1) ?? scienceChapters[0];
export default { ...base, concepts };
