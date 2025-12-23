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
              { title: 'Stripe', value: 'stripe' },
              { title: 'Cash', value: 'cash' },
            ],
          },
        }),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Paid', value: 'paid' },
              { title: 'Failed', value: 'failed' },
            ],
          },
          initialValue: 'pending',
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
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] }),
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'price', title: 'Price', type: 'number' }),
          defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
        ],
      }],
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
      customer: 'customer.name',
      total: 'total',
      status: 'payment.status',
    },
    prepare({ title, customer, total, status }) {
      return {
        title: `Order #${title}`,
        subtitle: `${customer} • ${total?.toLocaleString()} UZS • ${status}`,
        media: BasketIcon,
      };
    },
    
  },
});