import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  // Solo protegemos /admin y /api
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    const basicAuth = context.request.headers.get("authorization");

    if (basicAuth) {
      // Formato: Basic base64(user:pass)
      const authValue = basicAuth.split(" ")[1];
      if (authValue) {
        const decoded = Buffer.from(authValue, "base64").toString("utf-8");
        const [user, pass] = decoded.split(":");

        // Configurables por variables de entorno, default admin:disparate2026
        const adminUser = import.meta.env.ADMIN_USER || 'admin';
        const adminPass = import.meta.env.ADMIN_PASS || 'disparate2026';

        if (user === adminUser && pass === adminPass) {
          return next();
        }
      }
    }

    // Si falla o no hay header, pedimos autenticación
    return new Response("Acceso Denegado", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Panel"',
      },
    });
  }

  return next();
});
