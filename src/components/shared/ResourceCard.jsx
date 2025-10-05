import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Users } from "lucide-react";
import Link from "next/link";

export default function ResourceCard({ resource }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={resource.image}
          alt={resource.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 bg-green-600">
          {resource.type}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{resource.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Capacidad: {resource.capacity} personas
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {resource.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          <p className="text-2xl font-bold text-green-600">
            ${resource.pricePerHour}
          </p>
          <p className="text-xs text-gray-500">por hora</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href={`/reservar/${resource.id}`}>Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
