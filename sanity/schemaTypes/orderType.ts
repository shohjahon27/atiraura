// sanity/schemaTypes/orderType.ts
import { defineType, defineField } from 'sanity';
import { BasketIcon } from '@sanity/icons';

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'text' }),
      ],
    }),
    defineField({
      name: 'payment',
      title: 'Payment',
      type: 'object',
      fields: [
        defineField({
          name: 'method',
          title: 'Method',
          type: 'string',
          options: {
            list: [
              { title: 'Click.uz', value: 'click' },
              { title: 'Cash', value: 'cash' },
            ],
          },
        }),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          initialValue: 'pending',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Paid', value: 'paid' },
              { title: 'Failed', value: 'failed' },
            ],
          },
        }),
        defineField({ name: 'clickPrepareId', title: 'Click Prepare ID', type: 'number' }),
        defineField({ name: 'clickTransId', title: 'Click Trans ID', type: 'string' }),
        defineField({ name: 'clickConfirmId', title: 'Click Confirm ID', type: 'number' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          title: 'Order Item',
          fields: [
            defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'price', title: 'Price', type: 'number' }),
            defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'product.image', // ← Product image
              price: 'price',
              quantity: 'quantity',
            },
            prepare({ title, media, price, quantity }) {
              return {
                title: title || 'No name',
                subtitle: `${quantity || 1} × ${price || 0} UZS`,
                media: media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'UZS',
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
      },
      initialValue: 'processing',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      customerName: 'customer.name',
      total: 'total',
      paymentStatus: 'payment.status',
      firstItemImage: 'items.0.product.image',
    },
    prepare({ title, customerName, total, paymentStatus, firstItemImage }) {
      return {
        title: `Order #${title || 'Unknown'}`,
        subtitle: `${customerName || 'No customer'} • ${total || 0} UZS • ${paymentStatus || 'Pending'}`,
        media: firstItemImage || BasketIcon, // Show first product image or fallback icon
      };
    },
  },
});