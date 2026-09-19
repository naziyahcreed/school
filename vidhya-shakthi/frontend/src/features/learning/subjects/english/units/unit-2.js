import { englishChapters } from '../../../../../data/grade10/english.js';
import concepts from '../concepts/unit-2.js';

const base = englishChapters.find((c) => c.unit === 2) ?? englishChapters[1];
export default { ...base, concepts };
