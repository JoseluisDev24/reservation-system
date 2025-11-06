// scripts/migrate-data.js
// Script de migración para:
// 1. Asignar owner a canchas sin owner
// 2. Limpiar reservas viejas
// 3. Crear reservas de prueba con userId

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

// Configuración
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "test";

async function migrate() {
  console.log("🚀 Iniciando migración...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db(DB_NAME);
    const usersCol = db.collection("users");
    const resourcesCol = db.collection("resources");
    const reservationsCol = db.collection("reservations");

    // ========================================
    // PASO 1: Obtener admin(s)
    // ========================================
    console.log("📋 PASO 1: Obteniendo admins...");
    const admins = await usersCol.find({ role: "admin" }).toArray();

    if (admins.length === 0) {
      console.error(
        "❌ Error: No se encontró ningún admin en la base de datos"
      );
      return;
    }

    console.log(
      `   ✅ Encontrado${admins.length > 1 ? "s" : ""} ${admins.length} admin${
        admins.length > 1 ? "s" : ""
      }:`
    );
    admins.forEach((admin, i) => {
      console.log(`      ${i + 1}. ${admin.name} (${admin.email})`);
    });
    console.log();

    // ========================================
    // PASO 2: Asignar owner a canchas sin owner
    // ========================================
    console.log("🏟️  PASO 2: Asignando owner a canchas...");

    const canchasSinOwner = await resourcesCol
      .find({
        owner: { $exists: false },
      })
      .toArray();

    console.log(`   📊 Canchas sin owner: ${canchasSinOwner.length}`);

    if (canchasSinOwner.length > 0) {
      for (let i = 0; i < canchasSinOwner.length; i++) {
        const cancha = canchasSinOwner[i];
        const ownerIndex = i % admins.length;
        const owner = admins[ownerIndex]._id;

        await resourcesCol.updateOne(
          { _id: cancha._id },
          { $set: { owner: owner } }
        );

        console.log(`   ✅ "${cancha.name}" → ${admins[ownerIndex].name}`);
      }
    } else {
      console.log("   ℹ️  Todas las canchas ya tienen owner");
    }
    console.log();

    // ========================================
    // PASO 3: Mostrar distribución de canchas
    // ========================================
    console.log("📊 Distribución de canchas por admin:");
    for (const admin of admins) {
      const canchasAdmin = await resourcesCol.countDocuments({
        owner: admin._id,
      });
      console.log(`   ${admin.name}: ${canchasAdmin} canchas`);
    }
    console.log();

    // ========================================
    // PASO 4: Limpiar reservas viejas
    // ========================================
    console.log("🗑️  PASO 3: Limpiando reservas viejas...");
    const deleteResult = await reservationsCol.deleteMany({});
    console.log(
      `   ✅ Eliminadas ${deleteResult.deletedCount} reservas viejas\n`
    );

    // ========================================
    // PASO 5: Crear reservas de prueba
    // ========================================
    console.log("📝 PASO 4: Creando reservas de prueba...");

    // Obtener o crear un user normal para las reservas
    let user = await usersCol.findOne({ role: "user" });

    if (!user) {
      console.log("   ℹ️  No se encontró un usuario normal. Creando uno...");
      const newUserResult = await usersCol.insertOne({
        name: "Usuario de Prueba",
        email: "test@example.com",
        role: "user",
        provider: "credentials",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await usersCol.findOne({ _id: newUserResult.insertedId });
      console.log(`   ✅ Usuario creado: ${user.name}`);
    }

    const userId = user._id;

    // Obtener todas las canchas disponibles
    const todasLasCanchas = await resourcesCol.find({}).toArray();

    if (todasLasCanchas.length === 0) {
      console.error("❌ No hay canchas disponibles para crear reservas");
      return;
    }

    console.log(`   📊 Canchas disponibles: ${todasLasCanchas.length}`);

    // Crear reservas distribuidas en los próximos 14 días
    const reservaciones = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Función para generar código de confirmación único
    function generateConfirmationCode() {
      return `RES-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
    }

    // Crear 10 reservas
    for (let i = 0; i < 10; i++) {
      const cancha = todasLasCanchas[i % todasLasCanchas.length];
      const diasAdelante = Math.floor(i / 2); // 2 reservas por día
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + diasAdelante);

      // Horas variadas
      const horas = ["09:00", "11:00", "14:00", "16:00", "18:00", "20:00"];
      const horaInicio = horas[i % horas.length];
      const horaFin = `${parseInt(horaInicio) + 2}:${horaInicio.split(":")[1]}`;

      const reserva = {
        userId: userId, // ⭐ ID del usuario
        resourceId: cancha._id,
        date: fecha,
        startTime: horaInicio,
        endTime: horaFin,
        userName: user.name, // ⭐ AGREGADO
        userEmail: user.email, // ⭐ AGREGADO
        userPhone: "+59899123456",
        guests: 1,
        notes: `Reserva de prueba #${i + 1}`,
        status: "confirmed",
        confirmationCode: generateConfirmationCode(),
        totalPrice: (cancha.pricePerHour || 1000) * 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      reservaciones.push(reserva);
    }

    const insertResult = await reservationsCol.insertMany(reservaciones);
    console.log(
      `   ✅ Creadas ${insertResult.insertedCount} reservas de prueba`
    );

    // Mostrar algunas reservas de ejemplo
    console.log("\n   📅 Ejemplos de reservas creadas:");
    for (let i = 0; i < Math.min(3, reservaciones.length); i++) {
      const r = reservaciones[i];
      const cancha = todasLasCanchas.find((c) => c._id.equals(r.resourceId));
      const fechaStr = r.date.toLocaleDateString("es-UY");
      console.log(
        `      • ${fechaStr} ${r.startTime}-${r.endTime} en "${cancha.name}"`
      );
    }
    console.log();

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log("📊 RESUMEN FINAL:");
    console.log("=====================================");
    console.log(`✅ Admins encontrados: ${admins.length}`);
    console.log(`✅ Canchas actualizadas: ${canchasSinOwner.length}`);
    console.log(`✅ Total de canchas: ${todasLasCanchas.length}`);
    console.log(`✅ Reservas eliminadas: ${deleteResult.deletedCount}`);
    console.log(`✅ Reservas creadas: ${insertResult.insertedCount}`);
    console.log("=====================================\n");

    console.log("🎉 Migración completada exitosamente!\n");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  } finally {
    await client.close();
    console.log("👋 Conexión cerrada");
  }
}

// Ejecutar
migrate();
