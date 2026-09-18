import { BrandRepository } from '../../../../features/brands/brand-repository';
import { CategoryRepository } from '../../../../features/categories/category-repository';
import { ProductForm } from './ProductForm';

export default async function AddProductPage() {
  const brands = await BrandRepository.getBrands();
  const categories = await CategoryRepository.getCategories();

  return <ProductForm brands={brands} categories={categories} />;
}
