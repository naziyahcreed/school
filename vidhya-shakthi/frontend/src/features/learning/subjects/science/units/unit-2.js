import { scienceChapters } from '../../../../../data/grade10/science.js';
import concepts from '../concepts/unit-2.js';

const base = scienceChapters.find((c) => c.unit === 2) ?? scienceChapters[1];
export default { ...base, concepts };
