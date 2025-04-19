// import { BasketIcon } from "@sanity/icons";
// import { defineArrayMember, defineField, defineType } from "sanity";

import { defineType } from "sanity";


export const orderType = defineType ({
        name: 'order',
        title: 'Order',
        type: 'document',
        fields: [
          {
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
          },
          {
            name: 'stripeCheckoutSessionId',
            title: 'Stripe Checkout Session ID',
            type: 'string',
          },
          {
            name: 'stripePaymentIntentId',
            title: 'Stripe Payment Intent ID',
            type: 'string',
          },
          {
            name: 'stripeCustomerId',
            title: 'Stripe Customer ID',
            type: 'string',
          },
          {
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
          },
          {
            name: 'email',
            title: 'Customer Email',
            type: 'string',
          },
          {
            name: 'clerkUserId',
            title: 'Clerk User ID',
            type: 'string',
          },
          {
            name: 'currency',
            title: 'Currency',
            type: 'string',
          },
          {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
          },
          {
            name: 'amountDiscount',
            title: 'Amount Discount',
            type: 'number',
          },
          {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
              list: [
                { title: 'Paid', value: 'paid' },
                { title: 'Pending', value: 'pending' },
                { title: 'Failed', value: 'failed' },
              ],
            },
          },
          {
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
          },
          {
            name: 'sanityProducts',
            title: 'Sanity Products',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  {
                    name: 'product',
                    title: 'Product',
                    type: 'reference',
                    to: [{ type: 'product' }],
                  },
                  {
                    name: 'quantity',
                    title: 'Quantity',
                    type: 'number',
                  },
                ],
              },
            ],
          },
        ],
      
        preview: {
          select: {
            imageUrl: 'image',
            orderNumber: 'orderNumber',
            customerName: 'customerName',
            totalPrice: 'totalPrice',
            currency: 'currency',
          },
          prepare({ orderNumber, customerName, totalPrice, currency }) {
            return {
              title: `Order #${orderNumber}`,
              subtitle: `${customerName} - ${totalPrice} ${currency}`,
            };
          },
        }, 
    }); 
export default orderType;