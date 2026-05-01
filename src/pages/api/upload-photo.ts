import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { base64Content, fileName } = data;

    if (!base64Content || !fileName) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
    }

    const buffer = Buffer.from(base64Content, 'base64');
    
    // Guardar tanto en public/photos (código fuente) como en dist/client/photos (si existe para SSR)
    const publicPath = path.join(process.cwd(), 'public', 'photos', fileName);
    fs.writeFileSync(publicPath, buffer);

    const distPath = path.join(process.cwd(), 'dist', 'client', 'photos');
    if (fs.existsSync(distPath)) {
      fs.writeFileSync(path.join(distPath, fileName), buffer);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
