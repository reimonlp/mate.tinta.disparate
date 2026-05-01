import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { author, text } = data;

    if (!author || !text) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
    }

    const markdownContent = `---\nautor: ${author}\n---\n"${text}"`;
    const safeName = author.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 20);
    const timestamp = Date.now();
    const fileName = `${safeName}-${timestamp}.md`;
    
    const filePath = path.join(process.cwd(), 'src', 'content', 'comunidad', fileName);
    fs.writeFileSync(filePath, markdownContent, 'utf-8');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
