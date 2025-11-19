"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { canchaSchema } from "@/lib/validations/cancha.schema";
import Image from "next/image";
import { Save, X, Loader2, CheckCircle } from "lucide-react";
import ScheduleConfig from "@/components/admin/ScheduleConfig";
import toast from "react-hot-toast";

export default function CanchaForm({
  mode = "create",
  initialData = null,
  canchaId = null,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [selectedAmenities, setSelectedAmenities] = useState(
    initialData?.amenities || []
  );

  const [schedule, setSchedule] = useState(
    initialData?.schedule || {
      openTime: "08:00",
      closeTime: "23:00",
      slotDuration: 60,
      availableDays: [1, 2, 3, 4, 5, 6],
      blockedSlots: [],
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(canchaSchema),
    defaultValues: initialData || {
      name: "",
      type: "Fútbol 5",
      capacity: 10,
      pricePerHour: 800,
      description: "",
      available: true,
      image: "",
      schedule: {
        openTime: "08:00",
        closeTime: "23:00",
        slotDuration: 60,
        availableDays: [1, 2, 3, 4, 5, 6],
        blockedSlots: [],
      },
    },
  });

  const amenitiesOptions = [
    "Vestuarios",
    "Duchas",
    "Iluminación",
    "Estacionamiento",
    "Parrillero",
    "Techada",
    "Aire acondicionado",
    "Cantina",
  ];

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor seleccioná un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = {
        name: data.name,
        type: data.type,
        capacity: Number(data.capacity),
        pricePerHour: Number(data.pricePerHour),
        description: data.description,
        amenities: selectedAmenities,
        available: data.available,
        schedule: schedule, 
      };

      const imageInput = document.getElementById("image");
      const imageFile = imageInput?.files[0];

      if (imageFile) {
        const imageBase64 = await convertToBase64(imageFile);
        formData.imageFile = imageBase64;
      } else if (mode === "create") {
        toast.error("Por favor seleccioná una imagen");
        setIsLoading(false);
        return;
      }

      const url =
        mode === "create" ? "/api/canchas" : `/api/canchas/${canchaId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const loadingToast = toast.loading(
        mode === "create" ? "Creando cancha..." : "Actualizando cancha..."
      );

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      toast.dismiss(loadingToast);


      if (result.success) {
        toast.success(
          result.message ||
            `Cancha ${
              mode === "create" ? "creada" : "actualizada"
            } exitosamente`
        );
        
        router.push("/admin/canchas");
        router.refresh();
      } else {
        if (result.details && Array.isArray(result.details)) {
          const errorMessages = result.details
            .map((detail) => `${detail.field}: ${detail.message}`)
            .join("\n");
          toast.error(`Errores de validación:\n${errorMessages}`);
        } else {
          toast.error(result.error || "Error al guardar la cancha");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión al guardar la cancha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Nombre de la cancha *
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Cancha de Fútbol 5 Principal"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Tipo de cancha *
        </label>
        <select
          id="type"
          {...register("type")}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="Fútbol 5">Fútbol 5</option>
          <option value="Fútbol 7">Fútbol 7</option>
          <option value="Fútbol 11">Fútbol 11</option>
          <option value="Paddle">Paddle</option>
          <option value="Tenis">Tenis</option>
          <option value="Básquet">Básquet</option>
          <option value="Vóley">Vóley</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Capacidad *
          </label>
          <input
            id="capacity"
            type="number"
            min="1"
            {...register("capacity", { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="10"
          />
          <p className="mt-1 text-xs text-gray-400">Cantidad de personas</p>
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-500">
              {errors.capacity.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="pricePerHour"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Precio por hora *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              id="pricePerHour"
              type="number"
              min="0"
              step="50"
              {...register("pricePerHour", { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="800"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              UYU
            </span>
          </div>
          {errors.pricePerHour && (
            <p className="mt-1 text-sm text-red-500">
              {errors.pricePerHour.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="description"
          rows="4"
          {...register("description")}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Describe las características de la cancha..."
        />
        <p className="mt-1 text-xs text-gray-400">
          Opcional: Agrega detalles sobre la cancha
        </p>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Imagen de la cancha {mode === "create" && "*"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-white file:cursor-pointer hover:file:bg-green-600"
        />
        <p className="mt-1 text-xs text-gray-400">
          Formatos: JPG, PNG, WEBP (máx. 5MB)
        </p>

        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Servicios disponibles
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <ScheduleConfig schedule={schedule} onChange={handleScheduleChange} />

      {mode === "edit" && (
        <div className="flex items-center space-x-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <input
            id="available"
            type="checkbox"
            {...register("available")}
            className="w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
          />
          <label
            htmlFor="available"
            className="text-sm font-medium text-gray-300"
          >
            Cancha disponible para reservas
          </label>
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <X className="h-5 w-5" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : mode === "create" ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Crear Cancha
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
