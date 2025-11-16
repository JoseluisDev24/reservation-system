import { z } from "zod";

export const canchaSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar 50 caracteres")
    .trim(),

  type: z.enum(
    [
      "Fútbol 5",
      "Fútbol 7",
      "Fútbol 11",
      "Tenis",
      "Paddle",
      "Básquet",
      "Vóley",
    ],
    {
      errorMap: () => ({ message: "Tipo de cancha inválido" }),
    }
  ),

  capacity: z
    .number({
      required_error: "La capacidad es requerida",
      invalid_type_error: "La capacidad debe ser un número",
    })
    .int("La capacidad debe ser un número entero")
    .min(2, "La capacidad mínima es 2 personas")
    .max(50, "La capacidad máxima es 50 personas"),

  pricePerHour: z
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .min(0, "El precio no puede ser negativo")
    .max(100000, "El precio no puede superar $100,000"),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar 500 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),

  amenities: z.array(z.string()).optional().default([]),

  image: z.string().optional().or(z.literal("")),

  available: z.boolean().default(true),

  // NUEVO - Validaciones para schedule
  schedule: z
    .object({
      openTime: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Formato de hora inválido (HH:MM)"
        )
        .default("08:00"),
      closeTime: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Formato de hora inválido (HH:MM)"
        )
        .default("23:00"),
      slotDuration: z
        .number()
        .int()
        .min(15, "Duración mínima: 15 minutos")
        .max(240, "Duración máxima: 4 horas")
        .default(60),
      availableDays: z
        .array(z.number().min(0).max(6))
        .min(1, "Debe seleccionar al menos un día")
        .default([1, 2, 3, 4, 5, 6]),
      blockedSlots: z
        .array(
          z.object({
            day: z.number().min(0).max(6),
            time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          })
        )
        .optional()
        .default([]),
    })
    .optional()
    .default({
      openTime: "08:00",
      closeTime: "23:00",
      slotDuration: 60,
      availableDays: [1, 2, 3, 4, 5, 6],
      blockedSlots: [],
    }),
});

export const createCanchaSchema = canchaSchema;

export const updateCanchaSchema = canchaSchema.partial();

export const ownerSchema = z.object({
  owner: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido"),
});
