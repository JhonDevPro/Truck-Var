const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('const lashingEquipment =');
const end = source.indexOf('function lashingFromForm()', start);
assert.ok(start >= 0 && end > start, 'Motor de amarração não encontrado');
const context = vm.createContext({ document: { getElementById: () => ({}) } });
vm.runInContext(source.slice(start, end), context);
const { defaultLashing, lashingEstimate, validLashing, unsupportedLashingLoad } = vm.runInContext(
    '({ defaultLashing, lashingEstimate, validLashing, unsupportedLashingLoad })', context
);

test('estima o deslizamento frontal para madeira e borracha', () => {
    const plan = defaultLashing();
    assert.equal(lashingEstimate({ peso: 10, larg: 2 }, plan).recommended, 47);
    assert.equal(lashingEstimate({ peso: 10, larg: 2 }, {
        ...plan, surface: 'rubber', stf: 600, alpha: 80
    }).recommended, 7);
});

test('não estima quantidade para amarração direta nem crédito para calço sem capacidade', () => {
    const plan = defaultLashing();
    const direct = lashingEstimate({ peso: 12, larg: 2 }, { ...plan, method: 'direct' });
    assert.equal(direct.recommended, null);
    assert.equal(direct.directions[0].restraint, null);
    const unverified = lashingEstimate({ peso: 10, larg: 2 }, {
        ...plan, front: true, frontCapacity: null
    });
    assert.equal(unverified.directions[0].block, 0);
    assert.equal(unverified.recommended, 47);
});

test('apresenta momentos somente com centro de gravidade informado', () => {
    const plan = defaultLashing();
    const cargo = { peso: 8, larg: 1.2 };
    assert.equal(lashingEstimate(cargo, plan).tipping, null);
    const { tipping } = lashingEstimate(cargo, { ...plan, cg: 1.8 });
    assert.ok(Math.abs(tipping.overturning - 9323.424) < 0.001);
    assert.ok(Math.abs(tipping.stabilizing - 4708.8) < 0.001);
});

test('rejeita parâmetros de amarração inválidos', () => {
    const plan = defaultLashing();
    assert.equal(validLashing(plan), true);
    assert.equal(validLashing({ ...plan, stf: 0 }), false);
    assert.equal(validLashing({ ...plan, alpha: 0 }), false);
    assert.equal(validLashing({ ...plan, count: 1.5 }), false);
    assert.equal(validLashing({ ...plan, frontCapacity: -1 }), false);
    assert.equal(validLashing({ ...plan, stf: null }), false);
    assert.equal(validLashing({ ...plan, method: 'direct', stf: null }), true);
});

test('não oferece estimativa para empilhamento ou conjunto de bobinas', () => {
    assert.equal(unsupportedLashingLoad({ qtd: 2, camadas: 2 }), true);
    assert.equal(unsupportedLashingLoad({ qtd: 1, camadas: 1, colocarSobreAnterior: true }), true);
    assert.equal(unsupportedLashingLoad({ type: 'bobina_lado_2', qtd: 1, camadas: 1 }), true);
    assert.equal(unsupportedLashingLoad({ qtd: 2, camadas: 1 }), false);
});
