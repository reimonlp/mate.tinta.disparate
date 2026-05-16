import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const signature = request.headers.get('x-hub-signature-256');
    const secret = import.meta.env.GITHUB_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return new Response(JSON.stringify({ error: 'Missing signature or secret' }), { status: 401 });
    }

    const payload = await request.text();
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    if (signature !== digest) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 403 });
    }

    // Trigger update by creating a trigger file that entrypoint.sh will watch
    const triggerPath = path.join(process.cwd(), '.git-update-trigger');
    fs.writeFileSync(triggerPath, Date.now().toString());

    return new Response(JSON.stringify({ success: true, message: 'Update triggered' }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
