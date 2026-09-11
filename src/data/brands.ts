import { Brand } from '../types';

export const brands: Brand[] = [
  { id: 'all', name: 'All', logo: null },
  { id: '1', name: 'Nike', logo: require('../../assets/logo-nike.svg') }, 
  { id: '2', name: 'Puma', logo: require('../../assets/logo-puma.svg') },
  { id: '3', name: 'Adidas', logo: require('../../assets/logo-adidas.svg') },
  { id: '4', name: 'Reebok', logo: require('../../assets/logo-reebok.svg') },
  { id: '5', name: 'New Balance', logo: require('../../assets/logo-new-balance.svg') }
];
