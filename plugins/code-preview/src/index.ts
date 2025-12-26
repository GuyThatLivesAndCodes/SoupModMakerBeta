/**
 * Live Code Preview Plugin
 * Shows generated Java code in real-time as users make changes
 */

import { PluginMetadata } from '@soupmodmaker/core';
import { CodePreview } from './components/CodePreview';

export const metadata: PluginMetadata = {
  id: 'code-preview',
  name: 'Live Code Preview',
  version: '1.0.0',
  description: 'See generated Java code in real-time as you make changes',
  author: 'SoupModMaker Team',
  category: 'tools',
  enabled: true,
  installed: true,
};

export { CodePreview };

export default {
  metadata,
  components: {
    CodePreview,
  },
};
