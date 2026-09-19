import { englishChapters } from '../../../../../data/grade10/english.js';
import concepts from '../concepts/unit-1.js';

const base = englishChapters.find((c) => c.unit === 1) ?? englishChapters[0];
export default { ...base, concepts };
