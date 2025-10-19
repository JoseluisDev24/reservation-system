import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    // 🔵 Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // 🔑 Credentials Provider (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        // Buscar usuario por email (incluir password con +password)
        const user = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Verificar que el usuario use credenciales (no Google)
        if (user.provider !== "credentials") {
          throw new Error("Please use Google to sign in");
        }

        // Comparar password
        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Retornar datos del usuario (sin password)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  // ⚙️ Configuración de sesiones (JWT por defecto)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // 📄 Páginas personalizadas
  pages: {
    signIn: "/login",
    error: "/login", // Redirigir errores al login
  },

  // 🔐 Callbacks para manejar sesiones y JWT
  callbacks: {
    // Callback cuando se crea el JWT
    async jwt({ token, user, account }) {
      // Si es login inicial, agregar info del usuario al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider || "credentials";
      }
      return token;
    },

    // Callback cuando se accede a la sesión
    async session({ session, token }) {
      // Agregar info del token a la sesión
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },

    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");

      if (isAdminRoute) {
        if (!auth) return false; // Sin sesión → redirige a login
        return auth.user?.role === "admin"; // Solo admins
      }

      return true; // Otras rutas OK
    },

    // Callback cuando se hace sign in (login)
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Buscar o crear usuario de Google
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // Actualizar info si cambió
            existingUser.name = user.name || existingUser.name;
            existingUser.image = user.image || existingUser.image;
            await existingUser.save();

            // Agregar role al objeto user para el callback jwt
            user.role = existingUser.role;
            user.id = existingUser._id.toString();
          } else {
            // Crear nuevo usuario
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              providerId: account.providerAccountId,
              role: "user", // Default role
            });

            user.role = newUser.role;
            user.id = newUser._id.toString();
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      // Para credentials, ya se manejó en authorize()
      return true;
    },
  },

  // 🐛 Debug en desarrollo
  debug: process.env.NODE_ENV === "development",
});
