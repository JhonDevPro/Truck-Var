import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
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
// Caminhões: o site publicado usa as versões .gz.
const vehicleModels = [
    ['caminhões/Truck (2).glb', 'modelos/truck.glb.gz'],
    ['caminhões/Toco (2).glb', 'modelos/toco.glb.gz'],
    ['caminhões/F350-chevrolet.glb', 'modelos/vuc-chevrolet.glb.gz'],
    ['caminhões/F350-honda_acty.glb', 'modelos/vuc-honda.glb.gz'],
    ['caminhões/F350-mercedes-benz.glb', 'modelos/vuc-mercedes.glb.gz'],
    ['caminhões/saveiro.glb', 'modelos/saveiro.glb.gz'],
    ['motoristas/motorista.glb', 'modelos/motorista.glb.gz'],
    ['motoristas/motorista-2.glb', 'modelos/motorista-2.glb.gz']
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
    await rm(resolve(output, 'modelos'), { recursive: true, force: true });
    await rm(resolve(output, 'cargas'), { recursive: true, force: true });
    await rm(resolve(output, 'caminhões'), { recursive: true, force: true });
    await rm(resolve(output, 'motoristas'), { recursive: true, force: true });
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
    await cp(resolve(root, 'cargas'), resolve(output, 'cargas'), { recursive: true });
    await mkdir(resolve(output, 'modelos'), { recursive: true });
    await mkdir(resolve(output, 'caminhões'), { recursive: true });
    await mkdir(resolve(output, 'motoristas'), { recursive: true });
    for (const [source, target] of vehicleModels) {
        const model = await readFile(resolve(root, source));
        await writeFile(resolve(output, target), gzipSync(model, { level: 9 }));
        await cp(resolve(root, source), resolve(output, source));
    }
    const cargoOutput = resolve(output, 'modelos/cargas');
    await mkdir(cargoOutput, { recursive: true });
    const cargoFiles = await readdir(resolve(root, 'cargas'), { withFileTypes: true });
    for (const file of cargoFiles.filter(entry => entry.isFile() && /\.glb$/i.test(entry.name))) {
        const model = await readFile(resolve(root, 'cargas', file.name));
        await writeFile(resolve(cargoOutput, `${file.name}.gz`), gzipSync(model, { level: 9 }));
    }
}

await cp(resolve(root, 'icons'), resolve(output, 'icons'), { recursive: true });
await mkdir(resolve(output, 'assets'), { recursive: true });
await cp(resolve(root, 'assets/iveco-logo.png'), resolve(output, 'assets/iveco-logo.png'));
