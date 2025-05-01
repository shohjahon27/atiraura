import { defineType } from "sanity";
import {StarIcon} from '@sanity/icons'

export const reviewType = defineType  ({
    name: 'review',
  title: 'Review',
  type: 'document',
    icon: StarIcon,
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'rating', type: 'number', title: 'Rating' },
    { name: 'comment', type: 'text', title: 'Comment' },
    { name: 'productId', type: 'string', title: 'Product ID' },
    { name: 'userId', type: 'string', title: 'User ID' }, // 🔐 important
    { name: 'createdAt', type: 'datetime', title: 'Created At', initialValue: () => new Date().toISOString() },
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
  ],
});

export default reviewType;

  