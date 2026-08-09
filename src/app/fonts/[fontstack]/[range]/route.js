import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const fontstack = decodeURIComponent(resolvedParams.fontstack || 'Open Sans Regular');
  const range = resolvedParams.range || '0-255.pbf';

  const fontPath = path.join(process.cwd(), 'public', 'fonts', fontstack, range);
  const fallbackPath = path.join(process.cwd(), 'public', 'fonts', 'Open Sans Regular', '0-255.pbf');

  if (fs.existsSync(fontPath)) {
    const fileBuffer = fs.readFileSync(fontPath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  // If specific range isn't on disk, return 0-255.pbf fallback instead of 404 to keep MapLibre rendering smoothly
  if (fs.existsSync(fallbackPath)) {
    const fallbackBuffer = fs.readFileSync(fallbackPath);
    return new Response(fallbackBuffer, {
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  return new Response(new Uint8Array(0), {
    headers: {
      'Content-Type': 'application/x-protobuf'
    }
  });
}
