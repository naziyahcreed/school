import { socialScienceChapters } from '../../../../../data/grade10/socialScience.js';
import concepts from '../concepts/unit-2.js';

const base = socialScienceChapters.find((c) => c.unit === 2) ?? socialScienceChapters[1];
export default { ...base, concepts };
