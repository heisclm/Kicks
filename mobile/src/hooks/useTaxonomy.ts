import { useQuery } from '@tanstack/react-query';
import { taxonomyService } from '../services/TaxonomyService';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => taxonomyService.getBrands(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => taxonomyService.getCategories(),
  });
}
