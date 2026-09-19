import { mathematicsChapters } from '../../../../../data/grade10/mathematics.js';
import mathUnit1Concepts from '../concepts/unit-1.js';

const base = mathematicsChapters.find((c) => c.unit === 1) ?? mathematicsChapters[0];
export default { ...base, concepts: mathUnit1Concepts };
