import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'dist');
const files = [
    'index.html',
    'app.js',
    'style.css',
    'manifest.webmanifest',
    'service-worker.js',
    'tractor_cab_burnout_3.glb',
    'fortnite_semi_truck.glb',
    'semi_truck_burnout_revenge.glb',
    'scania_S-730.glb',
    'chassi-para-carreta-14-15.glb'
];

await mkdir(output, { recursive: true });

for (const file of files) {
    await cp(resolve(root, file), resolve(output, file));
}

await cp(resolve(root, 'OBJ'), resolve(output, 'OBJ'), { recursive: true });
await cp(resolve(root, 'icons'), resolve(output, 'icons'), { recursive: true });
