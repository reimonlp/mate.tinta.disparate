import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { commitAndPush } from '../../utils/git';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { base64Content, fileName } = data;

    if (!base64Content || !fileName) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
    }

    const buffer = Buffer.from(base64Content, 'base64');
    const publicPath = path.join(process.cwd(), 'public', 'photos', fileName);
    fs.writeFileSync(publicPath, buffer);

    const distPath = path.join(process.cwd(), 'dist', 'client', 'photos');
    if (fs.existsSync(distPath)) {
      fs.writeFileSync(path.join(distPath, fileName), buffer);
    }

    await commitAndPush(`Admin: Foto subida ${fileName}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { fileName } = data;

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'Falta el nombre del archivo' }), { status: 400 });
    }

    const publicPath = path.join(process.cwd(), 'public', 'photos', fileName);
    if (fs.existsSync(publicPath)) {
      fs.unlinkSync(publicPath);
    }

    const distPath = path.join(process.cwd(), 'dist', 'client', 'photos', fileName);
    if (fs.existsSync(distPath)) {
      fs.unlinkSync(distPath);
    }

    await commitAndPush(`Admin: Foto eliminada ${fileName}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
