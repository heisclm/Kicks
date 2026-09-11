import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Nike Unveil Joyride',
    subtitle: "Men's running shoe",
    price: 180,
    image: require('../../assets/shoe-unveil.png'),
    thumbnails: [
      require('../../assets/shoe-unveil.png'),
      require('../../assets/shoe-air-zoom.png'),
      require('../../assets/shoe-air-max.png'),
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    availableSizes: [39, 40, 42, 43], // 38, 41, 44, 45 out of stock
    description: 'When users select an item, they are taken to a sleek cart interface where they can review their chosen products, view detailed descriptions, and check size, color... Learn more',
    brand: 'Nike',
    color: '#E04A3A',
    gender: "Men's",
    availableColors: ['#E04A3A', '#2C2C2C', '#F4F4F4'],
    category: 'Running',
    isTrending: true,
    discount: 10,
    rating: 4.8,
    reviewCount: 124,
    stockStatus: 'In Stock'
  },
  {
    id: '2',
    name: 'Nike Air Zoom',
    subtitle: "Women's running shoe",
    price: 210,
    image: require('../../assets/shoe-air-zoom.png'),
    thumbnails: [
      require('../../assets/shoe-air-zoom.png'),
    ],
    sizes: [38, 39, 40, 41, 42],
    availableSizes: [38, 39, 40, 41, 42],
    description: 'Built for speed and comfort, the Nike Air Zoom delivers responsive cushioning for your daily run.',
    brand: 'Nike',
    color: '#7AC06D',
    gender: "Women's",
    availableColors: ['#7AC06D', '#4A90E2', '#000000'],
    category: 'Running',
    isNew: true,
    discount: 25,
    rating: 4.5,
    reviewCount: 89,
    stockStatus: 'In Stock'
  },
  {
    id: '3',
    name: 'Nike Air Max',
    subtitle: "Unisex training shoe",
    price: 299,
    image: require('../../assets/shoe-air-max.png'),
    thumbnails: [
      require('../../assets/shoe-air-max.png'),
    ],
    sizes: [40, 41, 42, 43, 44],
    availableSizes: [42],
    description: 'The iconic Air Max continues to deliver legendary cushioning and support for intense training sessions.',
    brand: 'Nike',
    color: '#E36940',
    gender: "Unisex",
    availableColors: ['#E36940', '#E5E5E5'],
    category: 'Training',
    isOnSale: true,
    discount: 15,
    rating: 4.9,
    reviewCount: 342,
    stockStatus: 'Low Stock'
  }
];
