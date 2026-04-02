import { notFound } from 'next/navigation';
import { features, type FeatureKey } from './features';

/**
 * Call at the top of a page component to gate it behind a feature flag.
 * If the feature is disabled, renders a 404.
 */
export function requireFeature(key: FeatureKey): void {
  if (!features[key]) {
    notFound();
  }
}
