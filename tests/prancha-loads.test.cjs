const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
function section(start, end) {
    const from = source.indexOf(start);
    const to = source.indexOf(end, from);
    assert.ok(from >= 0 && to > from);
    return source.slice(from, to);
}
const context = vm.createContext({
    inputs: { posicao: { value: 'mesa' } },
    composicaoCargas: [],
    cargasTransbordo: [],
    getLoadGap: () => 0.02,
    usesSideGates: () => false,
    getLoadAreaCenterX: () => 0,
    getLoadStartClearance: () => 0.2,
    requiresLoadLockClearance: () => false
});
vm.runInContext(
    section('function getPranchaLoadStart', 'const inputs =') +
    section('function getCarretaAxleLayout', 'function getTubeMetrics') +
    section('function positionLoadAllocations', 'const lashingEquipment ='),
    context
);
const { getPranchaAxleArea, getPranchaLandingGearGeometry, getLoadSequenceMetrics } = context;
const low = { tipo: 'rebaixada', w: 3, h: 0.9, pescoco: 3.6, mesa: 7, eixos: 3, cap: 45 };
const straight = { ...low, tipo: 'reta', h: 1, mesa: 12.55 };
const cargo = (comp, type = 'caixa', extra = {}) => ({
    type, comp, larg: 3, alt: 1, peso: 1, qtd: 1, camadas: 1, ...extra
});
function sequence(tr, pos, loads) {
    context.inputs.posicao.value = pos;
    context.composicaoCargas = loads;
    return getLoadSequenceMetrics(tr, false);
}

test('carga sobre os eixos respeita a plataforma traseira, não o pescoço', () => {
    const area = getPranchaAxleArea(low);
    const fits = sequence(low, 'eixos', [cargo(2.35)]);
    assert.equal(fits.loads.length, 1);
    assert.ok(Math.abs(area.length - 2.35) < 1e-9);
    assert.ok(Math.abs(area.start - 7.8) < 1e-9);
    assert.ok(fits.loads[0].inEixos);
    assert.equal(sequence(low, 'eixos', [cargo(2.36)]).loads.length, 0);
    assert.equal(context.cargasTransbordo[0].qtd, 1);
    assert.equal(sequence(low, 'mesa', [cargo(7)]).loads.length, 1);
});

test('par de bobinas ocupa mesa e eixos e respeita ambas as áreas', () => {
    const fit = sequence(low, 'mesa', [cargo(4, 'bobina_lado_2')]);
    assert.equal(fit.loads.length, 1);
    assert.equal(fit.loads[0].splitCoils, true);
    assert.ok(fit.mesaComp <= low.mesa);
    assert.ok(fit.eixoComp <= getPranchaAxleArea(low).length);
    assert.equal(sequence(low, 'mesa', [cargo(5, 'bobina_lado_2')]).loads.length, 0);
});

test('na prancha reta a área dos eixos não é contada duas vezes', () => {
    const area = getPranchaAxleArea(straight);
    assert.equal(area.height, 1);
    const fit = sequence(straight, 'mesa', [cargo(4, 'bobina_frente_2')]);
    assert.equal(fit.loads.length, 1);
    assert.ok(fit.mesaComp <= area.start);
    assert.equal(sequence(straight, 'mesa', [
        cargo(9.4), cargo(4, 'bobina_frente_2')
    ]).loads.length, 1);
    assert.equal(context.cargasTransbordo[0].type, 'bobina_frente_2');
    assert.equal(sequence(straight, 'mesa', [cargo(12.55)]).loads.length, 1);
});

test('pés de desengate ficam acima do chão e abaixo do assoalho do pescoço', () => {
    const gear = getPranchaLandingGearGeometry(1.58, 0.1);
    assert.ok(gear.footBottom > 0);
    assert.ok(gear.legTop < 1.58 - 0.1);
});

test('as pranchas Step respeitam os comprimentos próprios sobre os eixos', () => {
    for (const length of [3, 4]) {
        const step = { ...low, mesaEixos: length };
        assert.equal(getPranchaAxleArea(step).length, length);
        assert.equal(sequence(step, 'eixos', [cargo(length)]).loads.length, 1);
        assert.equal(sequence(step, 'eixos', [cargo(length + 0.01)]).loads.length, 0);
    }
});
