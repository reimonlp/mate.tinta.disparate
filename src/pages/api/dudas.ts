import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { generateMarkdown } from '../../utils/markdown';
import { commitAndPush } from '../../utils/git';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { pregunta, orden, text } = data;

    if (!pregunta || !text) return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });

    const safeName = pregunta.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 20);
    const fileName = `${safeName}-${Date.now()}.md`;
    
    const content = generateMarkdown({ pregunta, orden: Number(orden) || 0 }, text);
    const filePath = path.join(process.cwd(), 'src', 'content', 'dudas', fileName);
    fs.writeFileSync(filePath, content, 'utf-8');

    await commitAndPush(`Admin: Añadida duda "${pregunta.substring(0, 20)}"`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, pregunta, orden, text } = data;

    if (!id || !pregunta || !text) return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });

    const targetId = id.endsWith('.md') ? id : `${id}.md`;
    const filePath = path.join(process.cwd(), 'src', 'content', 'dudas', targetId);
    if (!fs.existsSync(filePath)) return new Response(JSON.stringify({ error: 'Archivo no encontrado' }), { status: 404 });

    const content = generateMarkdown({ pregunta, orden: Number(orden) || 0 }, text);
    fs.writeFileSync(filePath, content, 'utf-8');

    await commitAndPush(`Admin: Editada duda "${pregunta.substring(0, 20)}"`);

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
    const filePath = path.join(process.cwd(), 'src', 'content', 'dudas', targetId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await commitAndPush(`Admin: Eliminada duda ${id}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
