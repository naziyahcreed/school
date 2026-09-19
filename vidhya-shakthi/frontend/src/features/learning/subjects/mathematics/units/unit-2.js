import { mathematicsChapters } from '../../../../../data/grade10/mathematics.js';
import mathUnit2Concepts from '../concepts/unit-2.js';

const base = mathematicsChapters.find((c) => c.unit === 2) ?? mathematicsChapters[1];
export default { ...base, concepts: mathUnit2Concepts };
