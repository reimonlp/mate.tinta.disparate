import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { generateMarkdown } from '../../utils/markdown';
import { commitAndPush } from '../../utils/git';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { autor, text } = data;

    if (!autor || !text) return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });

    const safeName = autor.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 20);
    const fileName = `${safeName}-${Date.now()}.md`;
    
    const content = generateMarkdown({ autor }, text);
    const filePath = path.join(process.cwd(), 'src', 'content', 'comunidad', fileName);
    fs.writeFileSync(filePath, content, 'utf-8');

    await commitAndPush(`Admin: Añadida reseña de ${autor}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, autor, text } = data;

    if (!id || !autor || !text) return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });

    const targetId = id.endsWith('.md') ? id : `${id}.md`;
    const filePath = path.join(process.cwd(), 'src', 'content', 'comunidad', targetId);
    if (!fs.existsSync(filePath)) return new Response(JSON.stringify({ error: 'Archivo no encontrado' }), { status: 404 });

    const content = generateMarkdown({ autor }, text);
    fs.writeFileSync(filePath, content, 'utf-8');

    await commitAndPush(`Admin: Editada reseña de ${autor}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) return new Response(JSON.stringify({ error: 'Falta el id' }), { status: 400 });

    const targetId = id.endsWith('.md') ? id : `${id}.md`;
    const filePath = path.join(process.cwd(), 'src', 'content', 'comunidad', targetId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await commitAndPush(`Admin: Eliminada reseña ${id}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
