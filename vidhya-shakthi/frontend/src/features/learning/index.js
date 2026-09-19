/** Learning module — public exports */
export {
  GRADE10_SUBJECTS,
  GRADE10_LEARN_META,
  getChapter,
  getUnit,
  SUBJECT_MODULES,
} from './catalog/grade10Catalog.js';

export { LESSON_SLOTS, buildPlacementTree, placementLabel } from './catalog/placement.js';

export { default as LearnHubPage } from './pages/LearnHubPage.jsx';
export { default as LearnContentCMSPage } from './cms/LearnContentCMSPage.jsx';
