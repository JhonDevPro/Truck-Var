const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { gunzipSync } = require('node:zlib');

test('publicação web inclui modelos compactados e originais; shell Android não os inclui', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'truck-var-site-test-'));
    try {
        const put = (name, data = name) => {
            const file = path.join(root, name);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, data);
        };
        const script = path.join('.github', 'scripts', 'prepare-site.mjs');
        put(script, fs.readFileSync(path.join(__dirname, '..', script)));
        [
            'index.html', 'app.js', 'style.css', 'manifest.webmanifest', 'service-worker.js',
            'tractor_cab_burnout_3.glb', 'fortnite_semi_truck.glb',
            'semi_truck_burnout_revenge.glb', 'scania_S-730.glb', 'chassi-para-carreta-14-15.glb',
            'OBJ/semi.obj', 'cargas/01palette.glb', 'icons/icon.png', 'assets/iveco-logo.png'
        ].forEach(name => put(name));
        const vehicles = [
            ['Truck (2).glb', 'truck.glb.bin'], ['Toco (2).glb', 'toco.glb.bin'],
            ['F350-chevrolet.glb', 'vuc-chevrolet.glb.bin'], ['F350-honda_acty.glb', 'vuc-honda.glb.bin'],
            ['F350-mercedes-benz.glb', 'vuc-mercedes.glb.bin'], ['volkswagen_saveiro.glb', 'volkswagen-saveiro.glb.bin'],
            ['../motoristas/motorista.glb', 'motorista.glb.bin'], ['../motoristas/motorista-2.glb', 'motorista-2.glb.bin']
        ];
        vehicles.forEach(([source]) => put(path.join('caminhões', source)));
        const run = (...args) => execFileSync(process.execPath, [path.join(root, script), ...args], {
            env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
        });
        run();
        vehicles.forEach(([source, compressed]) => {
            const original = fs.readFileSync(path.join(root, 'caminhões', source));
            assert.deepEqual(fs.readFileSync(path.join(root, 'dist', 'caminhões', source)), original);
            assert.deepEqual(gunzipSync(fs.readFileSync(path.join(root, 'dist', 'modelos', compressed))), original);
        });
        assert.ok(fs.existsSync(path.join(root, 'dist', 'cargas', '01palette.glb')));
        assert.ok(fs.existsSync(path.join(root, 'dist', 'modelos', 'cargas', '01palette.glb.bin')));
        run('--android-shell');
        ['caminhões', 'modelos', 'cargas', 'motoristas'].forEach(name => {
            assert.equal(fs.existsSync(path.join(root, 'dist', name)), false);
        });
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
