import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'dist');
const androidShell = process.argv.includes('--android-shell');
const sharedFiles = [
    'index.html',
    'app.js',
    'style.css',
    'manifest.webmanifest',
    'service-worker.js',
];
const modelFiles = [
    'tractor_cab_burnout_3.glb',
    'fortnite_semi_truck.glb',
    'semi_truck_burnout_revenge.glb',
    'scania_S-730.glb',
    'chassi-para-carreta-14-15.glb'
];
const files = androidShell ? sharedFiles : [...sharedFiles, ...modelFiles];

await mkdir(output, { recursive: true });

for (const file of files) {
    await cp(resolve(root, file), resolve(output, file));
}

if (androidShell) {
    for (const file of [...modelFiles, 'scania_S-730.glb.gz', 'chassi-para-carreta-14-15.glb.gz']) {
        await rm(resolve(output, file), { force: true });
    }
    await rm(resolve(output, 'OBJ'), { recursive: true, force: true });
} else {
    const scaniaModel = await readFile(resolve(root, 'scania_S-730.glb'));
    await writeFile(
        resolve(output, 'scania_S-730.glb.gz'),
        gzipSync(scaniaModel, { level: 9 })
    );
    const trailerChassis = await readFile(resolve(root, 'chassi-para-carreta-14-15.glb'));
    await writeFile(
        resolve(output, 'chassi-para-carreta-14-15.glb.gz'),
        gzipSync(trailerChassis, { level: 9 })
    );
    await cp(resolve(root, 'OBJ'), resolve(output, 'OBJ'), { recursive: true });
}

await cp(resolve(root, 'icons'), resolve(output, 'icons'), { recursive: true });
