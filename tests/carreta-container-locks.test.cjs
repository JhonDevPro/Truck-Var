const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
function section(start, end) {
    const from = source.indexOf(start);
    const to = source.indexOf(end, from);
    assert.ok(from >= 0 && to > from, `Seção não encontrada: ${start}`);
    return source.slice(from, to);
}

const containerTypes = new Set([
    'container_10',
    'container_20',
    'container_dry_20',
    'container_40',
    'container_baby',
    'container_mae'
]);
const generalCargoByType = new Map([
    ['glb:container-10-PES.glb', { file: 'container-10-PES.glb' }],
    ['glb:20-BLACK-shipping_container.glb', { file: '20-BLACK-shipping_container.glb' }]
]);
const context = vm.createContext({
    CONTAINER_LOAD_TYPES: containerTypes,
    generalCargoByType,
    isContainerLoad: type => containerTypes.has(type) || /container/i.test(generalCargoByType.get(type)?.file || ''),
    isLockedLoad: type => containerTypes.has(type) || type === 'cesta_metalica' || type === 'cesta',
    requiresLoadLockClearance: type => containerTypes.has(type) || type === 'cesta_metalica' || type === 'cesta',
    getLoadStartClearance: type => containerTypes.has(type) || type === 'cesta_metalica' || type === 'cesta' ? 1.4 : 0.2,
    getLoadGap: () => 0.02,
    usesSideGates: () => false,
    getLoadAreaCenterX: () => 0,
    getOrientedCargoDimensions: carga => ({ comp: carga.comp, larg: carga.larg }),
    inputs: { posicao: { value: 'mesa' } },
    composicaoCargas: [],
    cargasTransbordo: []
});

vm.runInContext(
    section('const CARRETA_CONTAINER_LOCK_LAYOUT =', 'function getPranchaLoadStart(') +
    section('function getGridMetrics(', 'function getStackCount(') +
    section('function getStackCount(', 'function applyStackingPositions(') +
    section('function applyStackingPositions(', 'function getTubeMetrics(') +
    section('function positionLoadAllocations(', 'function getLoadSequenceMetrics('),
    context
);

const trailer = (length = 14) => ({ tipo: 'carreta', mesa: length, w: 2.5, cap: 25, eixos: 3 });
const cargo = (type, comp, qtd = 1) => ({
    type, comp, larg: 2.4, alt: 2.4, peso: 2.5, qtd, camadas: 1
});
function position(tr, loads) {
    context.composicaoCargas = loads;
    return context.positionLoadAllocations(tr, true, loads.map(load => load.qtd));
}

test('carretas de 14 e 15 m têm o padrão de locks 1-2-2-2-1 por lado', () => {
    for (const length of [14, 15]) {
        const offsets = context.getCarretaContainerLockOffsets(trailer(length), true);
        assert.equal(offsets.length, 8);
        const expected = [1.48, 4.37, 4.53, 7.42, 7.58, 10.47, 10.63, 13.52];
        offsets.forEach((offset, index) => {
            assert.ok(Math.abs(offset - expected[index]) < 1e-9);
        });
    }
});

test('pranchas e carretas fora de 14/15 m mantêm os pinos existentes', () => {
    assert.deepEqual(Array.from(context.getCarretaContainerLockOffsets(trailer(14), false)), []);
    assert.deepEqual(Array.from(context.getCarretaContainerLockOffsets(trailer(13), true)), []);
});

test('quatro containers de 10 pés ocupam os quatro intervalos de locks', () => {
    const result = position(trailer(), [cargo('container_10', 3.05, 4)]);
    const load = result.loads[0];
    assert.equal(load.startOffset, 1.4);
    assert.equal(load.grid.rows, 4);
    assert.equal(load.grid.gap, 0);
    assert.ok(Math.abs(result.mesaComp - 13.6) < 1e-9);
});

test('dois containers de 20 pés e a combinação de 10 + 20 pés seguem os locks', () => {
    const twoTwenties = position(trailer(), [cargo('container_dry_20', 5.896, 2)]).loads[0];
    assert.ok(Math.abs(twoTwenties.startOffset - 1.4 - twoTwenties.grid.gap / 2) < 1e-9);
    assert.ok(Math.abs(twoTwenties.grid.gap + twoTwenties.carga.comp - 6.1) < 1e-9);

    const forty = position(trailer(), [cargo('container_40', 12.043)]).loads[0];
    assert.equal(forty.grid.lockSlotCount, 4);
    assert.ok(Math.abs(forty.startOffset + forty.grid.totalComp - 13.6) < 1e-9);

    const mixed = position(trailer(), [
        cargo('container_10', 3.05, 2),
        cargo('container_dry_20', 5.896)
    ]).loads;
    assert.equal(mixed[0].startOffset, 1.4);
    assert.ok(Math.abs(mixed[1].startOffset - 7.602) < 1e-9);
});

test('cestas metálicas só se ajustam quando medem 10, 20 ou 40 pés', () => {
    const getSlots = context.getCarretaContainerLockSlotCount;
    assert.equal(getSlots(cargo('cesta_metalica', 3.05), trailer(), true), 1);
    assert.equal(getSlots(cargo('cesta_metalica', 6.1), trailer(), true), 2);
    assert.equal(getSlots(cargo('cesta_metalica', 12.2), trailer(), true), 4);
    assert.equal(getSlots(cargo('cesta_metalica', 4), trailer(), true), 0);
    assert.equal(getSlots(cargo('container_baby', 2.5), trailer(), true), 0);
    assert.equal(getSlots(cargo('glb:container-10-PES.glb', 2.831), trailer(), true), 1);
    assert.equal(getSlots(cargo('glb:20-BLACK-shipping_container.glb', 5.896), trailer(), true), 2);
});
