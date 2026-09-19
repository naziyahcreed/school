import { socialScienceChapters } from '../../../../../data/grade10/socialScience.js';
import concepts from '../concepts/unit-1.js';

const base = socialScienceChapters.find((c) => c.unit === 1) ?? socialScienceChapters[0];
export default { ...base, concepts };
