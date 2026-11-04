// --- Banco de Dados Integrado (Pranchas + Carretas) ---
const bdVeiculos = {
    "prancha_reb_6_3": { tipo: "rebaixada", w: 3.00, h: 1.10, pescoco: 3.50, mesa: 6.30, compTotal: 14.50, eixos: 3, cap: 45 },
    "prancha_reb_7_0": { tipo: "rebaixada", w: 3.00, h: 0.70, pescoco: 3.80, mesa: 7.00, compTotal: 16.70, eixos: 3, cap: 45 },
    "prancha_reb_6_0": { tipo: "rebaixada", w: 3.20, h: 0.90, pescoco: 3.60, transicao: 1.40, mesa: 6.00, areaCargaTotal: 11.00, compTotal: 14.60, eixos: 3, cap: 45 },
    "prancha_reta_12_5": { tipo: "reta", w: 3.20, h: 1.20, pescoco: 3.60, mesa: 12.55, compTotal: 18.00, eixos: 3, cap: 40 },
    "prancha_semi_3_9": { tipo: "semi-rebaixada", w: 3.00, h: 0.80, pescoco: 3.65, mesa: 3.95, compTotal: 13.50, eixos: 3, cap: 35 },
    "prancha_reb_4_11_3": { tipo: "rebaixada", w: 3.00, h: 0.90, pescoco: 3.70, mesa: 11.30, compTotal: 19.00, eixos: 4, cap: 60 },
    
    "carreta_ext": { tipo: "carreta_ext", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 15.00, compTotal: 15.00, eixos: 3, cap: 25 },
    "carreta_bau_15": { tipo: "carreta_bau", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 15.00, compTotal: 15.00, eixos: 3, cap: 25 },
    "carreta_padrao": { tipo: "carreta", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 25 },
    "carreta_vand": { tipo: "vanderleia", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 30 },
    "carreta_sider": { tipo: "sider", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 25 }
};

const CAB_MODELS = {
    semi_obj: { format: 'obj' },
    tractor_cab_burnout_3: { 
        format: 'gltf', 
        url: './tractor_cab_burnout_3.glb',
        scale: 1.2, 
        rotationY: 0,
        offsetY: 1 
    },
    fortnite_semi_truck: { 
        format: 'gltf', 
        url: './fortnite_semi_truck.glb',
        scale: 1.2, 
        rotationY: Math.PI, 
        offsetY: 1 
    },
    semi_truck_burnout_revenge: { 
        format: 'gltf', 
        url: './semi_truck_burnout_revenge.glb',
        scale: 1.0,
        rotationY: 0,
        offsetY: 0 
    },
    scania_s_730: {
        format: 'gltf',
        url: './scania_S-730.glb.gz',
        compression: 'gzip',
        uniformScale: 3.0,
        rotationY: 0,
        alignToGround: true,
        offsetZ: -2.6,
        bodyColor: 0xf2f2f0,
        grayMeshNames: ['Object_56', 'Object_83', 'Object_125'],
        whiteMeshNames: ['Object_30', 'Object_58']
    }
};

const cabModelPromises = new Map();
const cabTexturePaletteCache = new WeakMap();
const cabBrightTextureCache = new WeakMap();
const cabGrayTextureCache = new WeakMap();

// --- ESTADO GLOBAL DA COMPOSIÇÃO DE CARGAS ---
let composicaoCargas = [];
let editingCargaIndex = null;
let activeCargaTab = 'cargas';
let tubeInputUpdateTimer = null;
let tubeStrappingEnabled = true;
let cargoTrailerSelectionBeforeTubes = null;

const TUBE_TRAILER_IDS = new Set([
    'carreta_ext',
    'carreta_bau_15',
    'carreta_padrao',
    'carreta_vand',
    'carreta_sider'
]);

function getTubeLengthForTrailer(tr) {
    return tr.mesa >= 15 ? 14 : 13;
}

function brightenCabTexture(texture) {
    if (!texture || !texture.image) return texture;
    if (cabBrightTextureCache.has(texture)) return cabBrightTextureCache.get(texture);

    try {
        const image = texture.image;
        const width = image.width || image.videoWidth;
        const height = image.height || image.videoHeight;
        if (!width || !height) return texture;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(image, 0, 0, width, height);

        const pixels = ctx.getImageData(0, 0, width, height);
        const data = pixels.data;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 10) continue;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
            if (luminance < 9) continue;
            const lift = value => Math.min(255, Math.round(255 * Math.pow(value / 255, 0.62)));
            data[i] = lift(r); data[i + 1] = lift(g); data[i + 2] = lift(b);
        }

        ctx.putImageData(pixels, 0, 0);

        const brightTexture = texture.clone();
        brightTexture.image = canvas;
        brightTexture.needsUpdate = true;
        cabBrightTextureCache.set(texture, brightTexture);
        return brightTexture;
    } catch (error) {
        return texture;
    }
}

function grayCabTexture(texture) {
    if (!texture || !texture.image) return texture;
    if (cabGrayTextureCache.has(texture)) return cabGrayTextureCache.get(texture);

    const image = texture.image;
    const width = image.width || image.videoWidth;
    const height = image.height || image.videoHeight;
    if (!width || !height) return texture;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return texture;

    ctx.drawImage(image, 0, 0, width, height);
    const pixels = ctx.getImageData(0, 0, width, height);
    const data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
        const luminance = Math.round(data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722);
        data[i] = luminance;
        data[i + 1] = luminance;
        data[i + 2] = luminance;
    }
    ctx.putImageData(pixels, 0, 0);

    const grayTexture = texture.clone();
    grayTexture.image = canvas;
    grayTexture.needsUpdate = true;
    cabGrayTextureCache.set(texture, grayTexture);
    return grayTexture;
}

const CAB_REFERENCE_SIZE = [7.4757, 10.306, 25.3345];
const CAB_REFERENCE_CENTER = [0, 5.1179, 11.6600];

const LOAD_TYPES = [
    { value: 'caixa', label: 'Caixa / carga industrial', preset: [6, 2.8, 2.5, 15] },
    { value: 'palete_caixas', label: 'Palete com caixas', preset: [1.2, 1, 1.4, 0.8] },
    { value: 'caixa_metalica', label: 'Caixa metálica', preset: [6, 2.4, 2.5, 5] },
    { value: 'cesta_metalica', label: 'Cesta metálica', preset: [4, 2.4, 2.5, 3] },
    { value: 'cacamba_vazia', label: 'Caçamba vazia', preset: [4, 2.2, 1.8, 2] },
    { value: 'cacamba_cheia', label: 'Caçamba cheia', preset: [4, 2.2, 1.8, 8] },
    { value: 'skid_cilindros', label: 'Skid com cilindros', preset: [4, 2.4, 2.5, 5] },
    { value: 'bobina_lado_1', label: '1 bobina — face para o lado', preset: [3, 3, 3, 12] },
    { value: 'bobina_lado_2', label: '2 bobinas — faces para o lado', preset: [5, 3, 3, 24] },
    { value: 'bobina_frente_1', label: '1 bobina — face para frente', preset: [3, 3, 3, 12] },
    { value: 'bobina_frente_2', label: '2 bobinas — faces para frente', preset: [6, 3, 3, 24] },
    { value: 'skid', label: 'Skid offshore', preset: [6, 3, 3.8, 18] },
    { value: 'container_mae', label: 'Coração de Mãe (Fechado)', preset: [4, 4, 4, 12] },
    { value: 'coracao_mae_aberto', label: 'Coração de Mãe (Aberto)', preset: [4, 4, 4, 12] },
    { value: 'container_20', label: 'Open Top 20 pés (lona)', preset: [5.919, 2.340, 2.286, 4] },
    { value: 'container_40', label: 'Open Top 40 pés (lona)', preset: [12.043, 2.338, 2.272, 8] },
    { value: 'container_10', label: 'Open Top 10 pés (ref.)', preset: [3.05, 2.44, 2.59, 2] },
    { value: 'container_baby', label: 'Open Top baby (ref.)', preset: [2.5, 2.2, 2.2, 1.5] },
    { value: 'container_dry_20', label: 'Dry 20 pés', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_reefer_20', label: 'Reefer 20 pés', preset: [5.451, 2.290, 2.157, 4] },
    { value: 'container_flat_rack_20', label: 'Flat Rack dobrável 20 pés', preset: [5.966, 2.418, 2.286, 4] },
    { value: 'container_ventilated_20', label: 'Ventilado 20 pés (ref.)', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_bulk_20', label: 'Graneleiro 20 pés (ref.)', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_double_door_20', label: 'Dupla porta 20 pés (ref.)', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_side_open_20', label: 'Abertura lateral 20 pés (ref.)', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_tank_20', label: 'Tanque ISO 20 pés (ref.)', preset: [5.896, 2.350, 2.385, 4] },
    { value: 'container_high_cube_20', label: 'High Cube 20 pés (ref.)', preset: [5.896, 2.350, 2.697, 4] },
    { value: 'container_reefer_high_cube_20', label: 'Reefer High Cube 20 pés (ref.)', preset: [5.451, 2.280, 2.415, 4] },
    { value: 'container_hard_top_20', label: 'Hard Top 20 pés (ref.)', preset: [5.896, 2.350, 2.393, 4] },
    { value: 'container_insulated_20', label: 'Isolado 20 pés (ref.)', preset: [5.896, 2.350, 2.393, 4] },
    { value: 'container_pallet_wide_20', label: 'Pallet Wide 20 pés (ref.)', preset: [5.896, 2.440, 2.393, 4] },
    { value: 'container_platform_20', label: 'Plataforma 20 pés (ref.)', preset: [5.896, 2.350, 2.393, 4] },
    { value: 'container_dry_10', label: 'Dry 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_reefer_10', label: 'Reefer 10 pés (ref.)', preset: [2.831, 2.290, 2.157, 2] },
    { value: 'container_flat_rack_10', label: 'Flat Rack dobrável 10 pés (ref.)', preset: [2.831, 2.418, 1.943, 2] },
    { value: 'container_ventilated_10', label: 'Ventilado 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_bulk_10', label: 'Graneleiro 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_double_door_10', label: 'Dupla porta 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_side_open_10', label: 'Abertura lateral 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_tank_10', label: 'Tanque ISO 10 pés (ref.)', preset: [2.831, 2.350, 2.385, 2] },
    { value: 'container_high_cube_10', label: 'High Cube 10 pés (ref.)', preset: [2.831, 2.350, 2.697, 2] },
    { value: 'container_reefer_high_cube_10', label: 'Reefer High Cube 10 pés (ref.)', preset: [2.831, 2.280, 2.415, 2] },
    { value: 'container_hard_top_10', label: 'Hard Top 10 pés (ref.)', preset: [2.831, 2.350, 2.393, 2] },
    { value: 'container_insulated_10', label: 'Isolado 10 pés (ref.)', preset: [2.831, 2.350, 2.393, 2] },
    { value: 'container_pallet_wide_10', label: 'Pallet Wide 10 pés (ref.)', preset: [2.831, 2.440, 2.393, 2] },
    { value: 'container_platform_10', label: 'Plataforma 10 pés (ref.)', preset: [2.831, 2.350, 2.393, 2] },
    { value: 'container_dry_40', label: 'Dry 40 pés', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_high_cube_40', label: 'High Cube 40 pés', preset: [12.035, 2.350, 2.697, 8] },
    { value: 'container_reefer_high_cube_40', label: 'Reefer High Cube 40 pés', preset: [11.578, 2.280, 2.415, 8] },
    { value: 'container_flat_rack_40', label: 'Flat Rack dobrável 40 pés', preset: [12.178, 2.369, 1.943, 8] },
    { value: 'container_ventilated_40', label: 'Ventilado 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_hard_top_40', label: 'Hard Top 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_bulk_40', label: 'Graneleiro 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_double_door_40', label: 'Dupla porta 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_side_open_40', label: 'Abertura lateral 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_insulated_40', label: 'Isolado 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'container_pallet_wide_40', label: 'Pallet Wide 40 pés (ref.)', preset: [12.035, 2.440, 2.393, 8] },
    { value: 'container_platform_40', label: 'Plataforma 40 pés (ref.)', preset: [12.035, 2.350, 2.393, 8] },
    { value: 'tanque', label: 'Tanque em grade', preset: [3.05, 2.44, 2.59, 3.5] },
    { value: 'tubulacao', label: 'Tubulações', preset: [8, 2.4, 2, 8] },
    { value: 'vaso', label: 'Vaso de pressão', preset: [4, 2.8, 3.5, 10] },
    { value: 'gerador', label: 'Gerador', preset: [4.5, 2.6, 2.7, 8] },
    { value: 'cesta', label: 'Cesta offshore', preset: [4, 2.4, 2.5, 5] },
    { value: 'estrutura', label: 'Estrutura metálica', preset: [7, 3, 2.8, 9] }
].map(loadType => ({
    ...loadType,
    gap: loadType.value.startsWith('bobina_')
        ? 0.50
        : loadType.value.startsWith('container_')
            ? 0.00
            : 0.02
}));

const CONTAINER_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_'))
    .map(({ value }) => value));
const OPEN_TOP_LOAD_TYPES = new Set([
    'container_mae', 'container_20', 'container_40',
    'container_10', 'container_baby'
]);
const FLAT_RACK_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_flat_rack_'))
    .map(({ value }) => value));
const REEFER_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_reefer_'))
    .map(({ value }) => value));
const FLAT_PLATFORM_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_platform_'))
    .map(({ value }) => value));
const SIDE_OPEN_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_side_open_'))
    .map(({ value }) => value));
const TANK_CONTAINER_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_tank_'))
    .map(({ value }) => value));
const UNBRANDED_CONTAINER_TYPES = new Set([
    ...FLAT_RACK_LOAD_TYPES,
    ...FLAT_PLATFORM_LOAD_TYPES,
    ...TANK_CONTAINER_LOAD_TYPES
]);
const LOCKED_LOAD_TYPES = new Set([...CONTAINER_LOAD_TYPES, 'caixa_metalica', 'cesta_metalica', 'cesta']);

function getLoadStartClearance(type) {
    return LOCKED_LOAD_TYPES.has(type) ? 1.4 : 0.2;
}

function getDeckTransitionLength(tr) {
    return tr.tipo === 'reta' ? 0 : (tr.transicao ?? 1.2);
}

const inputs = {
    cavalinho: document.getElementById('input_cavalinho'),
    placa_prancha: document.getElementById('input_placa'),
    placa_carreta: document.getElementById('input_placa_carreta'),
    cComp: document.getElementById('input_carga_comp'),
    cLarg: document.getElementById('input_carga_largura'),
    cAlt: document.getElementById('input_carga_altura'),
    cPeso: document.getElementById('input_carga_peso'),
    cQtd: document.getElementById('input_carga_qtd'), // Lendo a quantidade do HTML
    posicao: document.getElementById('input_posicao'),
    tampas: document.getElementById('input_tampas')
};

const infos = {
    largura: document.getElementById('info_largura'),
    altura: document.getElementById('info_altura'),
    lbl_pescoco: document.getElementById('lbl_pescoco'),
    pescoco: document.getElementById('info_pescoco'),
    mesa: document.getElementById('info_mesa'),
    areaCargaTotal: document.getElementById('info_area_carga'),
    compTotal: document.getElementById('info_comp_total'),
    tagTipo: document.getElementById('tag_tipo_prancha')
};

const els = {
    alertAet: document.getElementById('alert_aet'),
    iconAet: document.getElementById('icon_aet'),
    titleAet: document.getElementById('title_aet'),
    descAet: document.getElementById('desc_aet'),
    resAltTotal: document.getElementById('res_altura_total'),
    avisoAlt: document.getElementById('aviso_altura'),
    resExcLat: document.getElementById('res_excesso_lat'),
    barComp: document.getElementById('bar_comprimento'),
    resCompUso: document.getElementById('res_comp_uso'),
    resCompTotal: document.getElementById('res_comp_total'),
    barPeso: document.getElementById('bar_peso'),
    resPesoUso: document.getElementById('res_peso_uso'),
    resPesoTotal: document.getElementById('res_peso_total'),
    btnCancelarEdicao: document.getElementById('btn_cancelar_edicao'),
    sideCanvas: document.getElementById('sideCanvas'),
    rearCanvas: document.getElementById('rearCanvas'),
    btnAdicionar: document.getElementById('btn_adicionar_carga'),
    btnReset: document.getElementById('btn_reset'),
    listaCargas: document.getElementById('lista_composicao'),
    badgeQtd: document.getElementById('badge_qtd_cargas'),
    cargoSummary: {
        container: document.getElementById('cargo_analysis_summary'),
        units: document.getElementById('cargo_summary_units'),
        types: document.getElementById('cargo_summary_types'),
        weight: document.getElementById('cargo_summary_weight'),
        length: document.getElementById('cargo_summary_length'),
        items: document.getElementById('cargo_summary_items'),
        empty: document.getElementById('cargo_summary_empty')
    },
    tubeSummary: document.getElementById('tube_analysis_summary')
};

const tubeInputs = {
    diameter: document.getElementById('tube_diameter'),
    unit: document.getElementById('tube_unit'),
    outerDiameter: document.getElementById('tube_outer_diameter'),
    width: document.getElementById('tube_width'),
    height: document.getElementById('tube_height'),
    length: document.getElementById('tube_length'),
    firstSleeper: document.getElementById('tube_first_sleeper'),
    layerSleeper: document.getElementById('tube_layer_sleeper'),
    weight: document.getElementById('tube_weight'),
    trailerCapacity: document.getElementById('tube_trailer_capacity'),
    arrangement: document.getElementById('tube_arrangement'),
    perRow: document.getElementById('tube_per_row'),
    perTruck: document.getElementById('tube_per_truck'),
    total: document.getElementById('tube_total')
};

const tubeResults = {
    diameter: document.getElementById('tube_result_diameter'),
    row: document.getElementById('tube_result_row'),
    layers: document.getElementById('tube_result_layers'),
    capacity: document.getElementById('tube_result_capacity'),
    loaded: document.getElementById('tube_result_loaded'),
    height: document.getElementById('tube_result_height'),
    weight: document.getElementById('tube_result_weight'),
    trips: document.getElementById('tube_result_trips'),
    distribution: document.getElementById('tube_result_distribution')
};

const ctxSide = els.sideCanvas.getContext('2d');
const ctxRear = els.rearCanvas.getContext('2d');

let scene, camera, renderer, controls, trailerGroup, loadGroup;
let currentTrailer = bdVeiculos["prancha_reb_6_3"];
let trailerChassisPromise;
let draw3DRevision = 0;

function loadCabModel(modelId) {
    if (!cabModelPromises.has(modelId)) {
        const model = CAB_MODELS[modelId] || CAB_MODELS.semi_obj;
        const promise = model.format === 'obj'
            ? new Promise((resolve, reject) => {
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.setPath('./OBJ/');
                mtlLoader.load('semi.mtl', materials => {
                    materials.preload();
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.setPath('./OBJ/');
                    objLoader.load('semi.obj', resolve, undefined, reject);
                }, undefined, reject);
            })
            : model.compression === 'gzip'
                ? loadCompressedTrailerModel(model.url, './scania_S-730.glb')
                : new Promise((resolve, reject) => {
                const loader = new THREE.GLTFLoader();
                loader.load(model.url, gltf => resolve(gltf.scene), undefined, reject);
            });
        cabModelPromises.set(modelId, promise);
    }
    return cabModelPromises.get(modelId);
}

function loadCompressedTrailerModel(compressedUrl, uncompressedUrl) {
    const loader = new THREE.GLTFLoader();
    const loadUncompressed = () => new Promise((resolve, reject) => {
        loader.load(uncompressedUrl, gltf => resolve(gltf.scene), undefined, reject);
    });

    if (window.location.protocol === 'file:' || typeof DecompressionStream !== 'function') {
        return loadUncompressed();
    }

    return fetch(compressedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Falha ao baixar o modelo comprimido (${response.status}).`);
            }
            if (!response.body) {
                throw new Error('A resposta do modelo comprimido não contém dados.');
            }
            return new Response(response.body.pipeThrough(new DecompressionStream('gzip')))
                .arrayBuffer();
        })
        .then(data => new Promise((resolve, reject) => {
            loader.parse(data, './', gltf => resolve(gltf.scene), reject);
        }))
        .catch(error => {
            console.warn(`Falha ao carregar ${compressedUrl}; tentando o modelo original.`, error);
            return loadUncompressed();
        });
}

function loadTrailerChassis() {
    if (!trailerChassisPromise) {
        trailerChassisPromise = loadCompressedTrailerModel(
            './chassi-para-carreta-14-15.glb.gz',
            './chassi-para-carreta-14-15.glb'
        );
    }
    return trailerChassisPromise;
}

function frameVehicleView() {
    const bounds = new THREE.Box3().setFromObject(trailerGroup);
    if (loadGroup.children.length) bounds.union(new THREE.Box3().setFromObject(loadGroup));
    if (bounds.isEmpty()) return;

    const center = bounds.getCenter(new THREE.Vector3());
    const direction = camera.position.clone().sub(controls.target).normalize();
    const forward = direction.clone().negate();
    const right = forward.clone().cross(camera.up).normalize();
    const vertical = right.clone().cross(forward).normalize();
    const tanHalfVerticalFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanHalfHorizontalFov = tanHalfVerticalFov * camera.aspect;
    let distance = 0;

    for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
                const offset = new THREE.Vector3(x, y, z).sub(center);
                const depth = offset.dot(direction);
                distance = Math.max(
                    distance,
                    depth + Math.abs(offset.dot(right)) / tanHalfHorizontalFov,
                    depth + Math.abs(offset.dot(vertical)) / tanHalfVerticalFov
                );
            }
        }
    }

    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(direction, Math.max(distance * 1.15, 24));
    camera.updateProjectionMatrix();
    controls.update();
}

function getActiveTrailerId() {
    if (inputs.placa_prancha.value) return inputs.placa_prancha.value;
    if (inputs.placa_carreta.value) return inputs.placa_carreta.value;
    return "prancha_reb_6_3"; 
}

function setVehicleSelectorTab(tab) {
    document.querySelectorAll('[data-vehicle-tab]').forEach(button => {
        const isActive = button.dataset.vehicleTab === tab;
        button.classList.toggle('vehicle-tab-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
    });

    ['cavalinho', 'prancha', 'carreta'].forEach(panel => {
        document.getElementById(`panel_${panel}`).classList.toggle('hidden', panel !== tab);
    });
}

document.querySelectorAll('[data-vehicle-tab]').forEach(button => {
    button.addEventListener('click', () => setVehicleSelectorTab(button.dataset.vehicleTab));
});
setVehicleSelectorTab('prancha');

inputs.cavalinho.addEventListener('change', analyzeAndDraw);
inputs.posicao.addEventListener('change', analyzeAndDraw);
inputs.tampas.addEventListener('change', analyzeAndDraw);
inputs.placa_prancha.addEventListener('change', () => {
    if(inputs.placa_prancha.value) {
        inputs.placa_carreta.value = "";
        setVehicleSelectorTab('prancha');
    }
    updateTrailerInfo();
});
inputs.placa_carreta.addEventListener('change', () => {
    if(inputs.placa_carreta.value) {
        inputs.placa_prancha.value = "";
        setVehicleSelectorTab('carreta');
    }
    updateTrailerInfo();
});

// Calcula o espaço que o grid de um bloco de cargas vai ocupar (fileiras e colunas)
function getLoadGap(type) {
    return LOAD_TYPES.find(loadType => loadType.value === type)?.gap ?? 0.02;
}

function getCarretaAxleLayout(tr) {
    return {
        firstFromRear: tr.tipo === 'vanderleia' ? 1.2 : 1.5,
        spacing: tr.tipo === 'vanderleia' ? 2.4 : 1.2
    };
}

function getGridMetrics(tr, carga, isCarreta, cComp = carga.comp) {
    const { larg: cLarg, qtd: cQtd, peso, type } = carga;
    const standardGap = getLoadGap(type);
    const usesGates = isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
    const availableWidth = usesGates ? tr.w_util : tr.w;
    const isDistributed = isCarreta &&
        peso * cQtd > tr.cap / 2 &&
        cQtd > 1 &&
        cQtd * cComp <= tr.mesa;
    const gap = isDistributed
        ? (tr.mesa - cQtd * cComp) / (cQtd - 1)
        : standardGap;

    let maxCols = isDistributed
        ? 1
        : Math.floor((availableWidth + gap) / (cLarg + gap));
    if (maxCols < 1) maxCols = 1; 
    
    const rows = Math.ceil(cQtd / maxCols);
    const totalComp = rows * cComp + Math.max(0, rows - 1) * gap;
    const maxItemsInRow = Math.min(cQtd, maxCols);
    const totalLarg = maxItemsInRow * cLarg + Math.max(0, maxItemsInRow - 1) * gap;

    return { maxCols, rows, totalComp, totalLarg, availableWidth, gap, isDistributed };
}

function getTubeMetrics(tr) {
    const readNumber = input => {
        const value = Number.parseFloat(input.value);
        return Number.isFinite(value) ? value : 0;
    };
    const nominalDiameter = readNumber(tubeInputs.diameter);
    const realDiameter = readNumber(tubeInputs.outerDiameter);
    const diameterMm = realDiameter > 0
        ? realDiameter
        : nominalDiameter * (tubeInputs.unit.value === 'in' ? 25.4 : 1);
    const widthMm = readNumber(tubeInputs.width);
    const heightMm = readNumber(tubeInputs.height);
    const firstSleeperMm = readNumber(tubeInputs.firstSleeper);
    const layerSleeperMm = readNumber(tubeInputs.layerSleeper);
    const tubeLengthM = getTubeLengthForTrailer(tr);
    const weightKg = readNumber(tubeInputs.weight);
    const trailerCapacityT = readNumber(tubeInputs.trailerCapacity);
    const automaticPerRow = diameterMm > 0 ? Math.floor(widthMm / diameterMm) : 0;
    const requestedPerRow = Math.floor(readNumber(tubeInputs.perRow));
    const perRow = requestedPerRow > 0
        ? Math.min(requestedPerRow, automaticPerRow)
        : automaticPerRow;
    const layerPitchMm = diameterMm + layerSleeperMm;
    const heightLimitedLayers = diameterMm > 0 && layerPitchMm > 0 && heightMm >= firstSleeperMm + diameterMm
        ? Math.max(0, Math.floor((heightMm - firstSleeperMm + layerSleeperMm) / layerPitchMm))
        : 0;
    const layers = tubeInputs.arrangement.value === 'piramidal'
        ? Math.min(heightLimitedLayers, perRow)
        : heightLimitedLayers;
    const layerCounts = [];
    for (let layer = 0; layer < layers; layer++) {
        layerCounts.push(tubeInputs.arrangement.value === 'piramidal'
            ? Math.max(0, perRow - layer)
            : perRow);
    }
    const maxCapacity = layerCounts.reduce((total, count) => total + count, 0);
    const requestedPerTruck = Math.floor(readNumber(tubeInputs.perTruck));
    const requestedLoad = requestedPerTruck > 0 ? requestedPerTruck : maxCapacity;
    const geometricLoad = Math.min(requestedLoad, maxCapacity);
    const weightCapacity = weightKg > 0
        ? Math.floor(trailerCapacityT * 1000 / weightKg)
        : maxCapacity;
    const loaded = Math.min(geometricLoad, weightCapacity);
    let remainingLoad = loaded;
    const loadedLayerCounts = layerCounts.map(count => {
        const loadedInLayer = Math.min(remainingLoad, count);
        remainingLoad -= loadedInLayer;
        return loadedInLayer;
    });
    const loadedLayers = loadedLayerCounts.filter(count => count > 0).length;
    const totalToTransport = Math.floor(readNumber(tubeInputs.total));
    const stackHeightMm = loadedLayers > 0
        ? firstSleeperMm + diameterMm + (loadedLayers - 1) * layerPitchMm
        : 0;
    const weightT = weightKg > 0 ? loaded * weightKg / 1000 : null;
    const trips = totalToTransport > 0 && loaded > 0
        ? Math.ceil(totalToTransport / loaded)
        : null;
    const warnings = [];

    if (diameterMm <= 0 || widthMm <= 0 || heightMm <= 0 || tubeLengthM <= 0) {
        warnings.push('Informe valores maiores que zero para diâmetro, largura, altura e comprimento.');
    }
    if (requestedPerRow > automaticPerRow && automaticPerRow > 0) {
        warnings.push(`A fileira foi limitada a ${automaticPerRow} tubos para caber na largura útil.`);
    }
    if (requestedPerTruck > maxCapacity) {
        warnings.push(`A quantidade solicitada por carreta excede a capacidade geométrica de ${maxCapacity} tubos; a prévia mostra a quantidade que cabe.`);
    }
    if (loaded < geometricLoad && weightKg > 0) {
        warnings.push(loaded > 0
            ? `Quantidade por carreta reduzida de ${geometricLoad} para ${loaded} tubos para respeitar o limite de peso (${trailerCapacityT.toFixed(2)} t).${trips === null ? ' Informe o total para estimar as viagens necessárias.' : ` O total informado será distribuído em ${trips} viagens.`}`
            : `Cada tubo pesa mais que a capacidade informada da carreta; não é possível carregar tubos sem exceder o limite de peso.`);
    }
    if (tubeLengthM > tr.mesa) {
        warnings.push(`O tubo tem ${tubeLengthM.toFixed(2)} m e ultrapassa a mesa de ${tr.mesa.toFixed(2)} m.`);
    }
    if (maxCapacity === 0 && diameterMm > 0) {
        warnings.push('Não há espaço para acomodar tubos com as dimensões informadas.');
    }
    if (loaded > 0 && weightT !== null && weightT > trailerCapacityT) {
        warnings.push(`O peso estimado (${weightT.toFixed(2)} t) excede a capacidade informada (${trailerCapacityT.toFixed(2)} t).`);
    }

    return {
        diameterMm,
        widthMm,
        heightMm,
        firstSleeperMm,
        layerSleeperMm,
        tubeLengthM,
        weightKg,
        trailerCapacityT,
        automaticPerRow,
        perRow,
        layers,
        layerCounts,
        loadedLayerCounts,
        loadedLayers,
        maxCapacity,
        weightCapacity,
        requestedLoad,
        loaded,
        totalToTransport,
        stackHeightMm,
        widthOccupiedMm: perRow * diameterMm,
        weightT,
        trips,
        warnings
    };
}

function getTubePositions(tube, limit = Math.min(tube.loaded, 1200)) {
    const positions = [];
    for (let layer = 0; layer < tube.loadedLayerCounts.length && positions.length < limit; layer++) {
        const count = Math.min(tube.loadedLayerCounts[layer], limit - positions.length);
        for (let index = 0; index < count && positions.length < limit; index++) {
            positions.push({
                xMm: (index - (count - 1) / 2) * tube.diameterMm,
                layer
            });
        }
    }
    return positions;
}

function getLoadSequenceMetrics(tr, isCarreta) {
    let mesaOffset = 0;
    let pescocoOffset = 0;
    const pos = inputs.posicao.value;
    const loads = composicaoCargas.map(carga => {
        const splitCoils = !isCarreta && tr.pescoco > 0 &&
            (carga.type === 'bobina_lado_2' || carga.type === 'bobina_frente_2');
        const clearance = getLoadStartClearance(carga.type);
        const coilLength = splitCoils ? carga.comp / 2 : carga.comp;
        const grid = getGridMetrics(tr, carga, isCarreta, coilLength);
        const isConcentrada = isCarreta &&
            carga.qtd === 1 &&
            carga.peso * carga.qtd > tr.cap / 2 &&
            grid.totalComp + grid.gap < tr.mesa / 2;
        return { carga, grid, clearance, splitCoils, coilLength, isConcentrada };
    });

    if (isCarreta) {
        const distributedLoads = loads.filter(load => load.grid.isDistributed);
        if (distributedLoads.length) {
            distributedLoads.forEach(load => {
                load.startOffset = 0;
            });
            let normalOffset = tr.mesa;
            loads.filter(load => !load.grid.isDistributed).forEach(load => {
                load.startOffset = normalOffset;
                normalOffset += load.grid.totalComp + load.grid.gap;
            });
            const mesaComp = loads.reduce(
                (maxEnd, load) => Math.max(maxEnd, load.startOffset + load.grid.totalComp),
                0
            );
            return {
                loads,
                totalComp: mesaComp,
                mesaComp,
                pescocoComp: 0
            };
        }

        const concentratedLoads = loads.filter(load => load.isConcentrada);
        let concentratedEnd = 0;
        let concentratedStart = 0;
        let concentratedCursor = 0;
        if (concentratedLoads.length) {
            concentratedLoads.forEach((load, index) => {
                if (index > 0) concentratedCursor += concentratedLoads[index - 1].grid.gap;
                load.startOffset = concentratedCursor;
                concentratedCursor += load.grid.totalComp;
            });
            const concentratedLength = concentratedCursor;
            const axleLayout = getCarretaAxleLayout(tr);
            const axleCenterFromRear = axleLayout.firstFromRear +
                (Math.max(1, tr.eixos) - 1) * axleLayout.spacing / 2;
            const axleCenterOffset = tr.mesa - axleCenterFromRear;
            concentratedStart = Math.max(
                0,
                Math.min(tr.mesa - concentratedLength, axleCenterOffset - concentratedLength / 2)
            );
            concentratedLoads.forEach(load => {
                load.startOffset += concentratedStart;
            });
            concentratedEnd = concentratedStart + concentratedLength;
        }

        let normalFrontOffset = 0;
        let normalRearOffset = concentratedEnd;
        let normalRearGap = concentratedLoads.length
            ? concentratedLoads[concentratedLoads.length - 1].grid.gap
            : 0;
        let rearQueueStarted = false;
        loads.filter(load => !load.isConcentrada).forEach(load => {
            const candidateStartOffset = Math.max(normalFrontOffset, load.clearance);
            const fitsBeforeConcentrated = !concentratedLoads.length ||
                (candidateStartOffset + load.grid.totalComp + load.grid.gap <= concentratedStart);
            if (!rearQueueStarted && fitsBeforeConcentrated) {
                load.startOffset = candidateStartOffset;
                normalFrontOffset = candidateStartOffset + load.grid.totalComp + load.grid.gap;
                return;
            }

            rearQueueStarted = true;
            load.startOffset = normalRearOffset + normalRearGap;
            normalRearOffset = load.startOffset + load.grid.totalComp;
            normalRearGap = load.grid.gap;
        });

        const mesaComp = loads.reduce(
            (maxEnd, load) => Math.max(maxEnd, load.startOffset + load.grid.totalComp),
            0
        );
        return { loads, totalComp: mesaComp, mesaComp, pescocoComp: 0 };
    }

    let mesaEnd = 0;
    let pescocoEnd = 0;
    loads.forEach(load => {
        const { grid, clearance, splitCoils } = load;
        const gap = grid.gap;
        if (splitCoils) {
            const mesaStartOffset = Math.max(mesaOffset, clearance);
            const pescocoStartOffset = Math.max(pescocoOffset, clearance);
            mesaOffset = mesaStartOffset + grid.totalComp + gap;
            pescocoOffset = pescocoStartOffset + grid.totalComp + gap;
            mesaEnd = Math.max(mesaEnd, mesaStartOffset + grid.totalComp);
            pescocoEnd = Math.max(pescocoEnd, pescocoStartOffset + grid.totalComp);
            Object.assign(load, {
                startOffset: pos === 'pescoco' ? pescocoStartOffset : mesaStartOffset,
                mesaStartOffset,
                pescocoStartOffset
            });
            return;
        }

        const inPescoco = !isCarreta && pos === 'pescoco';
        const startOffset = Math.max(inPescoco ? pescocoOffset : mesaOffset, clearance);
        if (inPescoco) {
            pescocoOffset = startOffset + grid.totalComp + gap;
            pescocoEnd = Math.max(pescocoEnd, startOffset + grid.totalComp);
        } else {
            mesaOffset = startOffset + grid.totalComp + gap;
            mesaEnd = Math.max(mesaEnd, startOffset + grid.totalComp);
        }
        Object.assign(load, { startOffset });
    });

    return {
        loads,
        totalComp: pos === 'pescoco' ? pescocoEnd : mesaEnd,
        mesaComp: mesaEnd,
        pescocoComp: pescocoEnd
    };
}

// Atualiza a lista visual no HTML
function renderListaCargas() {
    els.listaCargas.innerHTML = '';
    els.badgeQtd.textContent = composicaoCargas.length;

    if (composicaoCargas.length === 0) {
        els.listaCargas.innerHTML = '<li class="text-[11px] text-slate-400 italic py-2 text-center border border-dashed border-slate-300 rounded">Nenhuma carga adicionada</li>';
        return;
    }

    composicaoCargas.forEach((carga, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center bg-white border p-2 rounded shadow-sm text-[11px] ${editingCargaIndex === index ? 'border-indigo-500 ring-1 ring-indigo-200' : 'border-indigo-100'}`;
        
        const typeLabel = LOAD_TYPES.find(t => t.value === carga.type)?.label || 'Carga';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'flex flex-col flex-1 text-left cursor-pointer';
        editButton.title = 'Clique para editar esta carga';
        editButton.setAttribute('aria-label', `Editar ${carga.qtd} ${typeLabel}`);
        editButton.innerHTML = `
            <span class="font-bold text-slate-700">${carga.qtd}x ${typeLabel}</span>
            <span class="text-slate-500">${carga.comp.toFixed(1)}m x ${carga.larg.toFixed(1)}m x ${carga.alt.toFixed(1)}m &bull; ${carga.peso}t/unid</span>
        `;
        editButton.addEventListener('click', () => editarCarga(index));

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'text-red-500 hover:text-red-700 p-1';
        removeButton.title = 'Remover item';
        removeButton.setAttribute('aria-label', `Remover ${typeLabel}`);
        removeButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        `;
        removeButton.addEventListener('click', () => window.removerCarga(index));
        li.append(editButton, removeButton);
        els.listaCargas.appendChild(li);
    });
}

function atualizarBotaoCarga() {
    els.btnAdicionar.textContent = editingCargaIndex === null ? 'Adicionar Carga' : 'Salvar Alterações';
    els.btnCancelarEdicao.classList.toggle('hidden', editingCargaIndex === null);
}

function cancelarEdicaoCarga() {
    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
}

function editarCarga(index) {
    const carga = composicaoCargas[index];
    if (!carga) return;

    editingCargaIndex = index;
    tipoCargaSelect.value = carga.type;
    tipoCargaSelect.dispatchEvent(new Event('change'));
    inputs.cComp.value = carga.comp;
    inputs.cLarg.value = carga.larg;
    inputs.cAlt.value = carga.alt;
    inputs.cPeso.value = carga.peso;
    inputs.cQtd.value = carga.qtd;
    inputArmador.value = carga.armador || 'generico';
    atualizarBotaoCarga();
    renderListaCargas();
    els.btnAdicionar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.removerCarga = function(index) {
    composicaoCargas.splice(index, 1);
    if (editingCargaIndex === index) {
        editingCargaIndex = null;
        atualizarBotaoCarga();
    } else if (editingCargaIndex !== null && editingCargaIndex > index) {
        editingCargaIndex--;
    }
    renderListaCargas();
    analyzeAndDraw();
}

els.btnAdicionar.addEventListener('click', () => {
    const comp = parseFloat(inputs.cComp.value) || 0.1;
    const larg = parseFloat(inputs.cLarg.value) || 0.1;
    const alt = parseFloat(inputs.cAlt.value) || 0.1;
    const peso = parseFloat(inputs.cPeso.value) || 0;
    const qtd = parseInt(inputs.cQtd.value) || 1; // Quantidade de peças deste bloco
    const type = document.getElementById('input_tipo_carga').value;
    const armador = document.getElementById('input_armador').value;

    const cargaAtualizada = { comp, larg, alt, peso, type, armador, qtd };
    if (editingCargaIndex === null) {
        composicaoCargas.push(cargaAtualizada);
    } else {
        composicaoCargas[editingCargaIndex] = cargaAtualizada;
        editingCargaIndex = null;
        atualizarBotaoCarga();
    }
    
    renderListaCargas();
    analyzeAndDraw();
});

els.btnCancelarEdicao.addEventListener('click', cancelarEdicaoCarga);


function updateTrailerInfo() {
    if (activeCargaTab === 'tubos' && !TUBE_TRAILER_IDS.has(getActiveTrailerId())) {
        inputs.placa_prancha.value = "";
        inputs.placa_carreta.value = "carreta_padrao";
    }
    if (activeCargaTab === 'tubos') setVehicleSelectorTab('carreta');

    inputs.placa_prancha.disabled = activeCargaTab === 'tubos';
    document.getElementById('tube_trailer_rule').classList.toggle('hidden', activeCargaTab !== 'tubos');
    const placa = getActiveTrailerId();
    if(bdVeiculos[placa]) {
        currentTrailer = bdVeiculos[placa];
        tubeInputs.width.value = Math.round((currentTrailer.w_util || currentTrailer.w) * 1000);
        tubeInputs.length.value = getTubeLengthForTrailer(currentTrailer).toFixed(2);
        tubeInputs.trailerCapacity.value = currentTrailer.cap.toFixed(1);
        infos.largura.value = currentTrailer.w.toFixed(2);
        infos.altura.value = currentTrailer.h.toFixed(2);
        infos.mesa.value = currentTrailer.mesa.toFixed(2);
        infos.areaCargaTotal.value = currentTrailer.areaCargaTotal === undefined
            ? "-"
            : currentTrailer.areaCargaTotal.toFixed(2);
        infos.compTotal.value = currentTrailer.compTotal === undefined
            ? "-"
            : currentTrailer.compTotal.toFixed(2);
        
        const isCarreta = currentTrailer.tipo.includes('carreta') || currentTrailer.tipo === 'vanderleia' || currentTrailer.tipo === 'sider';
        if (isCarreta) {
            infos.pescoco.value = "-";
            inputs.posicao.value = "mesa";
            inputs.posicao.disabled = true;
            if(currentTrailer.tipo === 'sider' || currentTrailer.tipo === 'carreta_bau') {
                inputs.tampas.disabled = true;
            } else {
                inputs.tampas.disabled = false;
            }
        } else {
            infos.pescoco.value = currentTrailer.pescoco.toFixed(2);
            inputs.posicao.disabled = false;
            inputs.tampas.disabled = true;
        }
        
        let tipoNome = "Rebaixada";
        if(currentTrailer.tipo === 'reta') tipoNome = "Prancha Reta";
        if(currentTrailer.tipo === 'semi-rebaixada') tipoNome = "Semi-Reta";
        if(currentTrailer.tipo === 'carreta') tipoNome = "Carreta Padrão";
        if(currentTrailer.tipo === 'carreta_ext') tipoNome = "Carreta Extensiva";
        if(currentTrailer.tipo === 'carreta_bau') tipoNome = "Carreta Baú (15m)";
        if(currentTrailer.tipo === 'vanderleia') tipoNome = "Vanderléia";
        if(currentTrailer.tipo === 'sider') tipoNome = "Carreta Sider";
        
        infos.tagTipo.textContent = tipoNome;
        
        if(isCarreta){
            infos.tagTipo.className = "px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded";
        } else {
            infos.tagTipo.className = "px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded";
        }
    }
    analyzeAndDraw();
}

function initThreeJS() {
    const container = document.getElementById('three-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#eef2f6');

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; 

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 150, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10; dirLight.shadow.camera.far = 500;
    const d = 100;
    dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d; dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-100, 50, -100);
    scene.add(fillLight);

    trailerGroup = new THREE.Group();
    scene.add(trailerGroup);
    loadGroup = new THREE.Group();
    scene.add(loadGroup);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000), 
        new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0; 
    plane.receiveShadow = true;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(600, 200, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

function renderTubeResults(tube) {
    const format = (value, digits = 0) => Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
    tubeResults.diameter.textContent = tube.diameterMm > 0 ? `${format(tube.diameterMm, 1)} mm` : '—';
    tubeResults.row.textContent = format(tube.perRow);
    tubeResults.layers.textContent = format(tube.layers);
    tubeResults.capacity.textContent = `${format(tube.maxCapacity)} tubos`;
    tubeResults.loaded.textContent = `${format(tube.loaded)} tubos`;
    tubeResults.height.textContent = `${format(tube.stackHeightMm / 1000, 2)} m`;
    tubeResults.weight.textContent = tube.weightT === null ? 'Não informado' : `${format(tube.weightT, 2)} t`;
    tubeResults.trips.textContent = tube.trips === null ? '—' : format(tube.trips);
    if (tube.trips === null) {
        tubeResults.distribution.textContent = '—';
    } else {
        const fullTrips = Math.floor(tube.totalToTransport / tube.loaded);
        const finalTripLoad = tube.totalToTransport % tube.loaded;
        tubeResults.distribution.textContent = finalTripLoad === 0
            ? `${format(tube.trips)} carretas com ${format(tube.loaded)} tubos cada`
            : `${format(fullTrips)} carretas com ${format(tube.loaded)} tubos e 1 com ${format(finalTripLoad)}`;
    }
}

function renderCargoAnalysisSummary(loadSequence, totalWeight) {
    const format = (value, digits = 0) => Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
    const totalUnits = composicaoCargas.reduce((total, carga) => total + carga.qtd, 0);
    els.cargoSummary.units.textContent = format(totalUnits);
    els.cargoSummary.types.textContent = format(composicaoCargas.length);
    els.cargoSummary.weight.textContent = `${format(totalWeight, 2)} t`;
    els.cargoSummary.length.textContent = `${format(loadSequence.totalComp, 2)} m`;
    els.cargoSummary.items.replaceChildren();
    els.cargoSummary.empty.classList.toggle('hidden', composicaoCargas.length > 0);

    loadSequence.loads.forEach(({ carga }) => {
        const typeLabel = LOAD_TYPES.find(type => type.value === carga.type)?.label || 'Carga';
        const item = document.createElement('li');
        item.className = 'flex justify-between gap-2 border-t border-slate-100 pt-2';
        const description = document.createElement('span');
        description.className = 'font-semibold text-slate-700';
        description.textContent = `${format(carga.qtd)}x ${typeLabel}`;
        const weight = document.createElement('span');
        weight.className = 'shrink-0 text-slate-500';
        weight.textContent = `${format(carga.peso * carga.qtd, 2)} t`;
        item.append(description, weight);
        els.cargoSummary.items.appendChild(item);
    });
}

function analyzeTubesAndDraw(tr, isCarreta) {
    const tube = getTubeMetrics(tr);
    renderTubeResults(tube);

    const floorHeight = tr.tipo === 'reta' || (!isCarreta && inputs.posicao.value === 'pescoco')
        ? 1.6
        : tr.h;
    const totalHeight = floorHeight + tube.stackHeightMm / 1000;
    const excessWidth = Math.max(0, (tube.widthOccupiedMm / 1000 - tr.w) / 2);
    const lengthUsage = tube.tubeLengthM;
    const lengthPercent = tr.mesa > 0 ? lengthUsage / tr.mesa * 100 : 0;
    const weightPercent = tube.trailerCapacityT > 0 && tube.weightT !== null
        ? tube.weightT / tube.trailerCapacityT * 100
        : 0;
    const hardLimitExceeded = totalHeight > 4.4 ||
        (tube.weightT !== null && tube.weightT > tube.trailerCapacityT) ||
        tube.widthOccupiedMm / 1000 > tr.w;
    const operationalWarning = tube.loaded === 0 ||
        tube.requestedLoad > tube.maxCapacity ||
        tube.tubeLengthM > tr.mesa ||
        tube.weightT === null ||
        tube.warnings.length > 0;

    els.resAltTotal.textContent = totalHeight.toFixed(2);
    els.avisoAlt.textContent = totalHeight > 4.4 ? 'Excesso de altura!' : 'Altura total da carreta + tubos';
    els.avisoAlt.className = `text-[10px] mt-1 font-semibold ${totalHeight > 4.4 ? 'text-red-600' : 'text-slate-500'}`;
    els.resExcLat.textContent = excessWidth.toFixed(2);
    els.resCompTotal.textContent = `de ${tr.mesa.toFixed(2)}m (carroceria)`;
    els.resCompUso.textContent = `${lengthUsage.toFixed(2)}m usados`;
    els.barComp.style.width = `${Math.min(100, lengthPercent)}%`;
    els.barComp.className = `h-full transition-all duration-500 ${lengthPercent > 100 ? 'bg-red-500' : 'bg-blue-500'}`;
    els.resCompUso.className = `text-[10px] font-bold ${lengthPercent > 100 ? 'text-red-600' : 'text-blue-700'}`;
    els.resPesoTotal.textContent = `de ${tube.trailerCapacityT.toFixed(1)}t`;
    els.resPesoUso.textContent = tube.weightT === null ? 'Peso não informado' : `${tube.weightT.toFixed(2)}t total`;
    els.barPeso.style.width = `${Math.min(100, weightPercent)}%`;
    els.barPeso.className = `h-full transition-all duration-500 ${weightPercent > 100 ? 'bg-red-500' : 'bg-emerald-500'}`;
    els.resPesoUso.className = `text-[10px] font-bold ${weightPercent > 100 ? 'text-red-600' : 'text-emerald-700'}`;

    if (tube.loaded === 0) {
        els.titleAet.textContent = 'SEM TUBOS NA CONFIGURAÇÃO';
        els.descAet.textContent = tube.warnings[0] || 'Ajuste os parâmetros para visualizar o arranjo.';
    } else if (hardLimitExceeded) {
        els.titleAet.textContent = 'REVISAR LIMITES DA CARGA';
        els.descAet.textContent = tube.warnings.join(' ') || 'A carga excede um dos limites do veículo.';
    } else if (operationalWarning) {
        els.titleAet.textContent = 'ATENÇÃO OPERACIONAL';
        els.descAet.textContent = tube.warnings.join(' ') ||
            'Informe o peso por tubo para conferir a capacidade de carga.';
    } else {
        els.titleAet.textContent = 'ARRANJO DE TUBOS';
        els.descAet.textContent = 'Dimensões e peso informado dentro dos limites da carreta.';
    }

    const alertClass = hardLimitExceeded
        ? 'bg-red-50 border-red-200 text-red-800'
        : operationalWarning
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-green-50 border-green-200 text-green-800';
    els.alertAet.className = `rounded-md p-4 shadow-sm border transition-colors duration-300 ${alertClass}`;
    els.iconAet.className = `w-5 h-5 ${hardLimitExceeded ? 'text-red-600' : operationalWarning ? 'text-amber-600' : 'text-green-600'}`;

    draw3D(tr, inputs.posicao.value, isCarreta);
    draw2D(tr, inputs.posicao.value, isCarreta);
}

function analyzeAndDraw() {
    const tr = currentTrailer;
    const pos = inputs.posicao.value;
    const isCarreta = tr.tipo.includes('carreta') || tr.tipo === 'vanderleia' || tr.tipo === 'sider';
    if (activeCargaTab === 'tubos') {
        analyzeTubesAndDraw(tr, isCarreta);
        return;
    }
    const usesGates = isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
    const availableWidth = usesGates ? tr.w_util : tr.w;
    let espacoDisponivel = pos === 'mesa' || isCarreta ? tr.mesa : tr.pescoco;
    if (tr.tipo === 'reta') espacoDisponivel = tr.mesa; 

    // Consolida dados da composição considerando GRIDS de quantidade
    let pesoTotal = 0;
    let totalLargMax = 0;
    let maxAlt = 0;
    const loadSequence = getLoadSequenceMetrics(tr, isCarreta);
    const compTotalUsado = loadSequence.totalComp;

    loadSequence.loads.forEach(({ carga, grid }) => {
        
        pesoTotal += (carga.peso * carga.qtd);
        if (grid.totalLarg > totalLargMax) totalLargMax = grid.totalLarg;
        if (carga.alt > maxAlt) maxAlt = carga.alt;
    });
    renderCargoAnalysisSummary(loadSequence, pesoTotal);

    let reqAET = false;
    let aetMotivo = "";
    let alertClass = "bg-green-50 border-green-200 text-green-800";
    let iconColor = "text-green-600";
    
    if (totalLargMax > tr.w) { 
        reqAET = true;
        aetMotivo = `Um ou mais blocos de carga (${totalLargMax.toFixed(2)}m) excedem a largura do veículo (${tr.w.toFixed(2)}m). `;
        if(totalLargMax > 3.20) aetMotivo += `(Excede limite legal de 3.20m).`;
    } else if (isCarreta && totalLargMax > availableWidth) {
        if(usesGates) {
            aetMotivo = `Atenção: Algum bloco de carga (${totalLargMax.toFixed(2)}m) excede a área útil entre as tampas (${availableWidth.toFixed(2)}m). Mude para "Sem tampas laterais". `;
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    if (pesoTotal > tr.cap) {
        reqAET = true; 
        aetMotivo += aetMotivo ? " E " : "ALERTA: ";
        aetMotivo += `O peso total somado (${pesoTotal.toFixed(2)}t) excede a capacidade do veículo (${tr.cap.toFixed(2)}t).`;
    }

    const areaExcedida = [];
    if (!isCarreta && loadSequence.pescocoComp > tr.pescoco) {
        areaExcedida.push(`pescoço (${loadSequence.pescocoComp.toFixed(2)}m usados de ${tr.pescoco.toFixed(2)}m)`);
    }
    if (loadSequence.mesaComp > tr.mesa) {
        areaExcedida.push(`mesa/berço (${loadSequence.mesaComp.toFixed(2)}m usados de ${tr.mesa.toFixed(2)}m)`);
    }
    if (areaExcedida.length) {
        aetMotivo += aetMotivo ? " " : "";
        aetMotivo += `Atenção: a carga excede a capacidade da área: ${areaExcedida.join(', ')}.`;
        if (!reqAET) {
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    const pH = 1.60; 
    let baseH = tr.h; 
    if (tr.tipo === 'reta' || (!isCarreta && pos === 'pescoco')) {
        baseH = pH;
    }
    
    const altTotal = baseH + maxAlt; 
    els.resAltTotal.textContent = altTotal.toFixed(2);
    
    if (altTotal > 4.40) {
        reqAET = true;
        aetMotivo += aetMotivo ? " E a " : "A ";
        aetMotivo += `altura total máxima (${altTotal.toFixed(2)}m) excede 4.40m.`;
        els.avisoAlt.textContent = "Excesso de Altura!";
        els.avisoAlt.className = "text-[10px] mt-1 font-bold text-red-600";
    } else {
        els.avisoAlt.textContent = "Dentro do gabarito (4.40m)";
        els.avisoAlt.className = "text-[10px] mt-1 font-semibold text-green-600";
    }

    if (composicaoCargas.length === 0) {
        els.titleAet.textContent = "CARRETA VAZIA"; 
        els.descAet.textContent = "Adicione itens na composição de carga.";
        alertClass = "bg-slate-50 border-slate-200 text-slate-800";
        iconColor = "text-slate-500";
    } else if (reqAET) {
        alertClass = "bg-red-50 border-red-200 text-red-800"; iconColor = "text-red-600";
        els.titleAet.textContent = "AET OBRIGATÓRIA"; 
        els.descAet.textContent = aetMotivo;
    } else if (!reqAET && aetMotivo !== "") {
        els.titleAet.textContent = "ATENÇÃO OPERACIONAL"; 
        els.descAet.textContent = aetMotivo;
    } else {
        els.titleAet.textContent = "CARGA NORMAL"; 
        els.descAet.textContent = "Dimensões e pesos totais dentro dos limites.";
    }
    els.alertAet.className = `rounded-md p-4 shadow-sm border transition-colors duration-300 ${alertClass}`;
    els.iconAet.className = `w-5 h-5 ${iconColor}`;

    let excesso = (totalLargMax - tr.w) / 2;
    if (excesso <= 0) {
        els.resExcLat.textContent = "0.00";
        document.getElementById('icon_excesso_lat').classList.replace('bg-red-100', 'bg-slate-100');
        document.getElementById('icon_excesso_lat').classList.replace('text-red-600', 'text-slate-400');
    } else {
        els.resExcLat.textContent = excesso.toFixed(2);
        document.getElementById('icon_excesso_lat').classList.replace('bg-slate-100', 'bg-red-100');
        document.getElementById('icon_excesso_lat').classList.replace('text-slate-400', 'text-red-600');
    }

    let pctUso = (compTotalUsado / espacoDisponivel) * 100;
    els.resCompTotal.textContent = `de ${espacoDisponivel.toFixed(2)}m (${isCarreta ? 'carroceria' : pos})`;
    els.resCompUso.textContent = `${compTotalUsado.toFixed(2)}m usados`;
    
    if (pctUso > 100) {
        els.barComp.style.width = '100%'; els.barComp.className = "h-full bg-red-500 transition-all duration-500";
        els.resCompUso.className = "text-[10px] font-bold text-red-600";
        els.resCompUso.textContent = `${compTotalUsado.toFixed(2)}m (EXCESSO TRAS.)`;
    } else {
        els.barComp.style.width = `${pctUso}%`; els.barComp.className = "h-full bg-blue-500 transition-all duration-500";
        els.resCompUso.className = "text-[10px] font-bold text-blue-700";
    }

    let pctPeso = (pesoTotal / tr.cap) * 100;
    els.resPesoTotal.textContent = `de ${tr.cap.toFixed(1)}t`;
    els.resPesoUso.textContent = `${pesoTotal.toFixed(2)}t total`;
    if (pctPeso > 100) {
        els.barPeso.style.width = '100%'; els.barPeso.className = "h-full bg-red-500 transition-all duration-500";
        els.resPesoUso.className = "text-[10px] font-bold text-red-600";
        els.resPesoUso.textContent = `${pesoTotal.toFixed(2)}t (EXCESSO)`;
    } else {
        els.barPeso.style.width = `${pctPeso}%`; els.barPeso.className = "h-full bg-emerald-500 transition-all duration-500";
        els.resPesoUso.className = "text-[10px] font-bold text-emerald-700";
    }

    draw3D(tr, pos, isCarreta);
    draw2D(tr, pos, isCarreta);
}

// --- Desenho 3D ---
function draw3D(tr, pos, isCarreta) {
    const drawRevision = ++draw3DRevision;
    const clearGroup = (group) => {
        while (group.children.length) {
            const obj = group.children.pop();
            obj.traverse?.(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    (Array.isArray(child.material) ? child.material : [child.material]).forEach(m => m.dispose());
                }
            });
        }
    };
    clearGroup(trailerGroup);
    clearGroup(loadGroup);

    const S = 3;
    const mat = (color, roughness=0.9, metalness=0.0) => new THREE.MeshStandardMaterial({color: color, roughness: roughness, metalness: metalness});
    const matTransp = (color, opacity=0.85) => new THREE.MeshStandardMaterial({color, roughness: 0.9, transparent: true, opacity, side: THREE.DoubleSide});
    
    const blue = mat(0x0056b3);
    const blueDark = mat(0x004085);
    const blueTampas = mat(0x0056b3);
    const white = mat(0xf8fafc);
    const deckBase = mat(0x929ca6,0.62,0.32);
    const glass = mat(0x0a0a0a);
    const rubber = mat(0x111111);
    const rim = mat(0x475569);
    const frame = mat(0x0f172a);
    const steel = mat(0x1e293b);
    const wood = mat(0xd4a373);
    const siderMat = matTransp(0x1e293b, 0.88);
    siderMat.depthWrite = false;
    
    // Novos materiais detalhados para Carretas
    const bumperRed = mat(0xdc2626);
    const bumperWhite = mat(0xf8fafc);
    const mudflapMat = mat(0x111111);
    
    const createCorrugatedTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = '#1e293b';
        for(let i=0; i<128; i+=16) {
            ctx.fillRect(0, i, 128, 12);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 4);
        return tex;
    };
    
    const corrugatedMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.8,
        bumpMap: createCorrugatedTexture(),
        bumpScale: 0.03
    });
    const carretaBauMat = new THREE.MeshStandardMaterial({
        color: 0x0d4b70,
        roughness: 0.72,
        metalness: 0.08,
        bumpMap: createCorrugatedTexture(),
        bumpScale: 0.03
    });

    function mesh(geometry, material, x, y, z, group=trailerGroup, cast=true) {
        const m = new THREE.Mesh(geometry, material);
        m.position.set(x,y,z);
        m.castShadow = cast;
        m.receiveShadow = true;
        group.add(m);
        return m;
    }
    
    function drawStripedBumper(w, h, d, x, y, z, segments=6, group=trailerGroup) {
        const segW = w / segments;
        const startX = x - w/2 + segW/2;
        for(let i=0; i<segments; i++) {
            const mat = i % 2 === 0 ? bumperRed : bumperWhite;
            box(segW, h, d, mat, startX + (i*segW), y, z, group);
        }
    }

    function drawTrailerRearDetails(width,deckY,rearZ) {
        const bumperY = deckY-0.38*S;
        box(width*0.92,0.19*S,0.08*S,frame,0,bumperY,rearZ-0.045*S);
        drawStripedBumper(width*0.9,0.14*S,0.035*S,0,bumperY,rearZ-0.11*S,16);

        [-1,1].forEach(side=>{
            const lightX=side*width*0.39;
            box(0.3*S,0.24*S,0.05*S,frame,lightX,deckY-0.16*S,rearZ-0.075*S);
            box(0.2*S,0.11*S,0.025*S,bumperRed,lightX,deckY-0.13*S,rearZ-0.11*S);
            box(0.2*S,0.045*S,0.025*S,bumperWhite,lightX,deckY-0.21*S,rearZ-0.11*S);
        });

        box(0.56*S,0.24*S,0.045*S,frame,0,deckY-0.16*S,rearZ-0.08*S);
        box(0.48*S,0.17*S,0.025*S,bumperWhite,0,deckY-0.16*S,rearZ-0.11*S);
    }

    function box(w, h, d, material, x, y, z, group=trailerGroup, bevel=false) {
        if (!bevel) {
            return mesh(new THREE.BoxGeometry(Math.max(.02,w), Math.max(.02,h), Math.max(.02,d)), material, x, y, z, group);
        }
        const shape = new THREE.Shape();
        const r = 0.08 * S; 
        shape.moveTo(-w/2 + r, -h/2);
        shape.lineTo(w/2 - r, -h/2);
        shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
        shape.lineTo(w/2, h/2 - r);
        shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
        shape.lineTo(-w/2 + r, h/2);
        shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
        shape.lineTo(-w/2, -h/2 + r);
        shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

        const extrudeSettings = { depth: d, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02*S, bevelThickness: 0.02*S };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); 
        return mesh(geom, material, x, y, z, group);
    }
    
    function wheel(x,y,z,r=.48,width=.34,group=trailerGroup, connectAxle=true) {
        const tire = mesh(new THREE.CylinderGeometry(r, r, width, 32, 1), rubber, x, y, z, group);
        tire.rotation.z = Math.PI/2;
        
        const hubR = r * 0.55;
        const hub = mesh(new THREE.CylinderGeometry(hubR, hubR, width*1.02, 24), rim, x, y, z, group);
        hub.rotation.z = Math.PI/2;
        
        const centerCap = mesh(new THREE.CylinderGeometry(r*.2, r*.2, width*1.06, 16), steel, x, y, z, group);
        centerCap.rotation.z = Math.PI/2;
        
        const boltR = 0.04 * S;
        const boltDist = hubR * 0.65;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bx = x > 0 ? x + (width/2 * 1.04) : x - (width/2 * 1.04);
            const by = y + Math.cos(angle) * boltDist;
            const bz = z + Math.sin(angle) * boltDist;
            const bolt = mesh(new THREE.CylinderGeometry(boltR, boltR, 0.04*S, 6), steel, bx, by, bz, group);
            bolt.rotation.z = Math.PI/2;
        }
        
        if (connectAxle && x > 0) {
            const axleLen = (Math.abs(x) * 2) - width;
            const axle = mesh(new THREE.CylinderGeometry(0.12*S, 0.12*S, axleLen, 16), frame, 0, y, z, group);
            axle.rotation.z = Math.PI/2;
        }
        return tire;
    }

    function drawDeckDetails(width,length,centerZ,topY,includeStructure=true) {
        if (includeStructure) {
            const sideBeam = mat(0x26384e,0.48,0.62);
            const crossBeam = mat(0x334155,0.5,0.58);
            const plankCount = 10;
            const plankWidth = width*0.9/plankCount;
            const plankLength = length*0.975;

            box(width*0.98,0.12*S,length*0.98,sideBeam,0,topY-0.18*S,centerZ);
            [-1,1].forEach(side=>{
                box(0.12*S,0.2*S,length,sideBeam,side*(width/2-0.08*S),topY-0.08*S,centerZ);
            });

            for(let i=0;i<plankCount;i++){
                const x = -width*0.45+plankWidth*(i+0.5);
                box(plankWidth*0.97,0.035*S,plankLength,wood,x,topY+0.018*S,centerZ);
            }

            const beamCount = Math.max(4,Math.min(18,Math.ceil(length/(0.55*S))));
            for(let i=0;i<=beamCount;i++){
                const z = centerZ-length/2+length*i/beamCount;
                box(width*1.04,0.1*S,0.1*S,crossBeam,0,topY-0.23*S,z);
            }
        } else {
            const plankCount = 10;
            const plankWidth = width*0.9/plankCount;
            for(let i=0;i<plankCount;i++){
                const x = -width*0.45+plankWidth*(i+0.5);
                box(plankWidth*0.98,0.035*S,length*0.975,wood,x,topY+0.025*S,centerZ);
            }
        }

        const reflectorCount = Math.max(4,Math.min(24,Math.floor(length/(0.55*S))));
        for(let i=0;i<=reflectorCount;i++){
            const z = centerZ-length/2+length*i/reflectorCount;
            [-1,1].forEach(side=>{
                box(0.06*S,0.12*S,0.2*S,i%2===0?bumperWhite:bumperRed,side*(width/2+0.015*S),topY-0.12*S,z);
            });
        }

        const tieDownCount = Math.max(3,Math.floor(length/(1.2*S)));
        for(let i=0;i<=tieDownCount;i++){
            const z = centerZ-length/2+length*i/tieDownCount;
            [-1,1].forEach(side=>{
                box(0.16*S,0.06*S,0.08*S,steel,side*(width/2-0.12*S),topY+0.035*S,z);
                box(0.045*S,0.12*S,0.08*S,steel,side*(width/2-0.12*S),topY+0.08*S,z);
            });
        }
    }

    function drawTrailerSideboardDetails(width,length,deckY,height,thickness,centerZ,includeSides) {
        const railMat = mat(0x64748b,0.42,0.68);
        const postWidth = 0.09*S;
        const railHeight = 0.075*S;
        const railY = [
            deckY+0.12*S,
            deckY+height*0.52,
            deckY+height-railHeight/2
        ];
        const postCount = Math.max(4,Math.ceil(length/(1.6*S)));
        const sideX = width/2-thickness/2;

        if(includeSides){
            [-1,1].forEach(side=>{
                railY.forEach(y=>{
                    box(thickness*1.35,railHeight,length,railMat,side*sideX,y,centerZ);
                });
                for(let i=0;i<=postCount;i++){
                    const z=centerZ-length/2+length*i/postCount;
                    box(postWidth,height,thickness*1.7,railMat,side*sideX,deckY+height/2,z);
                }
            });
        }

        [-1,1].forEach(end=>{
            const z=centerZ+end*(length/2-thickness/2);
            railY.forEach(y=>{
                box(width,railHeight,thickness*1.35,railMat,0,y,z);
            });
            [-1,1].forEach(side=>{
                box(postWidth,height,thickness*1.7,railMat,side*sideX,deckY+height/2,z);
            });
            for(let i=1;i<=3;i++){
                const x=-width/2+width*i/4;
                box(postWidth,height*0.72,thickness*1.5,railMat,x,deckY+height*0.52,z);
            }
        });
    }

    function drawStraightSuspension(width,deckY,length,centerZ,axleY,axlePositions) {
        const chassisMat = mat(0x26384e,0.48,0.62);
        const suspensionMat = mat(0x475569,0.5,0.58);
        const beamOffset = Math.min(width*0.2,0.62*S);
        const beamY = deckY-0.36*S;

        [-1,1].forEach(side=>{
            box(0.22*S,0.26*S,length,chassisMat,side*beamOffset,beamY,centerZ);

            axlePositions.forEach(z=>{
                const hangerHeight = beamY-0.13*S-(axleY+0.12*S);
                box(0.12*S,hangerHeight,0.16*S,suspensionMat,side*beamOffset,axleY+0.12*S+hangerHeight/2,z);
                box(0.14*S,0.06*S,0.9*S,chassisMat,side*beamOffset,axleY+0.22*S,z);
                box(0.12*S,0.05*S,0.78*S,suspensionMat,side*beamOffset,axleY+0.16*S,z);
            });
        });

        axlePositions.forEach(z=>{
            box(beamOffset*2+0.22*S,0.1*S,0.14*S,chassisMat,0,beamY-0.12*S,z);
        });
    }

    function drawRearRamps(width,deckY,rearZ) {
        const rampSteel = mat(0x1e293b,0.46,0.7);
        const rampAccent = mat(0xf59e0b,0.48,0.4);
        const rampHeight = 2.25*S;
        const rampWidth = width*0.27;
        const rampDepth = 0.18*S;
        const rampZ = rearZ-0.16*S;
        const beamWidth = 0.1*S;

        [-1,1].forEach(side=>{
            const centerX = side*width*0.275;
            const leftX = centerX-rampWidth/2+beamWidth/2;
            const rightX = centerX+rampWidth/2-beamWidth/2;
            const rampGroup = new THREE.Group();
            rampGroup.position.set(centerX,deckY,rampZ);
            trailerGroup.add(rampGroup);

            box(beamWidth,rampHeight,rampDepth,rampSteel,leftX-centerX,rampHeight/2,0,rampGroup);
            box(beamWidth,rampHeight,rampDepth,rampSteel,rightX-centerX,rampHeight/2,0,rampGroup);

            const rungCount = 7;
            for(let i=0;i<rungCount;i++){
                const y = 0.22*S+i*(rampHeight-0.34*S)/(rungCount-1);
                box(rampWidth-beamWidth*1.4,0.105*S,rampDepth*1.15,i%2===0?rampAccent:rampSteel,0,y,0,rampGroup);
                box(beamWidth*0.55,0.14*S,rampDepth*1.2,rampAccent,leftX-centerX,y,-0.015*S,rampGroup);
                box(beamWidth*0.55,0.14*S,rampDepth*1.2,rampAccent,rightX-centerX,y,-0.015*S,rampGroup);
            }

            box(rampWidth+0.12*S,0.16*S,rampDepth*1.35,rampSteel,0,0.12*S,0,rampGroup);
            [-1,1].forEach(railSide=>{
                const x = centerX+railSide*(rampWidth/2-beamWidth*0.65);
                const brace = mesh(new THREE.CylinderGeometry(0.045*S,0.045*S,rampHeight*0.55,10),rampAccent,x-centerX,rampHeight*0.32,rampDepth*0.95,rampGroup);
                brace.rotation.x = -0.35;
            });
        });

        box(width*0.88,0.13*S,0.16*S,frame,0,deckY-0.22*S,rearZ-0.42*S);
        drawStripedBumper(width*0.88,0.16*S,0.12*S,0,deckY-0.35*S,rearZ-0.48*S,16);

        [-1,1].forEach(side=>{
            const lightX = side*width*0.39;
            box(0.25*S,0.16*S,0.08*S,bumperRed,lightX,deckY+0.08*S,rearZ-0.5*S);
            box(0.15*S,0.12*S,0.08*S,mat(0xfbbf24),lightX-side*0.2*S,deckY+0.08*S,rearZ-0.5*S);
        });

        const signCanvas = document.createElement('canvas');
        signCanvas.width = 768;
        signCanvas.height = 256;
        const ctx = signCanvas.getContext('2d');
        ctx.fillStyle = '#111827';
        ctx.fillRect(0,0,768,256);
        for(let x=-128;x<896;x+=96){
            ctx.fillStyle='#f97316';
            ctx.beginPath();
            ctx.moveTo(x,0);
            ctx.lineTo(x+42,0);
            ctx.lineTo(x-54,256);
            ctx.lineTo(x-96,256);
            ctx.closePath();
            ctx.fill();
        }
        ctx.fillStyle='#f8fafc';
        ctx.fillRect(95,42,578,76);
        ctx.fillRect(95,138,578,76);
        ctx.fillStyle='#111827';
        ctx.textAlign='left';
        ctx.textBaseline='middle';
        ctx.font='bold 34px Arial';
        ctx.fillText('COMPRIMENTO',112,80);
        ctx.fillText('LARGURA',112,176);
        ctx.textAlign='right';
        ctx.font='bold 38px Arial';
        ctx.fillText(`${tr.mesa.toFixed(2)} m`,650,80);
        ctx.fillText(`${(width/S).toFixed(2)} m`,650,176);

        const signTexture = new THREE.CanvasTexture(signCanvas);
        const signMaterial = new THREE.MeshBasicMaterial({map:signTexture,side:THREE.DoubleSide});
        const signWidth = width*0.78;
        const signHeight = 0.78*S;
        const signY = deckY+1.04*S;
        const signZ = rampZ-rampDepth/2-0.1*S;
        const signBracketZ = signZ+0.05*S;
        const signBracketDepth = 0.12*S;

        [-1,1].forEach(side=>{
            box(0.06*S,0.06*S,signBracketDepth,rampSteel,side*width*0.44,signY-signHeight/2-0.035*S,signBracketZ);
            box(0.06*S,0.06*S,signBracketDepth,rampSteel,side*width*0.44,signY+signHeight/2+0.035*S,signBracketZ);
            box(0.055*S,signHeight+0.14*S,signBracketDepth,rampSteel,side*width*0.44,signY,signBracketZ);
        });
        box(width*0.88,0.06*S,signBracketDepth,rampSteel,0,signY-signHeight/2-0.035*S,signBracketZ);
        box(width*0.88,0.06*S,signBracketDepth,rampSteel,0,signY+signHeight/2+0.035*S,signBracketZ);

        const sign = mesh(new THREE.PlaneGeometry(signWidth,signHeight),signMaterial,0,signY,signZ);
        sign.rotation.y=Math.PI;
    }

    const wT = tr.w*S, hT=tr.h*S, pH=1.58*S;
    let pL=0, mL=tr.mesa*S, bridgeL=3.15*S;
    if(!isCarreta) pL = tr.pescoco*S;
    
    const deckY = (tr.tipo==='reta' || isCarreta) ? pH : hT;
    let rearStart = 0;
    if(isCarreta) {
        rearStart = -mL; 
    } else {
        rearStart = tr.tipo==='reta' ? -pL-mL : -pL-1.0*S-mL;
    }
    const rearEnd = isCarreta || tr.tipo === 'reta' ? rearStart : rearStart-bridgeL;
    
    const shiftZ = 1.5 * S; 
    
    const usesChassisModel = ['carreta_ext', 'carreta', 'sider', 'carreta_bau', 'vanderleia'].includes(tr.tipo);

    function addChassisModel() {
        const axleLayout = getCarretaAxleLayout(tr);
        const fallbackChassis = new THREE.Group();
        const fallbackMaterial = mat(0x26323b, 0.62, 0.52);
        trailerGroup.add(fallbackChassis);

        [-1, 1].forEach(side => {
            box(0.16*S, 0.3*S, mL*0.82, fallbackMaterial,
                side*wT*0.34, deckY-0.42*S, shiftZ-mL/2, fallbackChassis);
        });
        for (let crossmember = 0; crossmember < 7; crossmember++) {
            const z = shiftZ-mL*0.38+crossmember*mL*0.76/6;
            box(wT*0.72, 0.12*S, 0.14*S, fallbackMaterial,
                0, deckY-0.36*S, z, fallbackChassis);
        }
        if (tr.tipo !== 'vanderleia') {
            for (let axle = 0; axle < tr.eixos; axle++) {
                const z = shiftZ-mL+axleLayout.firstFromRear+axle*axleLayout.spacing;
                [-1, 1].forEach(side => {
                    const x = side*(wT/2-0.35*S);
                    wheel(x-side*0.15*S, 0.49*S, z, 0.48*S, 0.28*S, fallbackChassis, false);
                    wheel(x+side*0.15*S, 0.49*S, z, 0.48*S, 0.28*S, fallbackChassis, false);
                });
            }
        }

        const loadChassis = () => loadTrailerChassis().then(source => {
            if (drawRevision !== draw3DRevision) return;

            const chassis = source.clone(true);
            chassis.rotation.y = Math.PI / 2;
            chassis.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(chassis);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const lengthScale = mL / size.z;
            const scaleY = deckY / size.y;
            const widthScale = wT / size.x;

            chassis.scale.set(lengthScale, scaleY, widthScale);
            chassis.position.set(
                -center.x * widthScale,
                -bounds.min.y * scaleY,
                shiftZ - mL/2 - center.z * lengthScale
            );

            chassis.traverse(node => {
                if (!node.isMesh) return;
                node.geometry = node.geometry.clone();
                node.castShadow = true;
                node.receiveShadow = true;

                const materials = Array.isArray(node.material) ? node.material : [node.material];
                const updatedMaterials = materials.map(original => {
                    const material = original.clone();
                    const name = (material.name || '').toLowerCase();
                    const nodeName = (node.name || '').toLowerCase();

                    if (tr.tipo === 'vanderleia' && (/tyre|tire|rubber|rim|hub/.test(name) || /wheel|roda|pneu|eixo/.test(nodeName))) {
                        material.visible = false;
                        node.visible = false;
                        return material;
                    }

                    if (/tyre|tire|rubber/.test(name)) {
                        material.color.setHex(0x151515);
                    } else if (/rim|hub|alum|chrome|mirror/.test(name)) {
                        material.color.setHex(0xc0c0c0);
                    } else if (/glass|signal|reflector|placa/.test(name)) {
                        return material;
                    } else {
                        material.color.setHex(0xf8fafc);
                        material.map = null;
                        if ('metalness' in material) material.metalness = 0.12;
                        if ('roughness' in material) material.roughness = 0.48;
                    }

                    material.needsUpdate = true;
                    return material;
                });
                node.material = Array.isArray(node.material) ? updatedMaterials : updatedMaterials[0];
            });

            if (drawRevision === draw3DRevision) {
                trailerGroup.remove(fallbackChassis);
                fallbackChassis.traverse(node => {
                    if (node.geometry) node.geometry.dispose();
                });
                trailerGroup.add(chassis);
            }
        }).catch(error => console.error('Erro ao carregar o chassi da carreta:', error));

        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(loadChassis, { timeout: 1200 });
        } else {
            window.setTimeout(loadChassis, 200);
        }
    }

    const cabModelId = inputs.cavalinho.value || 'semi_obj';
    let cabFallbackObject = null;
    let cabModelLoaded = false;
    if (cabModelId === 'scania_s_730') {
        loadCabModel('tractor_cab_burnout_3').then(source => {
            if (drawRevision !== draw3DRevision || cabModelLoaded) return;

            cabFallbackObject = source.clone(true);
            cabFallbackObject.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(cabFallbackObject);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            const scaleX = CAB_REFERENCE_SIZE[0] / size.x;
            const scaleY = CAB_REFERENCE_SIZE[1] / size.y;
            const scaleZ = CAB_REFERENCE_SIZE[2] / size.z;
            cabFallbackObject.scale.set(scaleX, scaleY, scaleZ);
            cabFallbackObject.position.set(
                CAB_REFERENCE_CENTER[0] - center.x * scaleX,
                -bounds.min.y * scaleY,
                CAB_REFERENCE_CENTER[2] - center.z * scaleZ
            );
            cabFallbackObject.traverse(node => {
                if (!node.isMesh) return;
                node.castShadow = false;
                node.receiveShadow = false;
            });
            trailerGroup.add(cabFallbackObject);
            frameVehicleView();
        }).catch(error => console.warn('Não foi possível carregar a prévia leve do cavalinho.', error));
    }

    loadCabModel(cabModelId).then(source => {
        if (drawRevision !== draw3DRevision) return;
        cabModelLoaded = true;
        if (cabFallbackObject) {
            trailerGroup.remove(cabFallbackObject);
            cabFallbackObject = null;
        }

        const object = source.clone(true);
        
        if (cabModelId === 'semi_obj') {
            const scale = 0.29 * S;
            object.scale.set(scale, scale, scale);
            object.rotation.y = 0;
            object.position.set(0, 0, 3.5 * S);

            const coresMateriais = {
                aiStandardSurface2SG: 0x60656b,
                aiStandardSurface3SG: 0xe2e8f0,
                aiStandardSurface4SG: 0x60656b,
                blinn1SG: 0xe2e8f0,
                blinn2SG: 0xe2e8f0,
                blinn3SG: 0xe2e8f0,
                fenderplasticSG: 0x222222,
                glassSG: 0x5e8296,
                initialShadingGroup: 0xe2e8f0,
                lambert2SG: 0xe2e8f0,
                lambert3SG: 0x111111,
                lowchromeSG: 0xe2e8f0,
                numplatextSG: 0xffffff,
                phong1SG: 0x60656b,
                phong2SG: 0xe2e8f0,
                phong3SG: 0xe2e8f0
            };
            
            const materiaisPrateados = new Set([
                'aiStandardSurface3SG', 'blinn3SG', 'initialShadingGroup',
                'lambert2SG', 'lowchromeSG', 'numplatextSG', 'phong2SG', 'phong3SG'
            ]);
            
            object.traverse(node => {
                if (!node.isMesh) return;
                node.castShadow = true;
                node.receiveShadow = true;
                
                const materials = Array.isArray(node.material) ? node.material : [node.material];
                const updatedMaterials = materials.map(material => {
                    const newMat = new THREE.MeshStandardMaterial({
                        color: coresMateriais[material.name] ?? 0x0056b3,
                        name: material.name
                    });

                    if (materiaisPrateados.has(material.name)) {
                        newMat.metalness = 0.9;
                        newMat.roughness = 0.2;
                    } else if (material.name === 'glassSG') {
                        newMat.transparent = true;
                        newMat.opacity = 0.6;
                        newMat.metalness = 0.8;
                        newMat.roughness = 0.1;
                    } else if (material.name === 'lambert3SG') {
                        newMat.metalness = 0.0;
                        newMat.roughness = 0.9;
                    } else {
                        newMat.metalness = 0.3;
                        newMat.roughness = 0.4;
                    }
                    return newMat;
                });
                node.material = Array.isArray(node.material) ? updatedMaterials : updatedMaterials[0];
            });
        } else {
            const cabConfig = CAB_MODELS[cabModelId] || {};
            const baseRotY = cabConfig.rotationY !== undefined ? cabConfig.rotationY : 0;
            
            object.rotation.set(0, baseRotY, 0);
            object.updateMatrixWorld(true);
            
            const bounds = new THREE.Box3().setFromObject(object);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            
            const customScale = cabConfig.scale || 1.0;
            const scaleX = cabConfig.uniformScale || (CAB_REFERENCE_SIZE[0] / size.x) * customScale;
            const scaleY = cabConfig.uniformScale || (CAB_REFERENCE_SIZE[1] / size.y) * customScale;
            const scaleZ = cabConfig.uniformScale || (CAB_REFERENCE_SIZE[2] / size.z) * customScale;
            const customOffsetY = cabConfig.offsetY || 0;
            const customOffsetZ = cabConfig.offsetZ || 0;
            
            object.scale.set(scaleX, scaleY, scaleZ);
            object.position.set(
                CAB_REFERENCE_CENTER[0] - center.x * scaleX,
                (cabConfig.alignToGround ? -bounds.min.y * scaleY : CAB_REFERENCE_CENTER[1] - center.y * scaleY) + customOffsetY,
                CAB_REFERENCE_CENTER[2] - center.z * scaleZ + customOffsetZ
            );
            
            object.traverse(node => {
                if (!node.isMesh) return;

                node.castShadow = true;
                node.receiveShadow = true;

                const sourceMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];

                const updatedMaterials = sourceMaterials.map(original => {
                    if (!original) return original;

                    const material = original.clone();
                    const materialName = `${material.name || ''} ${node.name || ''}`.toLowerCase();

                    const isDarkDetail = /glass|window|windshield|tire|tyre|rubber|wheel|pneu|vidro|grill|grille|lamp|headlight|tail.?light|preto|black|chrome|logo|cinza|gray|grey|prata|silver/.test(materialName);

                    if (Array.isArray(cabConfig.grayMeshNames) && cabConfig.grayMeshNames.includes(node.name)) {
                        material.color.setHex(0x747a80);
                        if ('metalness' in material) material.metalness = 0.55;
                        if ('roughness' in material) material.roughness = 0.42;
                    } else if (Array.isArray(cabConfig.whiteMeshNames) && cabConfig.whiteMeshNames.includes(node.name)) {
                        material.color.setHex(0xffffff);
                        material.emissive = new THREE.Color(0xffffff);
                        material.emissiveIntensity = 0.8;
                        if ('metalness' in material) material.metalness = 0.05;
                        if ('roughness' in material) material.roughness = 0.5;
                    } else if (!isDarkDetail) {
                        if (cabConfig.bodyColor !== undefined) {
                            if (material.map) material.map = grayCabTexture(material.map);
                            material.color.setHex(cabConfig.bodyColor);
                            material.emissive = new THREE.Color(0x202020);
                            material.emissiveIntensity = 0.25;
                        } else if (material.map) {
                            material.map = brightenCabTexture(material.map);
                            material.color.lerp(new THREE.Color(0xffffff), 0.45);

                            material.emissive = new THREE.Color(0xffffff);
                            material.emissiveMap = material.map;
                            material.emissiveIntensity = 0.65;
                        } else {
                            material.color.lerp(new THREE.Color(0xffffff), 0.62);
                            material.emissive = new THREE.Color(0x303030);
                            material.emissiveIntensity = 0.55;
                        }

                        if ('roughness' in material) {
                            material.roughness = Math.min(
                                material.roughness ?? 0.7,
                                0.48
                            );
                        }
                        if ('metalness' in material) {
                            material.metalness = Math.max(
                                material.metalness ?? 0,
                                0.16
                            );
                        }
                    } else {
                        if ('roughness' in material) {
                            material.roughness = Math.max(
                                material.roughness ?? 0.65,
                                0.65
                            );
                        }
                    }

                    material.needsUpdate = true;
                    return material;
                });

                node.material = Array.isArray(node.material)
                    ? updatedMaterials
                    : updatedMaterials[0];
            });
        }

        if (drawRevision === draw3DRevision) {
            trailerGroup.add(object);
            frameVehicleView();
        }
    }).catch(error => console.error(`Erro ao carregar o cavalinho ${cabModelId}:`, error));

    const deckMat=usesChassisModel ? white : frame;
    const woodMat=wood;

    if (isCarreta) {
        rearStart += shiftZ;
        const deckCenterZ=-mL/2+shiftZ;
        box(wT,.24*S,mL,usesChassisModel?deckBase:deckMat,0,deckY-.12*S,deckCenterZ);
        box(wT*.94,.045*S,mL*.96,woodMat,0,deckY+.02*S,deckCenterZ);
        drawDeckDetails(wT,mL,deckCenterZ,deckY+0.045*S,!usesChassisModel);
        const axleLayout = getCarretaAxleLayout(tr);
        const startAxleZ = rearStart + axleLayout.firstFromRear*S;
        
        if (usesChassisModel) {
            addChassisModel();
            
            if (tr.tipo === 'vanderleia') {
                const axleY = 0.49*S;
                const rW = 0.48*S;
                const axSpacing = axleLayout.spacing*S;
                
                for(let i=0; i<tr.eixos; i++){
                    const z = startAxleZ + i*axSpacing;
                    [-1,1].forEach(side=>{
                        const x = side*(wT/2 - 0.35*S);
                        wheel(x-side*.15*S, axleY, z, rW, .28*S, trailerGroup, side > 0);
                        wheel(x+side*.15*S, axleY, z, rW, .28*S, trailerGroup, false);

                        if (i === 0) {
                            box(0.55*S, 0.4*S, 0.02*S, mudflapMat, x, axleY - 0.1*S, z - 0.55*S);
                        }
                    });
                }
            }
        } else {
            mesh(new THREE.CylinderGeometry(0.08*S, 0.08*S, 0.3*S, 16), steel, 0, deckY-0.25*S, -0.5*S + shiftZ);

            const lgZ = -1.8 * S + shiftZ;
            box(0.1*S, deckY - 0.2*S, 0.15*S, frame, wT/2 - 0.3*S, (deckY - 0.2*S)/2, lgZ);
            box(0.1*S, deckY - 0.2*S, 0.15*S, frame, -wT/2 + 0.3*S, (deckY - 0.2*S)/2, lgZ);
            box(0.2*S, 0.05*S, 0.2*S, frame, wT/2 - 0.3*S, 0.025*S, lgZ);
            box(0.2*S, 0.05*S, 0.2*S, frame, -wT/2 + 0.3*S, 0.025*S, lgZ);
            box(0.05*S, 0.05*S, 0.2*S, steel, wT/2 - 0.2*S, deckY - 0.6*S, lgZ);

            const axleY = 0.49*S;
            const rW = 0.48*S;
            const axSpacing = axleLayout.spacing*S;
            
            for(let i=0; i<tr.eixos; i++){
                const z = startAxleZ + i*axSpacing;
                [-1,1].forEach(side=>{
                    const x = side*(wT/2 - 0.35*S);
                    wheel(x-side*.15*S, axleY, z, rW, .28*S, trailerGroup, side > 0);
                    wheel(x+side*.15*S, axleY, z, rW, .28*S, trailerGroup, false);

                    if (i === 0) {
                        box(0.55*S, 0.4*S, 0.02*S, mudflapMat, x, axleY - 0.1*S, z - 0.55*S);
                    }
                });
            }
        }
        
        if (!usesChassisModel) {
            const bumperY = deckY - 0.5*S;
            const rearEndZ = rearStart;
            const bumperZ = rearEndZ - 0.1*S;
            
            box(wT*0.9, 0.1*S, 0.05*S, frame, 0, bumperY + 0.1*S, bumperZ); 
            drawStripedBumper(wT*0.9, 0.1*S, 0.05*S, 0, bumperY, bumperZ - 0.04*S, 8); 
            
            box(0.05*S, 0.35*S, 0.05*S, frame, wT*0.3, bumperY + 0.2*S, bumperZ - 0.05*S); 
            box(0.05*S, 0.35*S, 0.05*S, frame, -wT*0.3, bumperY + 0.2*S, bumperZ - 0.05*S);
            
            [-1, 1].forEach(side => {
                const lightX = side * wT * 0.4;
                box(0.28*S, 0.12*S, 0.04*S, bumperRed, lightX, deckY - 0.12*S, bumperZ - 0.04*S);
                box(0.28*S, 0.07*S, 0.04*S, mat(0xf59e0b), lightX, deckY - 0.24*S, bumperZ - 0.04*S);
            });

            const plateY = bumperY + 0.28*S;
            const plateZ = bumperZ - 0.06*S;
            box(0.62*S, 0.36*S, 0.04*S, frame, 0, plateY, plateZ);
            box(0.52*S, 0.26*S, 0.02*S, bumperWhite, 0, plateY, plateZ - 0.03*S);
            
            const startLateral = -1.5*S + shiftZ;
            const endLateral = startAxleZ - 1.2*S;
            const protL = Math.abs(endLateral - startLateral);
            const protZ = (startLateral + endLateral) / 2;

            if (protL > 0) {
                [-1, 1].forEach(side => {
                    const x = side * (wT/2 - 0.05*S);
                    box(0.05*S, 0.05*S, protL, bumperWhite, x, deckY - 0.4*S, protZ);
                    box(0.05*S, 0.05*S, protL, bumperWhite, x, deckY - 0.6*S, protZ);
                    box(0.05*S, 0.25*S, 0.05*S, frame, x, deckY - 0.5*S, protZ - protL/2 + 0.2*S);
                    box(0.05*S, 0.25*S, 0.05*S, frame, x, deckY - 0.5*S, protZ + protL/2 - 0.2*S);
                });
            }
        }
        
        if (tr.tipo === 'sider') {
            const siderH = 2.8*S;
            const centerZ = -mL/2+shiftZ;
            const panelY = deckY+siderH/2;
            [-1,1].forEach(side=>{
                const panel=mesh(
                    new THREE.PlaneGeometry(mL,siderH),
                    siderMat,
                    side*(wT/2+0.05*S),
                    panelY,
                    centerZ,
                    trailerGroup,
                    false
                );
                panel.rotation.y=side*Math.PI/2;
            });
            mesh(
                new THREE.PlaneGeometry(wT,siderH),
                siderMat,
                0,
                panelY,
                shiftZ+0.02*S,
                trailerGroup,
                false
            );
            mesh(
                new THREE.PlaneGeometry(wT,siderH),
                siderMat,
                0,
                panelY,
                rearStart-0.02*S,
                trailerGroup,
                false
            );
            const roof=mesh(
                new THREE.PlaneGeometry(wT,mL),
                siderMat,
                0,
                deckY+siderH,
                centerZ,
                trailerGroup,
                false
            );
            roof.rotation.x=Math.PI/2;
        } else if (tr.tipo === 'carreta_bau') {
            const bodyH = 2.5*S;
            box(wT * 0.98, bodyH, mL, carretaBauMat, 0, deckY + bodyH/2 + 0.005*S, -mL/2 + shiftZ - 0.015*S);
        } else {
            const tampH = 0.80*S; const tampT = 0.03*S;
            const includeSideboards=inputs.tampas.value === 'com';
            
            box(wT, tampH*1.5, tampT, corrugatedMat, 0, deckY + (tampH*1.5)/2, shiftZ -tampT/2);
            box(wT, tampH, tampT, corrugatedMat, 0, deckY + tampH/2, -mL + shiftZ + tampT/2);
            
            if (includeSideboards) {
                [-1,1].forEach(side => {
                    box(tampT, tampH, mL - 2*tampT, corrugatedMat, side*(wT/2 - tampT/2), deckY + tampH/2, -mL/2 + shiftZ);
                });
            }
            drawTrailerSideboardDetails(wT,mL,deckY,tampH,tampT,deckCenterZ,includeSideboards);
        }
        if (usesChassisModel) drawTrailerRearDetails(wT,deckY,rearStart);
    } else {
        const dropL = getDeckTransitionLength(tr)*S;
        
        box(0.15*S, 0.3*S, pL, frame, -0.4*S, pH-0.15*S, -pL/2 + shiftZ);
        box(0.15*S, 0.3*S, pL, frame, 0.4*S, pH-0.15*S, -pL/2 + shiftZ);
        box(wT, 0.1*S, pL, deckMat, 0, pH-0.05*S, -pL/2 + shiftZ);
        box(wT*.9, 0.04*S, pL*.96, woodMat, 0, pH+0.02*S, -pL/2 + shiftZ); 
        drawDeckDetails(wT,pL,-pL/2+shiftZ,pH+0.045*S);
        
        mesh(new THREE.CylinderGeometry(0.08*S, 0.08*S, 0.3*S, 16), steel, 0, pH-0.35*S, -0.5*S + shiftZ); 

        if(tr.tipo==='reta'){
            box(wT, 0.24*S, mL, deckMat, 0, pH-0.12*S, -pL-mL/2 + shiftZ);
            box(wT*.9, 0.045*S, mL*.96, woodMat, 0, pH+0.02*S, -pL-mL/2 + shiftZ);
            drawDeckDetails(wT,mL,-pL-mL/2+shiftZ,pH+0.045*S);
        } else {
            const dy = pH - hT;
            const rampL = Math.hypot(dropL, dy);
            const ramp = box(wT, 0.24*S, rampL, deckMat, 0, (pH+hT)/2 - 0.12*S, -pL - dropL/2 + shiftZ);
            ramp.rotation.x = -Math.atan2(dy, dropL);
            
            box(wT, 0.24*S, mL, deckMat, 0, hT - 0.12*S, -pL - dropL - mL/2 + shiftZ);
            box(wT*.9, 0.045*S, mL*.96, woodMat, 0, hT + 0.02*S, -pL - dropL - mL/2 + shiftZ); 
            drawDeckDetails(wT,mL,-pL-dropL-mL/2+shiftZ,hT+0.045*S);
            
            const rearDrop = 0.8*S;
            const rearDy = 0.2*S; 
            const back = box(wT, 0.24*S, Math.hypot(rearDrop, rearDy), deckMat, 0, hT + rearDy/2 - 0.12*S, -pL - dropL - mL - rearDrop/2 + shiftZ);
            back.rotation.x = -Math.atan2(rearDy, rearDrop);
            
            box(wT, 0.24*S, bridgeL, deckMat, 0, hT + rearDy - 0.12*S, rearEnd + shiftZ + bridgeL/2);
        }
        const axleY=.49*S;
        const axlePositions=[];
        for(let i=0;i<tr.eixos;i++){
            const z = rearEnd + shiftZ + .55*S + i*(Math.min(1.18*S,bridgeL/Math.max(1,tr.eixos)));
            axlePositions.push(z);
            [-1,1].forEach(side=>{
                const x=side*(wT/2-.35*S);
                wheel(x-side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, side > 0);
                wheel(x+side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, false);
            });
        }
        if(tr.tipo==='reta'){
            drawStraightSuspension(wT,pH,pL+mL,(-pL-mL)/2+shiftZ,axleY,axlePositions);
        }

        drawRearRamps(wT,tr.tipo==='reta'?pH:hT+0.2*S,rearEnd+shiftZ);
    }

    // --- RENDERIZAÇÃO DAS CARGAS COMPOSTAS ---
    let loadFrontZ = shiftZ;
    if (pos !== 'pescoco' && !isCarreta) {
        loadFrontZ -= pL + getDeckTransitionLength(tr)*S;
    }
    const loadSequence = activeCargaTab === 'tubos'
        ? { loads: [] }
        : getLoadSequenceMetrics(tr,isCarreta);

    loadSequence.loads.forEach(({ carga, grid, startOffset, mesaStartOffset, pescocoStartOffset, splitCoils }) => {
        const cW = Math.max(.1, carga.larg) * S;
        const cH = Math.max(.1, carga.alt) * S;
        const cL = Math.max(.1, carga.comp) * S;
        
        const loadY = (pos === 'pescoco' || tr.tipo === 'reta' ? pH : (isCarreta ? deckY : hT)) + cH/2;
        const loadZ_start = loadFrontZ-startOffset*S;
        
        // O group base será montado apenas uma vez com o visual do tipo escolhido
        const baseItem = new THREE.Group();
        
        function cargoBox(w,h,d,material,x=0,y=0,z=0){
            return mesh(new THREE.BoxGeometry(Math.max(.04,w),Math.max(.04,h),Math.max(.04,d)),material,x,y,z,baseItem);
        }
        function cylinderAlongZ(radius,length,material,x,y,z,segments=32){
            const c=mesh(new THREE.CylinderGeometry(radius,radius,length,segments),material,x,y,z,baseItem);
            c.rotation.x=Math.PI/2; return c;
        }
        function cylinderAlongX(radius,length,material,x,y,z,segments=32){
            const c=mesh(new THREE.CylinderGeometry(radius,radius,length,segments),material,x,y,z,baseItem);
            c.rotation.z=Math.PI/2; return c;
        }
        function cargoBeam(start,end,thickness,material){
            const startPoint = new THREE.Vector3(...start);
            const endPoint = new THREE.Vector3(...end);
            const direction = endPoint.clone().sub(startPoint);
            const beam = mesh(
                new THREE.BoxGeometry(thickness,thickness,direction.length()),
                material,
                (startPoint.x + endPoint.x)/2,
                (startPoint.y + endPoint.y)/2,
                (startPoint.z + endPoint.z)/2,
                baseItem
            );
            beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), direction.normalize());
            return beam;
        }
        function cargoPanel(points,material){
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
            geometry.setIndex([0,1,2,0,2,3]);
            geometry.computeVertexNormals();
            const panel = new THREE.Mesh(geometry,material);
            panel.castShadow = true;
            panel.receiveShadow = true;
            baseItem.add(panel);
            return panel;
        }
        function buildCage(frameMaterial, accentMaterial, withDiagonals=true){
            const halfW = cW/2;
            const halfH = cH/2;
            const halfL = cL/2;
            const tube = Math.max(0.06*S, Math.min(cW,cH,cL)*0.025);
            const xs = [-halfW,halfW];
            const ys = [-halfH,halfH];
            const zs = [-halfL,halfL];

            ys.forEach(y => xs.forEach(x => cargoBeam([x,y,-halfL],[x,y,halfL],tube,frameMaterial)));
            ys.forEach(y => zs.forEach(z => cargoBeam([-halfW,y,z],[halfW,y,z],tube,frameMaterial)));
            xs.forEach(x => zs.forEach(z => cargoBeam([x,-halfH,z],[x,halfH,z],tube,frameMaterial)));

            if(withDiagonals){
                xs.forEach(x => {
                    cargoBeam([x,-halfH,-halfL],[x,halfH,halfL],tube*0.72,frameMaterial);
                    cargoBeam([x,-halfH,halfL],[x,halfH,-halfL],tube*0.72,frameMaterial);
                });
                zs.forEach(z => {
                    cargoBeam([-halfW,-halfH,z],[halfW,halfH,z],tube*0.72,frameMaterial);
                    cargoBeam([-halfW,halfH,z],[halfW,-halfH,z],tube*0.72,frameMaterial);
                });
            }

            xs.forEach(x => zs.forEach(z => {
                cargoBox(tube*2.1,tube*2.1,tube*2.1,accentMaterial,x,halfH-tube,z);
            }));
        }
        function drawCoil(axis,radius,length,x,y,z){
            const flangeMaterial = mat(0x7f2630,0.48,0.55);
            const cableMaterial = mat(0xb9984b,0.38,0.72);
            const hubMaterial = mat(0x26313b,0.42,0.7);
            const cableRadius = radius*0.67;
            const flangeRadius = radius*1.08;
            const flangeOffset = length*0.43;
            const endPositions = axis === 'x'
                ? [-1,1].map(side => [x + side*flangeOffset,y,z])
                : [-1,1].map(side => [x,y,z + side*flangeOffset]);

            if(axis === 'x'){
                cylinderAlongX(cableRadius,length*0.78,cableMaterial,x,y,z);
            } else {
                cylinderAlongZ(cableRadius,length*0.78,cableMaterial,x,y,z);
            }

            const wraps = 22;
            for(let i=0;i<wraps;i++){
                const along = (i/(wraps-1)-0.5)*length*0.76;
                const ringPosition = axis === 'x' ? [x+along,y,z] : [x,y,z+along];
                const wrap = mesh(
                    new THREE.TorusGeometry(cableRadius,Math.max(0.025*S,radius*0.025),8,32),
                    cableMaterial,...ringPosition,baseItem
                );
                if(axis === 'x') wrap.rotation.y = Math.PI/2;
            }

            endPositions.forEach(position => {
                const flange = mesh(
                    new THREE.TorusGeometry(flangeRadius,Math.max(0.045*S,radius*0.055),10,40),
                    flangeMaterial,...position,baseItem
                );
                if(axis === 'x') flange.rotation.y = Math.PI/2;

                const hub = axis === 'x'
                    ? cylinderAlongX(radius*0.22,length*0.12,hubMaterial,...position)
                    : cylinderAlongZ(radius*0.22,length*0.12,hubMaterial,...position);
                hub.castShadow = true;

                for(let spoke=0;spoke<12;spoke++){
                    const angle = spoke*Math.PI/6;
                    const inner = radius*0.18;
                    const outer = flangeRadius*0.9;
                    const start = axis === 'x'
                        ? [position[0],y+Math.cos(angle)*inner,z+Math.sin(angle)*inner]
                        : [x+Math.cos(angle)*inner,y+Math.sin(angle)*inner,position[2]];
                    const end = axis === 'x'
                        ? [position[0],y+Math.cos(angle)*outer,z+Math.sin(angle)*outer]
                        : [x+Math.cos(angle)*outer,y+Math.sin(angle)*outer,position[2]];
                    cargoBeam(start,end,Math.max(0.035*S,radius*0.035),flangeMaterial);
                }
            });
        }

        const steelLight = mat(0xb0bdc8);
        const navy = mat(0x34495e);
        const orange = mat(0xe67e22);
        const darkOrange = mat(0xd35400);
        const cageSteel = mat(0x273443,0.42,0.68);
        const cageOrange = mat(0xc87812,0.48,0.42);
        const cageAccent = mat(0xb8cc3b,0.4,0.25);
        const equipmentBeige = mat(0xc5a66a,0.62,0.18);
        const equipmentSteel = mat(0x73808b,0.35,0.72);

        if(carga.type.startsWith('bobina_')){
            const coilCount = splitCoils ? 1 : (carga.type.endsWith('_2') ? 2 : 1);
            const axis = carga.type.includes('_lado_') ? 'x' : 'z';
            const sectionLength = splitCoils ? cL/2 : cL/coilCount;
            const radius = Math.max(0.06*S,Math.min(cH,axis === 'x' ? sectionLength : cW)*0.46);
            const supportThickness = cH*0.08;
            const flangeOuterRadius = radius*1.08+Math.max(0.045*S,radius*0.055);
            const coilCenterY = -cH/2+supportThickness+flangeOuterRadius;
            for(let i=0;i<coilCount;i++){
                const centerZ = splitCoils ? 0 : -cL/2 + sectionLength*(i+0.5);
                const coilLength = axis === 'x' ? cW*0.78 : sectionLength*0.78;
                drawCoil(axis,radius,coilLength,0,coilCenterY,centerZ);
            }
            cargoBox(cW*0.84,supportThickness,(splitCoils?sectionLength:cL)*0.92,navy,0,-cH/2+supportThickness/2,0);
        } else if(CONTAINER_LOAD_TYPES.has(carga.type)){
            let contColor = 0x176b87; 
            let logoColor = "#000000";
            
            if (REEFER_LOAD_TYPES.has(carga.type) || carga.type === 'container_insulated_40') contColor = 0xe0e5e8;
            if (carga.armador === 'maersk') { contColor = 0xe0e5e8; } 
            else if (carga.armador === 'msc') { contColor = 0xd6c37f; logoColor = "#111111"; } 
            else if (carga.armador === 'hapag') { contColor = 0xea580c; logoColor = "#001b3a"; } 
            else if (carga.armador === 'evergreen') { contColor = 0x065f32; logoColor = "#ffffff"; } 
            else if (carga.armador === 'cma') { contColor = 0x0f2142; logoColor = "#ffffff"; }

            const contMat = mat(contColor);
            const ribD = 0.035 * S;
            const steelBlue = mat(0x263e5b,0.5,0.45);
            const containerWood = mat(0x92704a,0.78,0.12);
            const doorMat = mat(0x52667a,0.58,0.34);
            const isFlatRack = FLAT_RACK_LOAD_TYPES.has(carga.type);
            const isPlatform = FLAT_PLATFORM_LOAD_TYPES.has(carga.type);
            const isTank = TANK_CONTAINER_LOAD_TYPES.has(carga.type);
            const isSideOpen = SIDE_OPEN_LOAD_TYPES.has(carga.type);
            const isOpenTop = OPEN_TOP_LOAD_TYPES.has(carga.type);
            const isReefer = REEFER_LOAD_TYPES.has(carga.type);
            const isVented = carga.type.startsWith('container_ventilated_');
            const isBulk = carga.type.startsWith('container_bulk_');
            const isDoubleDoor = carga.type.startsWith('container_double_door_');
            const isHardTop = carga.type.startsWith('container_hard_top_');

            if (isFlatRack || isPlatform) {
                cargoBox(cW*0.94,cH*0.07,cL*0.97,steelBlue,0,-cH*0.43,0);
                const plankCount = Math.max(6,Math.min(36,Math.floor(cL/(0.35*S))));
                for(let i=0;i<plankCount;i++){
                    const z=-cL*0.47+(i+0.5)*cL*0.94/plankCount;
                    cargoBox(cW*0.9,cH*0.035,cL*0.94/plankCount*0.92,containerWood,0,-cH*0.38,z);
                }
                if (isFlatRack) {
                    [-1,1].forEach(end=>{
                        cargoBox(cW*0.88,cH*0.74,ribD*2.8,steelBlue,0,cH*0.03,end*cL*0.46);
                        [-1,1].forEach(side=>{
                            cargoBox(ribD*2.8,cH*0.82,ribD*3.2,steelBlue,side*cW*0.44,cH*0.02,end*cL*0.46);
                            for(let row=0;row<8;row++){
                                const y=-cH*0.29+row*cH*0.09;
                                cargoBox(cW*0.83,cH*0.025,ribD*0.7,mat(0x3c5d80),0,y,end*cL*0.46+side*ribD*1.5);
                            }
                        });
                        cargoBox(cW*0.92,ribD*2.8,ribD*3.2,steelBlue,0,cH*0.42,end*cL*0.46);
                    });
                }
                [-1,1].forEach(side=>{
                    cargoBox(cW*0.035,cH*0.1,cL,steelBlue,side*cW*0.47,-cH*0.36,0);
                });
            } else if (isTank) {
                const tankRadius=Math.min(cW*0.34,cH*0.38);
                buildCage(steelBlue,doorMat,false);
                cargoBox(cW*0.9,cH*0.06,cL*0.9,steelBlue,0,-cH*0.46,0);
                cylinderAlongZ(tankRadius,cL*0.78,bumperWhite,0,cH*0.02,0);
                [-1,1].forEach(end=>{
                    const head=mesh(
                        new THREE.SphereGeometry(tankRadius,24,16,0,Math.PI*2,0,Math.PI/2),
                        bumperWhite,0,cH*0.02,end*cL*0.39,baseItem
                    );
                    head.rotation.x=end<0?-Math.PI/2:Math.PI/2;
                });
                cargoBox(tankRadius*0.42,cH*0.14,tankRadius*0.42,steelBlue,0,cH*0.4,0);
            } else {
                const bodyHeight=isSideOpen?cH*0.12:cH;
                cargoBox(cW-2*ribD,bodyHeight,cL,contMat,0,isSideOpen?-cH*0.44:0,0);
                const ribs=Math.max(8,Math.min(64,Math.floor(cL/.22)));
                const ribMat = mat(contColor);

                for(let i=0;i<=ribs;i++){
                    const z=-cL/2+i*cL/ribs;
                    [-1,1].forEach(side=>{
                        if(!isSideOpen || side<0){
                            cargoBox(ribD,cH*.94,.035*S,ribMat,side*(cW/2-ribD/2),isSideOpen?-cH*0.05:0,z);
                        }
                    });
                }
                if(isSideOpen){
                    cargoBox(cW,cH*.94,ribD,contMat,0,0,-cL/2+ribD/2);
                    cargoBox(cW,cH*.94,ribD,contMat,0,0,cL/2-ribD/2);
                    const postCount=Math.max(4,Math.min(16,Math.floor(cL/(0.9*S))));
                    for(let i=0;i<=postCount;i++){
                        const z=-cL/2+i*cL/postCount;
                        cargoBox(ribD,cH*.94,ribD,steelBlue,cW*0.47,cH*0.02,z);
                    }
                    [-1,1].forEach(side=>{
                        const door=cargoBox(cW*0.08,cH*0.82,cL*0.35,contMat,side*cW*0.42,0,side*cL*0.29);
                        door.rotation.y=side*Math.PI/5;
                    });
                }
                if(isVented){
                    for(let row=0;row<5;row++){
                        const y=-cH*0.28+row*cH*0.14;
                        for(let side of [-1,1]){
                            if(!isSideOpen || side<0) cargoBox(ribD*0.5,cH*0.035,cL*0.66,doorMat,side*cW*0.502,y,0);
                        }
                    }
                }

                const roofMat=isHardTop?steelBlue:contMat;
                if(!isOpenTop){
                    cargoBox(cW*.98,.08*S,cL*.98,roofMat,0,cH/2,0);
                }else{
                    cargoBox(cW*.06,.08*S,cL*.98,steelBlue,-cW*.47,cH/2,0);
                    cargoBox(cW*.06,.08*S,cL*.98,steelBlue,cW*.47,cH/2,0);
                    for(let i=0;i<6;i++){
                        const z=-cL*.42+i*cL*.168;
                        cargoBox(cW*.96,.045*S,.035*S,steelBlue,0,cH/2,z);
                    }
                }
                cargoBox(cW*.98,.08*S,cL*.98,containerWood,0,-cH/2,0);

                if(isOpenTop){
                    const tarpMat=mat(0x2563a6,0.86);
                    const tarpGeometry=new THREE.PlaneGeometry(cW,cL,8,24);
                    const positions=tarpGeometry.attributes.position;
                    for(let i=0;i<positions.count;i++){
                        const x=positions.getX(i);
                        positions.setZ(i,0.075*S*(1-Math.pow(2*x/cW,2)));
                    }
                    tarpGeometry.computeVertexNormals();
                    const tarp=mesh(tarpGeometry,tarpMat,0,cH/2+0.08*S,0,baseItem,false);
                    tarp.rotation.x=-Math.PI/2;
                    const strapMat=mat(0x1e293b);
                    for(let i=0;i<5;i++){
                        const z=-cL*0.4+i*cL*0.2;
                        cargoBox(cW*1.01,0.025*S,0.035*S,strapMat,0,cH/2+0.035*S,z);
                    }
                }

                for(let end of [-1,1]){
                    cargoBox(cW*0.96,cH*.94,ribD,doorMat,0,0,end*(cL/2-ribD));
                    for(let i=0;i<5;i++){
                        const x=-cW*0.36+i*cW*0.18;
                        cargoBox(cW*0.025,cH*.86,ribD*1.5,steelBlue,x,0,end*(cL/2+ribD*0.55));
                    }
                    cargoBox(cW*0.9,cH*.045,ribD*1.5,steelBlue,0,cH*0.24,end*(cL/2+ribD*0.55));
                    cargoBox(cW*0.9,cH*.045,ribD*1.5,steelBlue,0,-cH*0.24,end*(cL/2+ribD*0.55));
                    if(isDoubleDoor){
                        cargoBox(cW*0.04,cH*.72,ribD*2.1,bumperWhite,0,0,end*(cL/2+ribD));
                    }
                }

                if(isReefer){
                    cargoBox(cW*.22,cH*.72,cH*.12,bumperWhite,0,0,cL/2+cH*.06);
                    for(let i=0;i<5;i++){
                        cargoBox(cW*.13,cH*.025,cH*.015,steelBlue,0,cH*.18-i*cH*.07,cL/2+cH*.13);
                    }
                    for(let side of [-1,1]){
                        cargoBox(cW*.22,cH*.025,cL*.42,doorMat,side*cW*.503,cH*.2,0);
                        cargoBox(cW*.22,cH*.025,cL*.42,doorMat,side*cW*.503,cH*.28,0);
                    }
                }

                if(isBulk){
                    const hatchCount=cL>20?4:2;
                    for(let i=0;i<hatchCount;i++){
                        const z=-cL*.33+i*cL*.66/Math.max(1,hatchCount-1);
                        cargoBox(cW*.3,.1*S,cW*.24,steelBlue,0,cH/2+.06*S,z);
                        cargoBox(cW*.16,.16*S,cW*.12,doorMat,0,cH/2+.17*S,z);
                    }
                }
            }

            if (carga.armador !== 'generico' && !isFlatRack && !isPlatform && !isTank) {
                const canvas = document.createElement('canvas');
                canvas.width = 1024; canvas.height = 256;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = logoColor;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                
                if (carga.armador === 'maersk') {
                    ctx.font = 'bold 120px "Arial Black", sans-serif';
                    ctx.fillText('MAERSK', 512 + 100, 128);
                    ctx.fillStyle = '#4099d4'; ctx.fillRect(80, 40, 160, 160);
                    ctx.fillStyle = 'white'; ctx.beginPath();
                    const cx = 160, cy = 120, outer = 70, inner = 32, p = 7;
                    for(let i = 0; i < p * 2; i++) {
                        const a = (i * Math.PI / p) - Math.PI/2;
                        const r = (i % 2 === 0) ? outer : inner;
                        ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
                    }
                    ctx.closePath(); ctx.fill();
                } else if (carga.armador === 'msc') {
                    ctx.font = 'bold 180px "Impact", sans-serif'; ctx.fillText('msc', 512, 128);
                } else if (carga.armador === 'hapag') {
                    ctx.font = 'bold 120px "Arial", sans-serif'; ctx.fillText('Hapag-Lloyd', 512 + 100, 128);
                    ctx.fillStyle = '#00539c'; ctx.fillRect(80, 50, 120, 156);
                } else if (carga.armador === 'evergreen') {
                    ctx.font = 'bold 120px "Arial Black", sans-serif'; ctx.fillText('EVERGREEN', 512, 128);
                } else if (carga.armador === 'cma') {
                    ctx.font = 'bold 120px "Arial Black", sans-serif'; ctx.fillText('CMA CGM', 512, 128);
                }

                const tex = new THREE.CanvasTexture(canvas);
                tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                const logoMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
                
                const logoW = cL * 0.8;
                const logoH = logoW * (256/1024);
                const planeGeom = new THREE.PlaneGeometry(logoW, logoH);
                
                const p1 = new THREE.Mesh(planeGeom, logoMat);
                p1.position.set(cW/2 + 0.05, 0, 0); p1.rotation.y = Math.PI / 2; baseItem.add(p1);

                const p2 = new THREE.Mesh(planeGeom, logoMat);
                p2.position.set(-cW/2 - 0.05, 0, 0); p2.rotation.y = -Math.PI / 2; baseItem.add(p2);
            }
        } else if(carga.type==='palete_caixas'){
            const wood = mat(0x795334,0.82,0.24);
            const cardboard = mat(0xb99055,0.9,0.08);
            const tape = mat(0x6f4c27,0.8,0.2);
            const palletH = cH*0.12;
            const boxH = cH*0.82;

            for(let i=0;i<5;i++){
                const boardW = cW/5;
                cargoBox(boardW*0.94,palletH*0.28,cL*0.96,wood,-cW/2+boardW*(i+0.5),-cH/2+palletH*0.86,0);
            }
            for(let i=0;i<3;i++){
                cargoBox(cW*0.12,palletH*0.58,cL*0.92,wood,-cW*0.38+i*cW*0.38,-cH/2+palletH*0.34,0);
            }
            for(let row=0;row<2;row++){
                for(let col=0;col<2;col++){
                    const boxW = cW*0.48;
                    const boxL = cL*0.48;
                    const boxX = (col===0 ? -1 : 1)*cW*0.25;
                    const boxZ = (row===0 ? -1 : 1)*cL*0.25;
                    const boxY = -cH/2+palletH+boxH/2;
                    cargoBox(boxW,boxH,boxL,cardboard,boxX,boxY,boxZ);
                    cargoBox(boxW*0.035,boxH*1.01,boxL*0.035,tape,boxX,boxY,boxZ);
                    cargoBox(boxW*0.9,boxH*0.025,boxL*0.035,tape,boxX,boxY+boxH*0.49,boxZ);
                }
            }
        } else if(carga.type==='caixa_metalica'){
            const blue = mat(0x174a9a,0.42,0.58);
            const yellow = mat(0xd8d52c,0.52,0.4);
            const rib = Math.max(0.035*S,Math.min(cW,cH,cL)*0.018);
            cargoBox(cW*0.94,cH*0.88,cL*0.94,blue,0,0,0);
            cargoBox(cW,cH*0.06,cL,blue,0,cH*0.47,0);
            [-1,1].forEach(side=>{
                cargoBox(rib,cH*0.9,cL*0.94,blue,side*cW*0.48,0,0);
                for(let i=1;i<5;i++){
                    cargoBox(rib*0.85,cH*0.82,rib*1.4,blue,side*cW*0.49,0,-cL*0.4+i*cL*0.2);
                }
            });
            [-1,1].forEach(xSide=>[-1,1].forEach(zSide=>{
                cargoBox(cW*0.1,cH,cL*0.1,yellow,xSide*cW*0.45,0,zSide*cL*0.45);
                cargoBox(cW*0.12,cH*0.08,cL*0.12,yellow,xSide*cW*0.44,cH*0.46,zSide*cL*0.44);
            }));
            cargoBox(cW*0.94,cH*0.08,cL*0.94,blue,0,-cH*0.46,0);
        } else if(carga.type==='cesta_metalica'){
            const basketSteel = new THREE.MeshStandardMaterial({
                color: 0x9ca3af,
                roughness: 0.5,
                metalness: 0.48,
                side: THREE.DoubleSide
            });
            const basketFloor = mat(0x414d57,0.62,0.58);
            const tube = Math.max(0.04*S,Math.min(cW,cH,cL)*0.022);
            const halfW = cW*0.48;
            const halfH = cH*0.46;
            const halfL = cL*0.48;
            const floorY = -halfH+tube;

            cargoBox(cW*0.94,tube*2,cL*0.94,basketFloor,0,-halfH+tube,0);
            cargoPanel([[-halfW,floorY,-halfL],[halfW,floorY,-halfL],[halfW,halfH,-halfL],[-halfW,halfH,-halfL]],basketSteel);
            cargoPanel([[halfW,floorY,halfL],[-halfW,floorY,halfL],[-halfW,halfH,halfL],[halfW,halfH,halfL]],basketSteel);
            cargoPanel([[-halfW,floorY,halfL],[-halfW,floorY,-halfL],[-halfW,halfH,-halfL],[-halfW,halfH,halfL]],basketSteel);
            cargoPanel([[halfW,floorY,-halfL],[halfW,floorY,halfL],[halfW,halfH,halfL],[halfW,halfH,-halfL]],basketSteel);

            [-1,1].forEach(xSide=>[-1,1].forEach(zSide=>{
                cargoBeam([xSide*halfW,floorY,zSide*halfL],[xSide*halfW,halfH,zSide*halfL],tube*1.8,basketSteel);
            }));
            [-1,1].forEach(ySide=>{
                const y = ySide===1 ? halfH : floorY;
                cargoBeam([-halfW,y,-halfL],[halfW,y,-halfL],tube*1.5,basketSteel);
                cargoBeam([-halfW,y,halfL],[halfW,y,halfL],tube*1.5,basketSteel);
                cargoBeam([-halfW,y,-halfL],[-halfW,y,halfL],tube*1.5,basketSteel);
                cargoBeam([halfW,y,-halfL],[halfW,y,halfL],tube*1.5,basketSteel);
            });
            for(let i=1;i<5;i++){
                const x = -halfW+i*(halfW*2/5);
                const z = -halfL+i*(halfL*2/5);
                cargoBeam([x,floorY,-halfL],[x,halfH,-halfL],tube*0.65,basketFloor);
                cargoBeam([x,floorY,halfL],[x,halfH,halfL],tube*0.65,basketFloor);
                cargoBeam([-halfW,floorY,z],[-halfW,halfH,z],tube*0.65,basketFloor);
                cargoBeam([halfW,floorY,z],[halfW,halfH,z],tube*0.65,basketFloor);
            }
        } else if(carga.type==='cacamba_vazia' || carga.type==='cacamba_cheia'){
            const orangeBody = mat(0xe87516,0.58,0.38);
            const darkBody = mat(0x26384e,0.68,0.32);
            const bodyY = cH*0.24;
            const bottomY = -cH*0.48;
            const topW = cW*0.49;
            const bottomW = cW*0.34;
            const topL = cL*0.48;
            const bottomL = cL*0.34;
            const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xe87516, metalness: 0.58, roughness: 0.38, side: THREE.DoubleSide });
            const panelPoints = [
                [[-topW,bodyY,-topL],[topW,bodyY,-topL],[bottomW,bottomY,-bottomL],[-bottomW,bottomY,-bottomL]],
                [[topW,bodyY,topL],[-topW,bodyY,topL],[-bottomW,bottomY,bottomL],[bottomW,bottomY,bottomL]],
                [[-topW,bodyY,topL],[-topW,bodyY,-topL],[-bottomW,bottomY,-bottomL],[-bottomW,bottomY,bottomL]],
                [[topW,bodyY,-topL],[topW,bodyY,topL],[bottomW,bottomY,bottomL],[bottomW,bottomY,-bottomL]]
            ];
            panelPoints.forEach(points=>cargoPanel(points,panelMaterial));
            cargoBox(bottomW*2,cH*0.04,bottomL*2,darkBody,0,bottomY+cH*0.02,0);
            const rim = Math.max(0.06*S,Math.min(cW,cL)*0.025);
            cargoBeam([-topW,bodyY,-topL],[topW,bodyY,-topL],rim,orangeBody);
            cargoBeam([-topW,bodyY,topL],[topW,bodyY,topL],rim,orangeBody);
            cargoBeam([-topW,bodyY,-topL],[-topW,bodyY,topL],rim,orangeBody);
            cargoBeam([topW,bodyY,-topL],[topW,bodyY,topL],rim,orangeBody);
            [-1,1].forEach(side=>{
                for(let i=1;i<4;i++){
                    const z = -topL+i*(topL*2/4);
                    cargoBeam([side*topW,bodyY*0.94,z],[side*bottomW,bottomY*0.96,z*bottomL/topL],rim*0.75,darkBody);
                }
            });
            cargoBox(cW*0.76,cH*0.06,cL*0.72,darkBody,0,-cH*0.45,0);

            if(carga.type==='cacamba_cheia'){
                const fillMaterial = mat(0x6f6253,0.95,0.05);
                const fill = mesh(new THREE.SphereGeometry(1,20,14),fillMaterial,0,cH*0.28,0,baseItem);
                fill.scale.set(cW*0.38,cH*0.2,cL*0.37);
                const rockColors = [0x77736b,0x9b9285,0x5c5b58,0xb0a391];
                for(let i=0;i<24;i++){
                    const col = i%6;
                    const row = Math.floor(i/6);
                    const rockSize = Math.min(cW,cL,cH)*(.045+(i%3)*.008);
                    const rock = mesh(
                        new THREE.IcosahedronGeometry(rockSize,0),
                        mat(rockColors[i%rockColors.length],0.92,0.04),
                        -cW*0.32+col*cW*0.128,
                        cH*(0.29+(i%4)*0.035),
                        -cL*0.3+row*cL*0.19,
                        baseItem
                    );
                    rock.rotation.set(i*0.61,i*0.83,i*0.37);
                    rock.scale.set(1.25,0.8,1.1);
                }
            }
        } else if(carga.type==='skid_cilindros'){
            const skidSteel = mat(0x56636d,0.48,0.68);
            const cylinderBlue = mat(0x123f9a,0.38,0.68);
            const cylinderDark = mat(0x0b2b65,0.48,0.62);
            const baseH = cH*0.09;
            const frameTube = Math.max(0.045*S,Math.min(cW,cH,cL)*0.02);
            cargoBox(cW*0.94,baseH,cL*0.94,skidSteel,0,-cH*0.455,0);
            const halfW = cW*0.47;
            const halfL = cL*0.47;
            [-1,1].forEach(xSide=>[-1,1].forEach(zSide=>{
                cargoBeam([xSide*halfW,-cH*0.41,zSide*halfL],[xSide*halfW,cH*0.44,zSide*halfL],frameTube*1.5,skidSteel);
            }));
            [-1,1].forEach(ySide=>{
                const y = ySide*cH*0.44;
                cargoBeam([-halfW,y,-halfL],[halfW,y,-halfL],frameTube,skidSteel);
                cargoBeam([-halfW,y,halfL],[halfW,y,halfL],frameTube,skidSteel);
                cargoBeam([-halfW,y,-halfL],[-halfW,y,halfL],frameTube,skidSteel);
                cargoBeam([halfW,y,-halfL],[halfW,y,halfL],frameTube,skidSteel);
            });

            const columns = Math.max(2,Math.min(5,Math.floor(carga.larg/0.55)));
            const rows = Math.max(2,Math.min(4,Math.floor(carga.comp/0.75)));
            const bottleH = cH*0.65;
            const bottleRadius = Math.min(cW/(columns*3),cL/(rows*3),cH*0.095);
            for(let row=0;row<rows;row++){
                for(let col=0;col<columns;col++){
                    const x = -cW*0.36+(col+0.5)*(cW*0.72/columns);
                    const z = -cL*0.36+(row+0.5)*(cL*0.72/rows);
                    const bottleY = -cH/2+baseH+bottleH/2;
                    const bottle = mesh(
                        new THREE.CylinderGeometry(bottleRadius,bottleRadius,bottleH,20),
                        (row+col)%2===0 ? cylinderBlue : cylinderDark,
                        x,bottleY,z,baseItem
                    );
                    bottle.castShadow = true;
                    const shoulder = mesh(
                        new THREE.SphereGeometry(bottleRadius,16,10),
                        cylinderBlue,x,bottleY+bottleH/2-bottleRadius*0.3,z,baseItem
                    );
                    shoulder.scale.set(1,0.48,1);
                    const valve = mesh(
                        new THREE.CylinderGeometry(bottleRadius*0.18,bottleRadius*0.18,bottleRadius*0.5,10),
                        skidSteel,x,bottleY+bottleH/2+bottleRadius*0.35,z,baseItem
                    );
                    valve.castShadow = true;
                }
            }
        } else if(carga.type==='tubulacao'){
            const radius=Math.min(cH*.22,cW*.13,.35*S);
            const rowsL=Math.max(1,Math.floor(cH/(radius*2.1)));
            const colsL=Math.max(1,Math.floor(cW/(radius*2.1)));
            let n=0;
            for(let row=0;row<rowsL && n<28;row++){
                for(let col=0;col<colsL && n<28;col++,n++){
                    const cx=(col-(Math.min(colsL,28)-1)/2)*radius*2.1;
                    const cy=-cH/2+radius+(row*radius*2.1);
                    cylinderAlongZ(radius,cL*.96, n%3===0?steelLight:mat(0x647585),cx,cy,0,20);
                }
            }
            cargoBox(cW*1.02,.12*S,cL*.98,navy,0,-cH/2-.08*S,0);
        } else if(carga.type==='coracao_mae_aberto'){
            const cageFrame = mat(0x6b5843,0.62,0.42);
            const cageHighlights = mat(0x9ca36a,0.48,0.28);
            const vesselMaterial = mat(0xc64b2f,0.42,0.5);
            buildCage(cageFrame,cageHighlights,true);

            const vesselRadius = Math.min(cW,cL)*0.16;
            const vesselHeight = cH*0.62;
            const vesselBaseY = -cH/2 + cH*0.1;
            const vesselCenterY = vesselBaseY + vesselHeight/2;
            const vessel = mesh(
                new THREE.CylinderGeometry(vesselRadius,vesselRadius,vesselHeight,32),
                vesselMaterial,
                0,vesselCenterY,0,
                baseItem
            );
            vessel.castShadow = true;
            vessel.receiveShadow = true;

            [-1,1].forEach(end => {
                const head = mesh(
                    new THREE.SphereGeometry(vesselRadius,24,16),
                    vesselMaterial,
                    0,
                    vesselCenterY + end * vesselHeight * 0.43,
                    0,
                    baseItem
                );
                head.scale.set(1,0.38,1);
                cargoBox(vesselRadius*0.5,cH*0.08,vesselRadius*0.5,cageFrame,0,
                    vesselCenterY + end * (vesselHeight*0.5 + cH*0.025),0);
            });
            cargoBox(cW*0.58,cH*0.045,cL*0.58,cageFrame,0,vesselBaseY,0);
        } else if(carga.type==='tanque'){
            buildCage(cageSteel,cageAccent,true);
            const tankRadius = Math.min(cW,cH)*0.34;
            cylinderAlongZ(tankRadius,cL*0.72,equipmentSteel,0,-cH*0.02,0,40);
            [-1,1].forEach(side => {
                const end = mesh(new THREE.SphereGeometry(tankRadius,24,16),equipmentSteel,0,-cH*0.02,side*cL*0.36,baseItem);
                end.scale.set(1,1,0.28);
            });
        } else if(carga.type==='skid'){
            buildCage(cageSteel,cageAccent,true);
            cargoBox(cW*0.68,cH*0.42,cL*0.62,equipmentBeige,0,-cH*0.02,0);
            cargoBox(cW*0.72,0.12*S,cL*0.68,navy,0,-cH*0.34,0);
            [-1,1].forEach(side => {
                cargoBox(0.12*S,cH*0.28,cL*0.56,equipmentSteel,side*cW*0.31,0,0);
            });
        } else if(carga.type==='estrutura' || carga.type==='cesta'){
            buildCage(carga.type==='cesta' ? equipmentSteel : cageSteel,cageAccent,true);
        } else if(carga.type==='vaso'){
            const vesselRadius = Math.min(cW,cH)*0.39;
            const vesselLength = cL*0.78;
            cylinderAlongZ(vesselRadius,vesselLength,equipmentSteel,0,0,0,40);
            [-1,1].forEach(side => {
                const head = mesh(new THREE.SphereGeometry(vesselRadius,28,20),equipmentSteel,0,0,side*vesselLength*0.46,baseItem);
                head.scale.set(1,1,0.3);
                cargoBox(cW*0.26,cH*0.18,0.25*S,navy,0,-vesselRadius*0.8,side*cL*0.2);
            });
            cargoBox(cW*0.84,0.12*S,cL*0.84,navy,0,-cH/2-0.06*S,0);
        } else if(carga.type==='gerador'){
            const baseY = -cH/2 + 0.08*S;
            cargoBox(cW*0.9,0.16*S,cL*0.9,navy,0,baseY,0);
            cargoBox(cW*0.82,cH*0.64,cL*0.76,equipmentSteel,0,cH*0.02,0);
            cargoBox(cW*0.84,0.12*S,cL*0.78,frame,0,cH*0.34,0);
            cargoBox(0.05*S,cH*0.38,cL*0.42,navy,cW*0.43,0,0);
            for(let i=0;i<6;i++){
                cargoBox(0.025*S,cH*0.42,0.035*S,steelLight,-cW*0.43+i*0.12*S,0,cL*0.2);
            }
            cargoBox(0.05*S,cH*0.2,cL*0.22,orange,cW*0.44,cH*0.1,0);
        } else {
            cargoBox(cW,cH,cL,orange, 0, 0, 0);
            cargoBox(cW*1.01,.07*S,cL*1.01,darkOrange,0,cH/2,0);
            cargoBox(cW*1.01,.07*S,cL*1.01,darkOrange,0,-cH/2,0);
        }
        
        // Clona a malha base do item a ser repetido no grid
        if (splitCoils) {
            const coilLength = cL/2;
            const neckOffset = pescocoStartOffset;
            const mesaOffset = mesaStartOffset;
            const neckFrontZ = shiftZ-neckOffset*S;
            const mesaFrontZ = shiftZ-pL-getDeckTransitionLength(tr)*S-mesaOffset*S;
            const neckY = pH+cH/2;
            const mesaY = (tr.tipo==='reta'?pH:hT)+cH/2;

            for(let i=0;i<carga.qtd;i++){
                const r=Math.floor(i/grid.maxCols);
                const c=i%grid.maxCols;
                const rowItems=Math.min(grid.maxCols,carga.qtd-r*grid.maxCols);
                const rowW=rowItems*cW+Math.max(0,rowItems-1)*grid.gap*S;
                const itemX=-rowW/2+cW/2+c*(cW+grid.gap*S);
                const rowOffset=r*(coilLength+grid.gap)*S;
                const neckItem=baseItem.clone();
                neckItem.position.set(itemX,neckY,neckFrontZ-coilLength/2-rowOffset);
                loadGroup.add(neckItem);

                const mesaItem=baseItem.clone();
                mesaItem.position.set(itemX,mesaY,mesaFrontZ-coilLength/2-rowOffset);
                loadGroup.add(mesaItem);
            }
        } else for (let i = 0; i < carga.qtd; i++) {
            const r = Math.floor(i / grid.maxCols);
            const c = i % grid.maxCols;
            
            const rowItems = Math.min(grid.maxCols, carga.qtd - r * grid.maxCols);
            const rowW = rowItems * cW + Math.max(0, rowItems - 1) * grid.gap * S;
            
            const itemX = -rowW / 2 + cW / 2 + c * (cW + grid.gap * S);
            const itemZ = loadZ_start - cL / 2 - r * (cL + grid.gap * S);
            
            const inst = baseItem.clone();
            inst.position.set(itemX, loadY, itemZ);
            loadGroup.add(inst);
        }
        
    });

    if (activeCargaTab === 'tubos') {
        const tube = getTubeMetrics(tr);
        const tubePositions = getTubePositions(tube, Math.min(tube.loaded, 1200));
        if (tubePositions.length && tube.tubeLengthM > 0) {
            const diameter = tube.diameterMm / 1000 * S;
            const radius = diameter / 2;
            const length = tube.tubeLengthM * S;
            const deckHeight = (tr.tipo === 'reta' || (!isCarreta && pos === 'pescoco')) ? pH : (isCarreta ? deckY : hT);
            const centerZ = shiftZ - mL / 2;
            const pipeMaterial = mat(0x8795a1, 0.3, 0.78);
            const endMaterial = mat(0x26323b, 0.38, 0.7);
            const pipeGeometry = new THREE.CylinderGeometry(radius, radius, length, 16, 1, false);
            const pipeMesh = new THREE.InstancedMesh(pipeGeometry, pipeMaterial, tubePositions.length);
            const pipeQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
            const unitScale = new THREE.Vector3(1, 1, 1);
            const matrixObject = new THREE.Object3D();

            tubePositions.forEach((position, index) => {
                matrixObject.position.set(
                    position.xMm / 1000 * S,
                    deckHeight + (tube.firstSleeperMm + tube.diameterMm / 2 +
                        position.layer * (tube.diameterMm + tube.layerSleeperMm)) / 1000 * S,
                    centerZ
                );
                matrixObject.quaternion.copy(pipeQuaternion);
                matrixObject.scale.copy(unitScale);
                matrixObject.updateMatrix();
                pipeMesh.setMatrixAt(index, matrixObject.matrix);
            });
            pipeMesh.instanceMatrix.needsUpdate = true;
            pipeMesh.castShadow = true;
            pipeMesh.receiveShadow = true;
            loadGroup.add(pipeMesh);

            const endGeometry = new THREE.TorusGeometry(radius * 0.9, Math.max(radius * 0.07, 0.015 * S), 6, 16);
            const endMesh = new THREE.InstancedMesh(endGeometry, endMaterial, tubePositions.length * 2);
            tubePositions.forEach((position, index) => {
                const centerY = deckHeight + (tube.firstSleeperMm + tube.diameterMm / 2 +
                    position.layer * (tube.diameterMm + tube.layerSleeperMm)) / 1000 * S;
                [-1, 1].forEach((side, endIndex) => {
                    matrixObject.position.set(
                        position.xMm / 1000 * S,
                        centerY,
                        centerZ + side * (length / 2 - 0.015 * S)
                    );
                    matrixObject.quaternion.identity();
                    matrixObject.scale.copy(unitScale);
                    matrixObject.updateMatrix();
                    endMesh.setMatrixAt(index * 2 + endIndex, matrixObject.matrix);
                });
            });
            endMesh.instanceMatrix.needsUpdate = true;
            endMesh.castShadow = true;
            loadGroup.add(endMesh);

            const wood = mat(0x80552f, 0.86, 0.05);
            const supportWidth = Math.max(0.1 * S, tube.widthOccupiedMm / 1000 * S);
            const supportDepth = Math.max(0.08 * S, 0.12 * S);
            const supportCount = 3;
            for (let layer = 0; layer < tube.loadedLayers; layer++) {
                const supportHeight = (layer === 0 ? tube.firstSleeperMm : tube.layerSleeperMm) / 1000 * S;
                const supportY = layer === 0
                    ? deckHeight + supportHeight / 2
                    : deckHeight + (tube.firstSleeperMm + layer * tube.diameterMm +
                        (layer - 0.5) * tube.layerSleeperMm) / 1000 * S;
                for (let support = 0; support < supportCount; support++) {
                    const supportZ = centerZ + (support - 1) * length * 0.34;
                    box(supportWidth, supportHeight, supportDepth, wood, 0, supportY, supportZ, loadGroup);
                }
            }

            const postMaterial = mat(0x202a32, 0.55, 0.55);
            const postHeight = tube.stackHeightMm / 1000 * S + 0.3 * S;
            const postX = Math.min(tr.w * S / 2 - 0.08 * S, tube.widthOccupiedMm / 2000 * S + 0.1 * S);
            [-1, 1].forEach(side => {
                for (let post = 0; post < supportCount; post++) {
                    const postZ = centerZ + (post - 1) * Math.min(length * 0.34, mL * 0.34);
                    box(0.07 * S, postHeight, 0.09 * S, postMaterial, side * postX,
                        deckHeight + postHeight / 2, postZ, loadGroup);
                }
            });

            if (tubeStrappingEnabled) {
                const strapMaterial = mat(0xf59e0b, 0.45, 0.12);
                const halfBundleWidth = tube.widthOccupiedMm / 2000 * S;
                const bundleHeight = tube.stackHeightMm / 1000 * S;
                const strapPositions = [-0.39, -0.13, 0.13, 0.39];
                const strapRadius = 0.025 * S;
                const strapSideClearance = strapRadius + 0.035 * S;
                const strapTopClearance = strapRadius + 0.04 * S;

                strapPositions.forEach(position => {
                    const strapZ = centerZ + position * Math.min(length, mL * 0.92);
                    const points = [
                        [-halfBundleWidth - strapSideClearance, deckHeight + 0.08 * S, strapZ],
                        [-halfBundleWidth - strapSideClearance, deckHeight + bundleHeight * 0.48, strapZ],
                        [-halfBundleWidth - strapSideClearance, deckHeight + bundleHeight - strapRadius, strapZ],
                        [-halfBundleWidth - strapRadius * 0.35, deckHeight + bundleHeight + strapTopClearance * 0.72, strapZ],
                        [0, deckHeight + bundleHeight + strapTopClearance, strapZ],
                        [halfBundleWidth + strapRadius * 0.35, deckHeight + bundleHeight + strapTopClearance * 0.72, strapZ],
                        [halfBundleWidth + strapSideClearance, deckHeight + bundleHeight - strapRadius, strapZ],
                        [halfBundleWidth + strapSideClearance, deckHeight + bundleHeight * 0.48, strapZ],
                        [halfBundleWidth + strapSideClearance, deckHeight + 0.08 * S, strapZ]
                    ].map(point => new THREE.Vector3(...point));
                    const strapCurve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
                    const strap = mesh(
                        new THREE.TubeGeometry(strapCurve, 64, strapRadius, 8, false),
                        strapMaterial,
                        0,
                        0,
                        0,
                        loadGroup
                    );
                    strap.castShadow = true;
                });

                const netMaterial = mat(0xf97316, 0.65, 0.08);
                const netPitch = 0.34 * S;
                const netHeight = bundleHeight + 0.12 * S;
                const netSegments = [];
                const netRopeRadius = 0.012 * S;
                const hasSideboards = inputs.tampas.value === 'com' ||
                    tr.tipo === 'sider' || tr.tipo === 'carreta_bau';
                const sideboardThickness = 0.03 * S;
                const netWidth = tube.widthOccupiedMm / 1000 * S + 0.14 * S;
                const insideHalfWidth = hasSideboards
                    ? Math.max(0, wT / 2 - sideboardThickness - netRopeRadius - 0.01 * S)
                    : netWidth / 2;
                const visibleNetWidth = Math.min(netWidth, insideHalfWidth * 2);
                const netColumns = Math.max(4, Math.min(20, Math.ceil(visibleNetWidth / netPitch)));
                const netRows = Math.max(3, Math.min(14, Math.ceil(netHeight / netPitch)));

                function addDrapedNet(pointAt, columns, rows) {
                    const point = (column, row) => pointAt(
                        column / columns,
                        row / rows
                    );
                    const connect = (start, end) => netSegments.push([start, end]);

                    for (let row = 0; row <= rows; row++) {
                        for (let column = 0; column < columns; column++) {
                            connect(point(column, row), point(column + 1, row));
                        }
                    }
                    for (let row = 0; row < rows; row++) {
                        for (let column = 0; column <= columns; column++) {
                            connect(point(column, row), point(column, row + 1));
                            if (column < columns) {
                                if ((column + row) % 2 === 0) {
                                    connect(point(column, row), point(column + 1, row + 1));
                                } else {
                                    connect(point(column + 1, row), point(column, row + 1));
                                }
                            }
                        }
                    }
                }

                [-1, 1].forEach(end => {
                    const endZ = centerZ + end * length / 2;
                    const halfNetWidth = netWidth / 2;
                    const flapLength = Math.min(0.9 * S, length * 0.12);
                    const bottomY = deckHeight + 0.04 * S;
                    const topY = deckHeight + bundleHeight + 0.04 * S;

                    if (hasSideboards) {
                        const endboardZ = end > 0
                            ? shiftZ - sideboardThickness / 2
                            : shiftZ - mL + sideboardThickness / 2;
                        const insideEndZ = endboardZ -
                            end * (sideboardThickness / 2 + netRopeRadius + 0.01 * S);
                        const endGap = Math.max(0, Math.abs(insideEndZ - endZ) - netRopeRadius * 1.5);
                        const endGapRows = Math.max(4, Math.ceil(endGap / netPitch));
                        const insideSideX = insideHalfWidth;

                        addDrapedNet((u, v) => {
                            const x = -insideHalfWidth + u * visibleNetWidth;
                            const z = endZ + end * v * endGap;
                            const sag = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.08 * S;
                            return new THREE.Vector3(x, topY - sag, z);
                        }, netColumns, endGapRows);

                        addDrapedNet((u, v) => {
                            const x = -insideHalfWidth + u * visibleNetWidth;
                            const y = bottomY + v * bundleHeight;
                            const drape = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.06 * S;
                            return new THREE.Vector3(x, y, insideEndZ - end * drape);
                        }, netColumns, netRows);

                        [-1, 1].forEach(side => {
                            const sideSpan = Math.min(Math.abs(insideEndZ - endZ), flapLength);
                            addDrapedNet((u, v) => {
                                const xDrape = Math.sin(u * Math.PI) * 0.035 * S;
                                return new THREE.Vector3(
                                    side * (insideSideX - xDrape),
                                    bottomY + v * bundleHeight,
                                    insideEndZ - end * u * sideSpan
                                );
                            }, Math.max(4, Math.ceil(sideSpan / netPitch)), netRows);
                        });
                        return;
                    }

                    addDrapedNet((u, v) => {
                        const x = -halfNetWidth + u * netWidth;
                        const y = bottomY + v * bundleHeight;
                        const bulge = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.1 * S;
                        return new THREE.Vector3(
                            x,
                            y,
                            endZ + end * (0.08 * S + (1 - v) * 0.12 * S + bulge)
                        );
                    }, netColumns, netRows);

                    addDrapedNet((u, v) => {
                        const x = -halfNetWidth + u * netWidth;
                        const drape = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.08 * S;
                        return new THREE.Vector3(
                            x,
                            topY - drape,
                            endZ + end * 0.08 * S - end * v * flapLength
                        );
                    }, netColumns, Math.max(4, Math.ceil(flapLength / netPitch)));

                    [-1, 1].forEach(side => {
                        addDrapedNet((u, v) => {
                            const drape = Math.sin(u * Math.PI) * 0.07 * S;
                            return new THREE.Vector3(
                                side * (halfNetWidth + drape),
                                bottomY + v * bundleHeight,
                                endZ + end * (0.08 * S + (1 - v) * 0.12 * S) - end * u * flapLength
                            );
                        }, Math.max(4, Math.ceil(flapLength / netPitch)), netRows);

                        const anchor = new THREE.Vector3(
                            side * (tr.w * S / 2 - 0.12 * S),
                            deckHeight + 0.06 * S,
                            endZ - end * Math.min(1.45 * S, length * 0.2)
                        );
                        const tiePoints = [
                            new THREE.Vector3(side * halfNetWidth, bottomY + bundleHeight * 0.62, endZ + end * 0.12 * S),
                            new THREE.Vector3(side * (halfNetWidth + 0.09 * S), bottomY + bundleHeight * 0.3, endZ + end * 0.08 * S),
                            anchor
                        ];
                        const tieCurve = new THREE.CatmullRomCurve3(tiePoints);
                        const tie = mesh(
                            new THREE.TubeGeometry(tieCurve, 16, 0.018 * S, 6, false),
                            strapMaterial,
                            0,
                            0,
                            0,
                            loadGroup
                        );
                        tie.castShadow = true;
                    });
                });

                const netRopeGeometry = new THREE.CylinderGeometry(
                    netRopeRadius,
                    netRopeRadius,
                    1,
                    6
                );
                const netRopes = new THREE.InstancedMesh(netRopeGeometry, netMaterial, netSegments.length);
                const netRopeTransform = new THREE.Object3D();
                const up = new THREE.Vector3(0, 1, 0);
                netSegments.forEach(([start, end], index) => {
                    const direction = end.clone().sub(start);
                    netRopeTransform.position.copy(start).add(end).multiplyScalar(0.5);
                    netRopeTransform.quaternion.setFromUnitVectors(up, direction.clone().normalize());
                    netRopeTransform.scale.set(1, direction.length(), 1);
                    netRopeTransform.updateMatrix();
                    netRopes.setMatrixAt(index, netRopeTransform.matrix);
                });
                netRopes.instanceMatrix.needsUpdate = true;
                netRopes.castShadow = true;
                netRopes.receiveShadow = true;
                loadGroup.add(netRopes);
            }
        }
    }
    
    // Ajusta a Câmera
    const cameraTransitionLength = tr.tipo === 'reta' ? 0 : (tr.transicao ?? 1.0);
    const totalLen = Math.max(10, 4.5*S+(isCarreta?mL:pL+cameraTransitionLength*S+mL+bridgeL)+4.5*S);
    const compensacaoFrente = 0.5 * S;
    const centerZ = (isCarreta ? -mL/2 + shiftZ : -pL-mL/2 + shiftZ) + compensacaoFrente;
    
    camera.position.set(totalLen*.35, 7*S, centerZ - totalLen*.5);
    controls.target.set(0, 1.0*S, centerZ);
    camera.near=.1; camera.far=totalLen*8;
    camera.updateProjectionMatrix();
    controls.update();
}

function draw2D(tr, pos, isCarreta) {
    if (activeCargaTab === 'tubos') {
        drawTubeSide2D(ctxSide, els.sideCanvas, tr, pos, isCarreta);
        drawTubeRear2D(ctxRear, els.rearCanvas, tr, pos, isCarreta);
        return;
    }
    drawSide2D(ctxSide, els.sideCanvas, tr, pos, isCarreta);
    drawRear2D(ctxRear, els.rearCanvas, tr, pos, isCarreta);
}

function drawTubeSide2D(ctx, canvas, tr, pos, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tube = getTubeMetrics(tr);
    const deckHeight = tr.tipo === 'reta' || (!isCarreta && pos === 'pescoco') ? 1.6 : tr.h;
    const scale = Math.min(
        (canvas.width - 40) / Math.max(tr.mesa, tube.tubeLengthM, 1),
        (canvas.height - 30) / Math.max(deckHeight + tube.stackHeightMm / 1000 + 0.6, 2)
    );
    const deckX = 20;
    const deckWidth = tr.mesa * scale;
    const groundY = canvas.height - 16;
    const deckY = groundY - deckHeight * scale;
    const loadWidth = tube.tubeLengthM * scale;
    const loadX = deckX + (deckWidth - loadWidth) / 2;

    ctx.fillStyle = '#475569';
    ctx.fillRect(deckX, deckY, deckWidth, Math.max(4, 0.16 * scale));
    ctx.fillStyle = '#1e293b';
    for (let axle = 0; axle < tr.eixos; axle++) {
        const x = deckX + (1 + axle * (tr.tipo === 'vanderleia' ? 2.4 : 1.2)) * scale;
        ctx.beginPath();
        ctx.arc(Math.min(deckX + deckWidth - 8, x), groundY - 5, Math.max(4, 0.34 * scale), 0, Math.PI * 2);
        ctx.fill();
    }

    if (tube.loaded > 0) {
        const diameter = tube.diameterMm / 1000 * scale;
        tube.loadedLayerCounts.forEach((count, layer) => {
            if (count === 0) return;
            const y = deckY - (tube.firstSleeperMm / 1000 + tube.diameterMm / 1000 +
                layer * (tube.diameterMm + tube.layerSleeperMm) / 1000) * scale;
            const gradient = ctx.createLinearGradient(0, y, 0, y + diameter);
            gradient.addColorStop(0, '#d7e0e7');
            gradient.addColorStop(0.45, '#778895');
            gradient.addColorStop(1, '#34434f');
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#26323b';
            const pipeHeight = Math.max(2, diameter);
            const radius = Math.min(pipeHeight / 2, 8);
            ctx.beginPath();
            ctx.roundRect(loadX, y, loadWidth, pipeHeight, radius);
            ctx.fill();
            ctx.stroke();
        });

        ctx.fillStyle = '#80552f';
        for (let support = 0; support < 3; support++) {
            const x = loadX + loadWidth * (0.15 + support * 0.35);
            ctx.fillRect(x - 2, deckY - tube.firstSleeperMm / 1000 * scale, 4,
                Math.max(2, tube.firstSleeperMm / 1000 * scale));
        }
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${tube.loaded} tubo(s) · ${tube.tubeLengthM.toFixed(2)} m`, loadX + loadWidth / 2,
            Math.max(12, deckY - (tube.stackHeightMm / 1000) * scale - 8));
    }

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, groundY - (4.4 - deckHeight) * scale);
    ctx.lineTo(canvas.width, groundY - (4.4 - deckHeight) * scale);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawTubeRear2D(ctx, canvas, tr, pos, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tube = getTubeMetrics(tr);
    const deckHeight = tr.tipo === 'reta' || (!isCarreta && pos === 'pescoco') ? 1.6 : tr.h;
    const maxWidth = Math.max(tr.w, tube.widthMm / 1000);
    const maxHeight = Math.max(2, tube.heightMm / 1000 + 0.4);
    const scale = Math.min((canvas.width - 36) / maxWidth, (canvas.height - 28) / maxHeight);
    const centerX = canvas.width / 2;
    const groundY = canvas.height - 14;
    const trailerWidth = tr.w * scale;
    const deckY = groundY - 0.28 * scale;
    const boardHeight = Math.max(2, tube.firstSleeperMm / 1000 * scale);

    ctx.fillStyle = '#475569';
    ctx.fillRect(centerX - trailerWidth / 2, deckY, trailerWidth, Math.max(4, 0.16 * scale));
    ctx.fillStyle = '#80552f';
    ctx.fillRect(centerX - Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000) / 2,
        deckY - boardHeight, Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000), boardHeight);

    const legalHeight = Math.min(tube.heightMm / 1000, 4.4 - deckHeight);
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(8, deckY - legalHeight * scale);
    ctx.lineTo(canvas.width - 8, deckY - legalHeight * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    if (tube.loaded > 0 && tube.diameterMm > 0) {
        const pipeRadius = tube.diameterMm / 2000 * scale;
        const positions = getTubePositions(tube, Math.min(tube.loaded, 500));
        positions.forEach(position => {
            const x = centerX + position.xMm / 1000 * scale;
            const y = deckY - (tube.firstSleeperMm / 1000 + tube.diameterMm / 2000 +
                position.layer * (tube.diameterMm + tube.layerSleeperMm) / 1000) * scale;
            const gradient = ctx.createLinearGradient(x - pipeRadius, y - pipeRadius, x + pipeRadius, y + pipeRadius);
            gradient.addColorStop(0, '#e2e8f0');
            gradient.addColorStop(0.55, '#8b9aa6');
            gradient.addColorStop(1, '#43515c');
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1.5, pipeRadius), 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        for (let layer = 1; layer < tube.loadedLayers; layer++) {
            const y = deckY - (tube.firstSleeperMm / 1000 + layer * tube.diameterMm / 1000 +
                (layer - 1) * tube.layerSleeperMm / 1000) * scale;
            ctx.fillStyle = '#80552f';
            ctx.fillRect(centerX - Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000) / 2,
                y - Math.max(2, tube.layerSleeperMm / 1000 * scale) / 2,
                Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000),
                Math.max(2, tube.layerSleeperMm / 1000 * scale));
        }
        if (tube.loaded > positions.length) {
            ctx.fillStyle = '#475569';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Vista parcial: ${positions.length} de ${tube.loaded} tubos`, centerX, canvas.height - 2);
        }
    }
}

function drawCargoRect(ctx, x, y, w, h, carga) {
    if(CONTAINER_LOAD_TYPES.has(carga.type)) {
        let color = 'rgba(23,107,135,0.7)'; 
        if(carga.armador === 'maersk') color = 'rgba(224,229,232,0.9)';
        if(carga.armador === 'msc') color = 'rgba(214,195,127,0.9)';
        if(carga.armador === 'hapag') color = 'rgba(234,88,12,0.9)';
        if(carga.armador === 'evergreen') color = 'rgba(6,95,50,0.8)';
        if(carga.armador === 'cma') color = 'rgba(15,33,66,0.8)';
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1e293b';
    } else {
        ctx.fillStyle='rgba(245,158,11,.7)';
        ctx.strokeStyle='#b45309';
    }
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
}

function drawSide2D(ctx, canvas, tr, pos, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cTractor = 4.5;
    const bridgeL = 3.5;
    let maxCargaH = 0;
    composicaoCargas.forEach(c => { if(c.alt > maxCargaH) maxCargaH = c.alt; });
    
    const trailerSpan = isCarreta
        ? tr.mesa
        : tr.pescoco + getDeckTransitionLength(tr) + tr.mesa + bridgeL;
    const wTotal = cTractor + trailerSpan + 2;
    const hTotal = Math.max(5.0, (tr.tipo === 'reta' || isCarreta ? 1.6 : Math.max(1.6, tr.h)) + maxCargaH + 2); 

    const scale = Math.min((canvas.width - 20) / wTotal, (canvas.height - 20) / hTotal);
    const groundY = canvas.height - 15;
    const startX = 20 + trailerSpan * scale;
    
    const drawWheel = (cx, rFac=1) => {
        const r = 0.5 * scale * rFac;
        ctx.beginPath(); ctx.arc(cx, groundY - r, r, 0, Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
    }

    ctx.fillStyle = '#0284c7'; 
    ctx.fillRect(startX + 3*scale, groundY - (2.5*scale), 1.5*scale, 1.5*scale);
    ctx.fillRect(startX + 1*scale, groundY - (3.5*scale), 2*scale, 2.5*scale);
    drawWheel(startX + 3.5*scale); drawWheel(startX); drawWheel(startX - 1.2*scale);

    const pL = isCarreta ? 0 : tr.pescoco * scale;
    const pH = 1.6 * scale; 
    const hT = tr.h * scale; 
    const mL = tr.mesa * scale;

    ctx.fillStyle = '#475569';
    if (isCarreta) {
        ctx.fillRect(startX - mL, groundY - pH, mL, 0.3*scale);
        const axleLayout = getCarretaAxleLayout(tr);
        const startAxleX = startX - mL + axleLayout.firstFromRear*scale;
        for(let i=0; i<tr.eixos; i++) drawWheel(startAxleX + (i*axleLayout.spacing*scale));
    } else {
        ctx.fillRect(startX - pL, groundY - pH, pL, 0.3*scale); 
        if(tr.tipo === 'reta') {
            ctx.fillRect(startX - pL - mL, groundY - pH, mL, 0.3*scale);
            for(let i=0; i<tr.eixos; i++) drawWheel(startX - pL - mL + 1*scale + (i*1.1*scale));
        } else {
            const dropL = getDeckTransitionLength(tr) * scale;
            ctx.beginPath(); ctx.moveTo(startX - pL, groundY - pH); ctx.lineTo(startX - pL - dropL, groundY - hT);
            ctx.lineTo(startX - pL - dropL, groundY - hT + 0.3*scale); ctx.lineTo(startX - pL, groundY - pH + 0.3*scale); ctx.fill();
            ctx.fillRect(startX - pL - dropL - mL, groundY - hT, mL, 0.3*scale); 
            for(let i=0; i<tr.eixos; i++) drawWheel(startX - pL - dropL - mL - 0.5*scale - (i*1.2*scale));
        }
    }

    let loadFrontX = startX;
    if (pos !== 'pescoco' && !isCarreta) {
        loadFrontX -= pL + getDeckTransitionLength(tr)*scale;
    }

    if (tr.tipo === 'sider') ctx.globalAlpha = 0.5;
    
    const loadSequence = getLoadSequenceMetrics(tr,isCarreta);
    loadSequence.loads.forEach(({ carga, grid, startOffset, mesaStartOffset, pescocoStartOffset, splitCoils }) => {
        const cL = carga.comp * scale;
        const cH = carga.alt * scale;
        if (splitCoils) {
            const coilLength = cL/2;
            const neckOffset = pescocoStartOffset;
            const mesaOffset = mesaStartOffset;
            const neckFrontX = startX-neckOffset*scale;
            const mesaFrontX = startX-pL-getDeckTransitionLength(tr)*scale-mesaOffset*scale;
            const neckY = groundY-pH-cH;
            const mesaY = groundY-(tr.tipo==='reta'?pH:hT)-cH;

            for(let i=0;i<carga.qtd;i++){
                const r=Math.floor(i/grid.maxCols);
                const rowOffset=r*(coilLength+grid.gap)*scale;
                drawCargoRect(ctx,neckFrontX-coilLength-rowOffset,neckY,coilLength,cH,carga);
                drawCargoRect(ctx,mesaFrontX-coilLength-rowOffset,mesaY,coilLength,cH,carga);
            }
            return;
        }

        const cY = (pos === 'pescoco' || tr.tipo === 'reta' || isCarreta ? groundY - pH - cH : groundY - hT - cH);
        const currentX = loadFrontX-startOffset*scale;
        
        for (let r = 0; r < grid.rows; r++) {
            const itemX = currentX - cL - r * (carga.comp + grid.gap) * scale;
            drawCargoRect(ctx, itemX, cY, cL, cH, carga);
        }
    });

    ctx.globalAlpha = 1.0;

    const limitH = 4.40 * scale;
    ctx.setLineDash([5, 5]); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, groundY - limitH); ctx.lineTo(canvas.width, groundY - limitH); ctx.stroke();
    ctx.setLineDash([]);
}

function drawRear2D(ctx, canvas, tr, pos, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let widestCarga = null;
    let maxW = 0;
    composicaoCargas.forEach(c => {
        const grid = getGridMetrics(tr, c, isCarreta);
        if(grid.totalLarg > maxW) {
            maxW = grid.totalLarg;
            widestCarga = c;
        }
    });

    const wTotal = Math.max(tr.w, maxW) + 2; 
    const hTotal = Math.max(4.5, (tr.tipo === 'reta' || pos === 'pescoco' || isCarreta ? 1.6 : tr.h) + (tr.tipo==='sider'?2.8: (widestCarga?.alt || 0)) + 1);
    const scale = Math.min((canvas.width - 20) / wTotal, (canvas.height - 20) / hTotal);
    const groundY = canvas.height - 15;
    const centerX = canvas.width / 2;

    const tW = tr.w * scale;
    const tH = (tr.tipo === 'reta' || pos === 'pescoco' || isCarreta ? 1.6 : tr.h) * scale;
    
    ctx.fillStyle = '#475569';
    ctx.fillRect(centerX - tW/2, groundY - tH, tW, 0.4*scale);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(centerX - tW/2 + 0.1*scale, groundY - 1.0*scale, 0.6*scale, 1.0*scale);
    ctx.fillRect(centerX + tW/2 - 0.7*scale, groundY - 1.0*scale, 0.6*scale, 1.0*scale);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(centerX-tW*0.46,groundY-0.68*scale,tW*0.92,0.2*scale);
    const reflectorWidth=tW*0.92/12;
    for(let i=0;i<12;i++){
        ctx.fillStyle=i%2===0?'#dc2626':'#f8fafc';
        ctx.fillRect(centerX-tW*0.46+i*reflectorWidth,groundY-0.66*scale,reflectorWidth,0.14*scale);
    }

    if (widestCarga) {
        const grid = getGridMetrics(tr, widestCarga, isCarreta);
        const cW = widestCarga.larg * scale;
        const cH = widestCarga.alt * scale;
        const cY = groundY - tH - cH;
        
        const firstRowItems = Math.min(grid.maxCols, widestCarga.qtd);
        const rowW_Scale = firstRowItems * cW + Math.max(0, firstRowItems - 1) * grid.gap * scale;
        const startX_row = centerX - rowW_Scale / 2;

        for (let c = 0; c < firstRowItems; c++) {
            const itemX = startX_row + c * (cW + grid.gap * scale);
            drawCargoRect(ctx, itemX, cY, cW, cH, widestCarga);
        }

        const limitW = isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau' ? tr.w_util : tr.w;
        if (maxW > limitW) {
            const excW = limitW * scale;
            const cW_max = maxW * scale;
            ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px Arial';
            ctx.beginPath(); ctx.moveTo(centerX - cW_max/2, groundY - tH - 10); ctx.lineTo(centerX - excW/2, groundY - tH - 10); ctx.stroke();
            ctx.fillText('Exc', centerX - cW_max/2 + 2, groundY - tH - 15);
            ctx.beginPath(); ctx.moveTo(centerX + excW/2, groundY - tH - 10); ctx.lineTo(centerX + cW_max/2, groundY - tH - 10); ctx.stroke();
        }
    }
}

window.addEventListener('resize', () => {
    const container = document.getElementById('three-container');
    if(camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        if(trailerGroup && loadGroup) analyzeAndDraw();
    }
});

const tipoCargaSelect = document.getElementById('input_tipo_carga');
const divArmador = document.getElementById('div_armador');
const inputArmador = document.getElementById('input_armador');
const containerOptions = document.createElement('optgroup');
containerOptions.label = 'Containers offshore';

LOAD_TYPES.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value.startsWith('container_')) {
        containerOptions.appendChild(option);
    } else {
        tipoCargaSelect.appendChild(option);
    }
});
tipoCargaSelect.appendChild(containerOptions);

tipoCargaSelect.addEventListener('change', () => {
    const val = tipoCargaSelect.value;
    if(CONTAINER_LOAD_TYPES.has(val) && !UNBRANDED_CONTAINER_TYPES.has(val)) {
        divArmador.classList.remove('hidden');
    } else {
        divArmador.classList.add('hidden');
        inputArmador.value = 'generico';
    }

    const loadType = LOAD_TYPES.find(type => type.value === val);
    if(loadType) {
        const preset = loadType.preset;
        [inputs.cComp, inputs.cLarg, inputs.cAlt, inputs.cPeso].forEach((el,i) => el.value = preset[i]);
    }
});

els.btnReset.addEventListener('click', () => {
    composicaoCargas = [];
    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
    inputs.placa_carreta.value = ""; inputs.placa_prancha.value = "prancha_reb_6_3";
    setVehicleSelectorTab('prancha');
    updateTrailerInfo();
});

function setCargaTab(tab) {
    const isTubes = tab === 'tubos';
    if (isTubes && !cargoTrailerSelectionBeforeTubes) {
        cargoTrailerSelectionBeforeTubes = {
            prancha: inputs.placa_prancha.value,
            carreta: inputs.placa_carreta.value,
            vehicleTab: document.querySelector('[data-vehicle-tab][aria-selected="true"]')?.dataset.vehicleTab
        };
        if (!TUBE_TRAILER_IDS.has(getActiveTrailerId())) {
            inputs.placa_prancha.value = "";
            inputs.placa_carreta.value = "carreta_padrao";
        }
    } else if (!isTubes && cargoTrailerSelectionBeforeTubes) {
        inputs.placa_prancha.value = cargoTrailerSelectionBeforeTubes.prancha;
        inputs.placa_carreta.value = cargoTrailerSelectionBeforeTubes.carreta;
        setVehicleSelectorTab(cargoTrailerSelectionBeforeTubes.vehicleTab ||
            (cargoTrailerSelectionBeforeTubes.carreta ? 'carreta' : 'prancha'));
        cargoTrailerSelectionBeforeTubes = null;
    }
    activeCargaTab = tab;
    const tabCargas = document.getElementById('tab_cargas');
    const tabTubos = document.getElementById('tab_tubos');
    const panelCargas = document.getElementById('panel_cargas');
    const panelTubos = document.getElementById('panel_tubos');
    const tabClass = 'load-tab load-tab-active';
    const inactiveClass = 'load-tab';

    tabCargas.className = isTubes ? inactiveClass : tabClass;
    tabTubos.className = isTubes ? tabClass : inactiveClass;
    tabCargas.setAttribute('aria-selected', String(!isTubes));
    tabTubos.setAttribute('aria-selected', String(isTubes));
    panelCargas.classList.toggle('hidden', isTubes);
    panelTubos.classList.toggle('hidden', !isTubes);
    els.cargoSummary.container.classList.toggle('hidden', isTubes);
    els.tubeSummary.classList.toggle('hidden', !isTubes);
    document.getElementById('view_3d_title').textContent = isTubes
        ? 'Tubos sobre a carroceria (3D)'
        : 'Vista 3D (Arraste e Role)';
    document.getElementById('view_side_title').textContent = isTubes
        ? 'Perfil lateral dos tubos'
        : 'Perfil Lateral';
    document.getElementById('view_rear_title').textContent = isTubes
        ? 'Vista frontal (seção)'
        : 'Corte Traseiro (Largura)';
    updateTrailerInfo();
}

document.getElementById('tab_cargas').addEventListener('click', () => setCargaTab('cargas'));
document.getElementById('tab_tubos').addEventListener('click', () => setCargaTab('tubos'));
document.getElementById('tube_strapping_on').addEventListener('click', () => {
    tubeStrappingEnabled = true;
    document.getElementById('tube_strapping_on').className = 'load-tab load-tab-active';
    document.getElementById('tube_strapping_off').className = 'load-tab';
    document.getElementById('tube_strapping_on').setAttribute('aria-pressed', 'true');
    document.getElementById('tube_strapping_off').setAttribute('aria-pressed', 'false');
    analyzeAndDraw();
});
document.getElementById('tube_strapping_off').addEventListener('click', () => {
    tubeStrappingEnabled = false;
    document.getElementById('tube_strapping_on').className = 'load-tab';
    document.getElementById('tube_strapping_off').className = 'load-tab load-tab-active';
    document.getElementById('tube_strapping_on').setAttribute('aria-pressed', 'false');
    document.getElementById('tube_strapping_off').setAttribute('aria-pressed', 'true');
    analyzeAndDraw();
});
Object.values(tubeInputs).forEach(input => {
    input.addEventListener('input', () => {
        window.clearTimeout(tubeInputUpdateTimer);
        tubeInputUpdateTimer = window.setTimeout(analyzeAndDraw, 150);
    });
    input.addEventListener('change', () => {
        window.clearTimeout(tubeInputUpdateTimer);
        analyzeAndDraw();
    });
});

window.addEventListener('load', () => {
    inputs.cavalinho.value = 'scania_s_730';
    initThreeJS();
    updateTrailerInfo();
    renderListaCargas();
});