import subjectConfig from './subject.config.js';
import unit1 from './units/unit-1.js';
import unit2 from './units/unit-2.js';

export const chapters = [unit1, unit2];
export { subjectConfig };
export default { subjectConfig, chapters, units: { 1: unit1, 2: unit2 } };
