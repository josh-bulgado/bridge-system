import z from "zod";

export const documentSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  requirements: z.array(z.string()),
  status: z.string(),
  processingTime: z.string(),
  totalRequests: z.number(),
  lastModified: z.string(),
});

export type Document = z.infer<typeof documentSchema>;
