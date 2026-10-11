import type { Category, Provider } from '../types';
export type LegacyProvider = Omit<Provider, 'categoryIds' | 'offeredServices'> & Partial<Pick<Provider, 'categoryIds' | 'offeredServices'>> & { services?: string[] };

// Split previously mixed category labels and concrete services without erasing saved profiles.
export function migrateProvider(provider: LegacyProvider, categories: Category[]): Provider {
  const { services = [], ...profile } = provider;
  const categoryIds = provider.categoryIds ?? categories.filter(c => c.name === provider.specialty || services.includes(c.name)).map(c => c.id);
  const primaryCategory = categories.find(c => c.name === provider.specialty)?.id || categoryIds[0] || '';
  const offeredServices = provider.offeredServices ?? services.filter(name => !categories.some(c => c.name === name)).map((name, index) => ({
    id: `${provider.id}-offering-${index}`, categoryId: primaryCategory, name, description: `Servicio de ${name.toLocaleLowerCase()}.`,
  })).filter(service => Boolean(service.categoryId));
  return { ...profile, categoryIds, offeredServices };
}
