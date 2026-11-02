import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

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
    'chassi-para-carreta-14-15.glb'
];

await mkdir(output, { recursive: true });
await rm(resolve(output, 'scania_S-730.glb'), { force: true });

for (const file of files) {
    await cp(resolve(root, file), resolve(output, file));
}

const scaniaModel = await readFile(resolve(root, 'scania_S-730.glb'));
await writeFile(
    resolve(output, 'scania_S-730.glb.gz'),
    gzipSync(scaniaModel, { level: 9 })
);

await cp(resolve(root, 'OBJ'), resolve(output, 'OBJ'), { recursive: true });
await cp(resolve(root, 'icons'), resolve(output, 'icons'), { recursive: true });
