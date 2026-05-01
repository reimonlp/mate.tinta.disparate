import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function commitAndPush(message: string): Promise<void> {
  // Solo ejecutamos esto si estamos en un entorno donde .git existe
  const isProd = process.env.NODE_ENV === 'production' || process.env.GIT_SYNC_ENABLED === 'true';
  
  if (!isProd) {
    console.log(`[Git Sync Disabled] MOCK: git commit -m "${message}"`);
    return;
  }

  try {
    const cwd = process.cwd();
    
    // Agregamos todos los cambios (especialmente en src/content y public/photos)
    await execAsync('git add src/content/ public/photos/ dist/client/photos/ || true', { cwd });
    
    // Hacemos el commit (ignoramos error si no hay cambios)
    try {
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    } catch (commitErr: any) {
      if (commitErr.stdout && commitErr.stdout.includes('nothing to commit')) {
        console.log('[Git Sync] No hay cambios para commitear.');
        return;
      }
      throw commitErr;
    }
    
    // Hacemos push al main (asegúrate de que el contenedor o server tenga credenciales)
    await execAsync('git push origin main', { cwd });
    
    console.log(`[Git Sync] Éxito: ${message}`);
  } catch (error) {
    console.error('[Git Sync Error]', error);
    // No lanzamos el error para no romper la respuesta del servidor al cliente,
    // pero queda registrado en los logs.
  }
}
