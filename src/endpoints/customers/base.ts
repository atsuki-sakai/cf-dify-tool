import { z } from "zod";

export const customer = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const customerInsert = customer.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const CustomerModel = {
  tableName: "customers",
  primaryKeys: ["id"],
  schema: customer,
  serializer: (obj: object): object => {
    const record = obj as Record<string, unknown>;
    return {
      ...record,
    };
  },
  serializerSchema: customer,
};