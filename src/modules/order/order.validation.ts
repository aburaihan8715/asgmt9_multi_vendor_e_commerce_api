import { z } from 'zod';

const createValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Order is required' }),
  }),
});

const updateValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Order is required' }).optional(),
  }),
});

const createPaymentIntentValidation = z.object({
  body: z.object({
    price: z.number({ required_error: 'Price is required' }),
  }),
});

export const OrderValidation = {
  createValidationSchema,
  updateValidationSchema,
  createPaymentIntentValidation,
};
