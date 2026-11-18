const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('const lashingEquipment =');
const end = source.indexOf('function renderListaCargas()', start);
assert.ok(start >= 0 && end > start);

function setup() {
    const elements = new Map();
    const createElement = () => ({
        value: '', textContent: '', listeners: {}, options: [], children: [],
        classList: { toggle() {} },
        addEventListener(event, callback) { this.listeners[event] = callback; },
        replaceChildren() { this.options = []; this.children = []; this.value = ''; },
        appendChild(child) {
            this.children.push(child);
            this.options.push(child);
            if (this.options.length === 1) this.value = child.value;
        }
    });
    const element = id => {
        if (!elements.has(id)) elements.set(id, createElement());
        return elements.get(id);
    };
    const context = vm.createContext({
        document: { getElementById: element, createElement },
        composicaoCargas: [],
        getCargoLabel: () => 'Carga',
        analyzeAndDraw() {}
    });
    vm.runInContext(source.slice(start, end), context);
    return { context, element };
}

const legacy = {
    equipment: 'chain10', method: 'direct', surface: 'wood', stf: null, lc: 6300,
    alpha: 75, k: 1.5, count: 3, cg: null, front: false, frontCapacity: null,
    side: false, sideCapacity: null
};

test('valida o novo formato e continua aceitando dados antigos', () => {
    const { context } = setup();
    const plan = context.defaultLashing();
    assert.ok(context.validLashing(plan));
    for (const change of [
        { count: 0 }, { count: 101 }, { count: 1.5 }, { arrangement: '' },
        { equipment: 'chain8' }, { version: 1 }
    ]) assert.ok(!context.validLashing({ ...plan, ...change }));
    assert.ok(context.validLegacyLashing(legacy));
    assert.ok(!context.validLegacyLashing({ ...legacy, count: -1 }));
    assert.ok(context.validLashing(JSON.parse(JSON.stringify(plan))));
});

test('prévia não altera a carga; salvar, trocar seleção e remover são explícitos', () => {
    const { context, element } = setup();
    const first = { type: 'caixa', qtd: 1 };
    const second = { type: 'caixa', qtd: 1 };
    context.composicaoCargas.push(first, second);
    context.refreshLashingItems();
    element('lashing_equipment').value = 'steel_cable';
    element('lashing_arrangement').value = 'crossed';
    element('lashing_count').value = '3';
    element('lashing_count').listeners.input();
    assert.equal(first.lashing, undefined);
    assert.equal(context.displayedLashing(first).count, 3);
    context.renderLashingAnalysis({ loads: [{ carga: { ...first }, originalCarga: first }] });
    assert.match(element('lashing_analysis').children[1].children[0].textContent, /prévia não salva/);
    element('lashing_item').value = '1';
    element('lashing_item').listeners.change();
    assert.equal(context.displayedLashing(first), null);
    element('lashing_form').listeners.submit({ preventDefault() {} });
    assert.equal(second.lashing.arrangement, 'transverse');
    element('lashing_remove').listeners.click();
    assert.equal(second.lashing, undefined);
});

test('plano antigo fica intacto até salvar um arranjo escolhido', () => {
    const { context, element } = setup();
    const cargo = { type: 'caixa', qtd: 1, lashing: { ...legacy } };
    context.composicaoCargas.push(cargo);
    context.refreshLashingItems();
    assert.equal(element('lashing_equipment').value, 'chain_grade_8');
    assert.equal(element('lashing_arrangement').value, '');
    assert.equal(context.displayedLashing(cargo), null);
    element('lashing_form').listeners.submit({ preventDefault() {} });
    assert.equal(cargo.lashing.method, 'direct');
    element('lashing_arrangement').value = 'crossed';
    element('lashing_arrangement').listeners.input();
    assert.equal(cargo.lashing.method, 'direct');
    element('lashing_form').listeners.submit({ preventDefault() {} });
    assert.equal(cargo.lashing.arrangement, 'crossed');
    assert.equal(cargo.lashing.count, 3);
    assert.equal(cargo.lashing.method, undefined);
});

test('diagonais formam pares em X e longitudinal percorre frente e traseira', () => {
    const { context } = setup();
    const points = (arrangement, count, i) => context.illustrativeLashingPoints(
        { arrangement, count }, i, 2, 4, 1, -1, [-1.5, 1.5], 0.1
    );
    const a = points('crossed', 3, 0);
    const b = points('crossed', 3, 1);
    const c = points('crossed', 3, 2);
    assert.equal(a[1][2], b[2][2]);
    assert.equal(a[2][2], b[1][2]);
    assert.ok(c[1][2] > a[1][2]);
    const longitudinal = points('longitudinal', 2, 0);
    assert.equal(longitudinal[0][0], longitudinal[3][0]);
    assert.ok(longitudinal[0][2] < 0 && longitudinal[3][2] > 0);
});

test('amarração acompanha a curvatura das bobinas e do vaso nos dois eixos', () => {
    const { context } = setup();
    const points = (type, arrangement, index = 0, split = false) => context.cylindricalLashingPoints(
        { type }, { arrangement, count: 2 }, index, 3, 3, 3, 1, -1.5, [-1.6, 1.6], 0.05, split
    );
    for (const type of ['bobina_frente_1', 'vaso']) {
        const transverse = points(type, 'transverse');
        const crossed = points(type, 'crossed');
        const otherDiagonal = points(type, 'crossed', 1);
        assert.ok(transverse[17][1] > transverse[1][1]);
        assert.ok(crossed[17][1] > crossed[1][1]);
        assert.ok(crossed[1][2] < crossed[33][2]);
        assert.ok(otherDiagonal[1][2] > otherDiagonal[33][2]);
        const longitudinal = points(type, 'longitudinal');
        assert.ok(longitudinal[1][2] < longitudinal[33][2]);
        assert.ok(longitudinal[17][1] < 1.5);
    }
    const sideLongitudinal = points('bobina_lado_1', 'longitudinal');
    const sideCrossed = points('bobina_lado_1', 'crossed');
    assert.ok(sideLongitudinal[17][1] > sideLongitudinal[1][1]);
    assert.ok(sideCrossed[17][1] > sideCrossed[1][1]);
    assert.ok(sideCrossed[1][0] < sideCrossed[33][0]);
    const pair = points('bobina_frente_2', 'transverse', 1);
    const split = points('bobina_frente_2', 'transverse', 1, true);
    assert.ok(pair[17][2] > 0);
    assert.ok(Math.abs(split[17][2]) < 1);
    assert.equal(points('caixa', 'crossed'), null);
});
