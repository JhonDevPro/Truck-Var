const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class Matrix4 {
    constructor(y = 0) { this.y = y; }
    multiplyMatrices(a, b) { this.y = a.y + b.y; return this; }
}

class Box3 {
    constructor(min = Infinity, max = -Infinity) { this.min = min; this.max = max; }
    copy(box) { this.min = box.min; this.max = box.max; return this; }
    applyMatrix4(matrix) { this.min += matrix.y; this.max += matrix.y; return this; }
    union(box) { this.min = Math.min(this.min, box.min); this.max = Math.max(this.max, box.max); return this; }
}

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('function getTransportBounds(root)');
const end = source.indexOf('function separateFortniteWheels', start);
assert.ok(start >= 0 && end > start, 'Cálculo dos limites de transporte não encontrado');
const context = vm.createContext({ THREE: { Box3, Matrix4 } });
vm.runInContext(source.slice(start, end), context);
const wheelRotationStart = source.indexOf('function applyTransportWheelRotation');
const wheelRotationEnd = source.indexOf('function animateFleetYard', wheelRotationStart);
assert.ok(wheelRotationStart >= 0 && wheelRotationEnd > wheelRotationStart, 'Rotação das rodas não encontrada');
vm.runInContext(source.slice(wheelRotationStart, wheelRotationEnd), context);
const getTransportBounds = vm.runInContext('getTransportBounds', context);
const applyTransportWheelRotation = vm.runInContext('applyTransportWheelRotation', context);

test('limites incluem as posições das instâncias, não a geometria-base na origem', () => {
    const vehicle = { geometry: { boundingBox: new Box3(0, 3) }, matrixWorld: new Matrix4() };
    const pipes = {
        geometry: { boundingBox: new Box3(-6.5, 6.5) },
        matrixWorld: new Matrix4(2),
        isInstancedMesh: true,
        count: 2,
        getMatrixAt(index, matrix) { matrix.y = [10, 12][index]; }
    };
    const root = {
        updateMatrixWorld() {},
        traverse(callback) { [vehicle, pipes].forEach(callback); }
    };
    const bounds = getTransportBounds(root);
    assert.equal(bounds.min, 0);
    assert.equal(bounds.max, 20.5);
});

test('rodas giram para frente no sentido de deslocamento em ambos os tipos de eixo', () => {
    const angle = 8 / 0.5;
    const ordinaryWheel = { radius: 0.5, group: { rotation: { x: 0 } } };
    applyTransportWheelRotation(ordinaryWheel, 8);
    assert.equal(ordinaryWheel.group.rotation.x, angle);

    const axisWheel = {
        radius: 0.5,
        axis: { x: 1, y: 0, z: 0 },
        group: { quaternion: { setFromAxisAngle(axis, value) { this.axis = axis; this.angle = value; } } }
    };
    applyTransportWheelRotation(axisWheel, 8);
    assert.equal(axisWheel.group.quaternion.angle, angle);
});
