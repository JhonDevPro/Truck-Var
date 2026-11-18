// --- Banco de Dados Integrado (Pranchas + Carretas) ---
const bdVeiculos = {
    "prancha_reb_6_3": { tipo: "rebaixada", w: 3.00, h: 1.10, pescoco: 3.50, mesa: 6.30, compTotal: 14.50, eixos: 3, cap: 45 },
    "prancha_reb_7_0": { tipo: "rebaixada", w: 3.00, h: 0.70, pescoco: 3.80, mesa: 7.00, compTotal: 16.70, eixos: 3, cap: 45 },
    "prancha_reb_6_0": { tipo: "rebaixada", w: 3.20, h: 0.90, pescoco: 3.60, transicao: 1.40, mesa: 6.00, areaCargaTotal: 11.00, compTotal: 14.60, eixos: 3, cap: 45 },
    "prancha_reta_12_5": { tipo: "reta", w: 3.20, h: 1.20, pescoco: 3.60, mesa: 12.55, compTotal: 18.00, eixos: 3, cap: 40 },
    "prancha_semi_3_9": { tipo: "semi-rebaixada", w: 3.00, h: 0.80, pescoco: 3.65, mesa: 4.00, compTotal: 13.50, eixos: 3, cap: 35 },
    "prancha_reb_4_11_3": { tipo: "rebaixada", w: 3.00, h: 0.90, pescoco: 3.70, mesa: 11.30, compTotal: 19.00, eixos: 4, cap: 60 },
    // --- NOVAS PRANCHAS REGISTADAS ---
    "prancha_step_3_eixos": { tipo: "rebaixada", w: 3.20, h: 0.90, pescoco: 3.60, transicao: 1.20, mesa: 7.00, mesaEixos: 3.00, areaCargaTotal: 10.00, compTotal: 15.50, eixos: 3, cap: 45 },
    "prancha_step_4_eixos": { tipo: "rebaixada", w: 3.20, h: 0.90, pescoco: 3.70, transicao: 1.20, mesa: 7.00, mesaEixos: 4.00, areaCargaTotal: 11.00, compTotal: 17.00, eixos: 4, cap: 60 },
    "prancha_lagartixa": { tipo: "rebaixada", w: 3.00, h: 0.50, pescoco: 3.80, mesa: 14.00, compTotal: 20.00, eixos: 3, cap: 45 },
    
    "carreta_ext": { tipo: "carreta_ext", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 15.00, compTotal: 15.00, eixos: 3, cap: 25 },
    "carreta_bau_15": { tipo: "carreta_bau", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 15.00, compTotal: 15.00, eixos: 3, cap: 25 },
    "carreta_padrao": { tipo: "carreta", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 25 },
    "carreta_vand": { tipo: "vanderleia", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 30 },
    "carreta_sider": { tipo: "sider", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 14.00, compTotal: 14.00, eixos: 3, cap: 25 },

    // --- CAMINHÕES (carroceria própria, sem cavalinho) ---
    // w = largura externa (interna + 3 cm de cada lado), w_util = largura interna entre as tampas.
    // mesa = comprimento real do piso: o informado + 20 cm de folga para as cargas.
    // paredesFixas = a lateral já faz parte do modelo 3D (sem tampas opcionais).
    // cabL/cabH/rearAxles/wheelR só servem para o desenho do perfil lateral 2D.
    "caminhao_truck": { tipo: "caminhao", grupo: "Truck", nome: "Truck", modelo: "truck", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 8.20, eixos: 3, cap: 12, cabL: 2.3, cabH: 3.3, rearAxles: 2, wheelR: 0.52 },
    "caminhao_toco": { tipo: "caminhao", grupo: "Toco", nome: "Toco", modelo: "toco", w: 2.50, w_util: 2.44, h: 1.50, pescoco: 0, mesa: 6.20, eixos: 2, cap: 8, cabL: 2.0, cabH: 3.1, rearAxles: 1, wheelR: 0.52 },
    "caminhao_vuc_chevrolet": { tipo: "caminhao", grupo: "VUC", nome: "VUC F350 Chevrolet", modelo: "vuc_chevrolet", paredesFixas: true, w: 2.06, w_util: 2.00, h: 1.10, pescoco: 0, mesa: 4.20, eixos: 2, cap: 1, cabL: 1.9, cabH: 2.6, rearAxles: 1, wheelR: 0.45 },
    "caminhao_vuc_honda": { tipo: "caminhao", grupo: "VUC", nome: "VUC F350 Honda", modelo: "vuc_honda", paredesFixas: true, w: 2.06, w_util: 2.00, h: 1.10, pescoco: 0, mesa: 4.20, eixos: 2, cap: 1, cabL: 1.9, cabH: 2.4, rearAxles: 1, wheelR: 0.45 },
    "caminhao_vuc_mercedes": { tipo: "caminhao", grupo: "VUC", nome: "VUC F350 Mercedes-Benz", modelo: "vuc_mercedes", paredesFixas: true, w: 2.06, w_util: 2.00, h: 1.10, pescoco: 0, mesa: 4.20, eixos: 2, cap: 1, cabL: 2.2, cabH: 2.5, rearAxles: 1, wheelR: 0.45 },
    "caminhao_saveiro": { tipo: "caminhao", grupo: "Utilitário", nome: "Utilitário Saveiro", modelo: "saveiro", paredesFixas: true, w: 1.06, w_util: 1.00, h: 0.55, pescoco: 0, mesa: 1.80, eixos: 2, cap: 0.4, cabL: 1.9, cabH: 1.4, rearAxles: 1, wheelR: 0.36 }
};

function isMesaOnlyVehicle(tr) {
    return tr.tipo.includes('carreta') || tr.tipo === 'vanderleia' || tr.tipo === 'sider' || tr.tipo === 'caminhao';
}

// Com tampas (ou paredes fixas do modelo) a carga só usa a largura interna.
function usesSideGates(tr, isCarreta) {
    if (tr.tipo === 'caminhao') return tr.paredesFixas === true || inputs.tampas.value === 'com';
    return isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
}

function getLoadAreaCenterX(tr) {
    return Number.isFinite(tr.loadCenterX) ? tr.loadCenterX : 0;
}

// Posição da quinta-roda em metros após a transformação original de cada modelo.
const CAB_MODELS = {
    semi_obj: { format: 'obj', fifthWheel: { z: 1.07, y: 1.16 } },
    tractor_cab_burnout_3: { 
        format: 'gltf', 
        url: './tractor_cab_burnout_3.glb', 
        scale: 1.2, 
        rotationY: 0, 
        offsetY: 1,
        fifthWheel: { z: 1.68, y: 1.28 },
    },
    fortnite_semi_truck: { 
        format: 'gltf', 
        url: './fortnite_semi_truck.glb', 
        scale: 1.2, 
        rotationY: Math.PI, 
        offsetY: 1,
        fifthWheel: { z: 1.47, y: 1.27 },
        driver: { x: 0.4, y: 1.75, z: 3.9, wheel: { y: 2.12, z: 3.5, tilt: 35, radius: 0.22 } },
    },
    semi_truck_burnout_revenge: { 
        format: 'gltf', 
        url: './semi_truck_burnout_revenge.glb', 
        scale: 1.0, 
        rotationY: 0, 
        offsetY: 0,
        fifthWheel: { z: 2.08, y: 1.11 },
        driver: { x: 0.47, y: 1.9, z: 1.3, wheel: { y: 2.02, z: 0.9, tilt: 35, radius: 0.22 } },
    },
    scania_s_730: {
        format: 'gltf',
        url: './scania_S-730.glb.gz',
        compression: 'gzip',
        uniformScale: 3.0,
        rotationY: 0,
        alignToGround: true,
        offsetZ: -2.6,
        fifthWheel: { z: 0.96, y: 1.04 },
        driver: { x: 0.6, y: 2.0, z: 1.3, wheel: { y: 2.15, z: 0.8, tilt: 35, radius: 0.22 } },
        bodyColor: 0xf2f2f0,
        grayMeshNames: ['Object_56', 'Object_83', 'Object_125'],
        whiteMeshNames: ['Object_30', 'Object_58'],
        frontGrilleColor: 0x383c42 // Tom grafite/chumbo escuro para a grade frontal
    }
};

const VEHICLE_BODY_WHITE = 0xf2f2f0;
const VEHICLE_DETAIL_GRAY = 0x383c42;

// Medidas em metros no sistema original do modelo já girado (frente = +Z):
// bed = carroceria de carga, wheels = eixos (posição Z e raio do pneu).
// Cada modelo é remodelado em buildRigidVehicle para casar com as medidas de bdVeiculos.
const RIGID_VEHICLE_MODELS = {
    truck: {
        url: './caminhões/Truck (2).glb',
        compressedUrl: './modelos/truck.glb.gz',
        rotationY: Math.PI / 2,
        unit: 1,
        groundY: 0.01,
        bed: { front: 1.57, rear: -6.73, width: 2.60, floor: 1.67, floorWidth: 2.48, centerX: 0 },
        wheels: { z: [3.49, -3.75, -5.15], radius: 0.585, innerX: 0.6 },
        animationWheels: { z: [1.92, -5.32, -6.72], y: 0.58, radius: 0.585, minX: 0.6, maxCenterOffset: 0.6, materials: /^(Tyre_rubber|Ascot_aluminium|Ascot_rubber__chassis)$/, hiddenMeshes: /^Object_(128|130|132)$/ },
        cabLight: { x: 0, y: 3.1, z: 1.9 },
        driver: { x: 0.68, y: 2.25, z: 1.4, wheel: { y: 2.35, z: 1.05, tilt: 35, radius: 0.22 } },
        ivecoLogo: true,
        paints: [
            { match: /ruby_red/i, color: VEHICLE_BODY_WHITE },
            { match: /Independent_bed_paint/i, color: VEHICLE_DETAIL_GRAY },
            { match: /facade/i, color: VEHICLE_BODY_WHITE, recolorTexture: true }
        ],
        interior: /Cab_upholstery|Dashboard_illuminated_display|LED_white|Ruby_seat_stitching/i
    },
    toco: {
        url: './caminhões/Toco (2).glb',
        compressedUrl: './modelos/toco.glb.gz',
        rotationY: Math.PI / 2,
        unit: 1,
        groundY: 0.01,
        bed: { front: 1.98, rear: -2.86, width: 2.08, floor: 1.47, floorWidth: 1.98, centerX: 0 },
        wheels: { z: [3.07, -1.47], radius: 0.515, innerX: 0.55 },
        animationWheels: { z: [1.09, -3.45], y: 0.51, radius: 0.515, minX: 0.5, maxCenterOffset: 0.6, materials: /^(Tyre_rubber|Ascot_aluminium|Ascot_rubber__chassis)$/, hiddenMeshes: /^Object_(84|86)$/ },
        cabLight: { x: 0, y: 2.65, z: 1.3 },
        driver: { x: 0.61, y: 2.2, z: 1.4, wheel: { y: 2.35, z: 1.05, tilt: 35, radius: 0.22 } },
        ivecoLogo: true,
        paints: [
            { match: /ruby_red/i, color: VEHICLE_BODY_WHITE },
            { match: /Independent_bed_paint/i, color: VEHICLE_DETAIL_GRAY },
            { match: /facade/i, color: VEHICLE_BODY_WHITE, recolorTexture: true }
        ],
        interior: /Cab_upholstery|Dashboard_illuminated_display|LED_white|Ruby_seat_stitching/i
    },
    vuc_chevrolet: {
        url: './caminhões/F350-chevrolet.glb',
        compressedUrl: './modelos/vuc-chevrolet.glb.gz',
        rotationY: 0,
        unit: 0.01,
        groundY: 0.0017,
        bed: { front: 1.46, rear: -3.78, width: 2.58, floor: 1.182, centerX: -0.01 },
        wheels: { z: [2.35, -2.74], radius: 0.48, innerX: 0.85 },
        animationWheels: { z: [0.93, -4.21], y: 0.5, radius: 0.5, minX: 0.5, materials: /^jumbo-car$/, componentCounts: [81, 257] },
        cabLight: { x: 0, y: 2.2, z: 0.94 },
        driver: { x: 0.4, y: 1.1, z: 1.0, wheel: { y: 1.45, z: 0.65, tilt: 35, radius: 0.2 } },
        brighten: true,
        paints: []
    },
    vuc_honda: {
        url: './caminhões/F350-honda_acty.glb',
        compressedUrl: './modelos/vuc-honda.glb.gz',
        rotationY: 0,
        unit: 1,
        preScale: 1.5,
        groundY: 0.002,
        bed: { front: 0.25, rear: -1.60, width: 1.36, floor: 0.573, centerX: 0 },
        wheels: { z: [0.54, -1.34], radius: 0.25, innerX: 0.5 },
        animationWheels: { z: [0.54, -1.34], y: 0.25, radius: 0.25, minX: 0.5, meshes: /^WHEEL_/ },
        cabLight: { x: 0, y: 1.3, z: 0.53 },
        driver: { x: -0.48, y: 1.4, z: 1.45, wheel: { y: 1.65, z: 0.85, tilt: 35, radius: 0.18 } },
        brighten: true,
        glassMaterial: /^windscreen\.2$/,
        paints: []
    },
    vuc_mercedes: {
        url: './caminhões/F350-mercedes-benz.glb',
        compressedUrl: './modelos/vuc-mercedes.glb.gz',
        rotationY: Math.PI,
        unit: 1,
        preScale: 1.0,
        groundY: 0,
        bed: { front: 3.49, rear: 0.28, width: 2.106, floor: 0.80, centerX: -1.142 },
        wheels: { z: [4.80, 1.40], radius: 0.40, innerX: 0.8 },
        animationWheels: { z: [1.30, -2.08], y: 0.35, radius: 0.35, minX: 0.5, materials: /^Color_00[48]$/ },
        cabLight: { x: 0, y: 1.65, z: 0.71 },
        driver: { x: 0.35, y: 1.0, z: 1.65, wheel: { y: 1.35, z: 1.2, tilt: 35, radius: 0.2 } },
        paints: [
            { match: /OrangeRed/i, color: VEHICLE_BODY_WHITE }
        ]
    },
    saveiro: {
        url: './caminhões/volkswagen_saveiro.glb',
        compressedUrl: './modelos/volkswagen-saveiro.glb.gz',
        rotationY: 0,
        unit: 100,
        preScale: 1,
        bed: { front: -0.411, rear: -2.046, width: 1.30, floor: 0.56, centerX: 0 },
        wheels: { z: [1.787, -0.965], radius: 0.297, innerX: 0.6, scale: 1 },
        animationWheels: { z: [1.787, -0.965], y: 0.297, radius: 0.297, minX: 0.6, meshes: /^(Tire_Acero_Rims|Acero_Rims|Ext_Brake_(FL|FR)_Rotor)/ },
        cabLight: { x: 0, y: 1.1, z: 0.7 },
        driver: { x: 0.33, y: 0.65, z: 2.13, scale: 0.9, minY: 0.22, wheel: { y: 0.82, z: 1.65, tilt: 30, radius: 0.17 } },
        paints: [
            { match: /^CarPaint$/i, color: VEHICLE_BODY_WHITE, metalness: 0.05, roughness: 0.68 }
        ],
        bedFloorColor: 0x202124,
        groundY: -0.0015
    }
};

const cabModelPromises = new Map();
const cabTexturePaletteCache = new WeakMap();
const cabBrightTextureCache = new WeakMap();
const cabGrayTextureCache = new WeakMap();

const SUPABASE_URL = 'https://ocjiopkkmxwycrmighrh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5jfnHsWZfVxxrunMdYPK-g_7njfoMnD';

// --- ESTADO GLOBAL DA COMPOSIÇÃO DE CARGAS ---
let composicaoCargas = [];
let cargasTransbordo = [];
let editingCargaIndex = null;
let activeCargaTab = 'cargas';
let tubeInputUpdateTimer = null;
let tubeStrappingEnabled = true;
let cargoTrailerSelectionBeforeTubes = null;
let supabaseClient = null;
let authenticatedUser = null;
let activePlanId = null;
let appReadyResolve;
const appReady = new Promise(resolve => {
    appReadyResolve = resolve;
});

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

const GENERAL_CARGO_FILES = [
    '01palette.glb', '02container.glb', '20-BLACK-shipping_container.glb', '20-tank_container.glb',
    '40-RED-container.glb', '40-shipping_container.glb', 'CAÇAMBA-CHEIA.glb', 'CESTA_container.glb',
    'GRAFITADO-rusty_container.glb', 'LARANJA-container_3d.glb', 'abandoned_wooden_log_pallet.glb',
    'bobina.glb', 'cardboard_boxes_with_plastic_inside.glb', 'cargo_shipping_container_40ft.glb',
    'closed_carton_box_3d_model.glb', 'container-10-PES.glb', 'container-20-VELHO (1).glb',
    'container.glb', 'container_decheterie.glb', 'container_with_cooler_prop.glb',
    'damaged_cable_roll_2.glb', 'deteriorated_boxes_on_a_pallet.glb', 'fuel_container.glb',
    'gas_tank.glb', 'green_shipping_container.glb', 'ibc_container_low_poly.glb',
    'large_fluid_container.glb', 'logs_on_pallet.glb', 'mesh_container.glb', 'palet_box.glb',
    'palet_wooden_-_11mb.glb', 'palete_game_ready.glb', 'palette.glb', 'pile_bricks_in_pallet.glb',
    'projeto_estrutural_passarela.glb', 'reservatorio_container_ibc.glb', 'rubble_container.glb',
    'sea_container_-_low_poly.glb', 'simple_industrial_storage_tank.glb', 'sketchfab_space-container.glb',
    'small_fluid_container.glb', 'solar_pallete.glb', 'tank_container.glb', 'tarp-covered_palettes.glb',
    'trash_container (1).glb', 'trash_container.glb', 'wood__boxes_strapped_on_palet.glb'
];
const GENERAL_CARGO_TYPES = GENERAL_CARGO_FILES.map(file => ({
    value: `glb:${file}`,
    file,
    label: file.replace(/\.glb$/i, '').replace(/[_-]+/g, ' ')
}));
const generalCargoByType = new Map(GENERAL_CARGO_TYPES.map(type => [type.value, type]));
const generalCargoPromises = new Map();

// Models measured as too dark under the application's existing scene lighting.
const GENERAL_CARGO_DARK_MODELS = new Set([
    '02container.glb', '20-BLACK-shipping_container.glb', '40-RED-container.glb',
    '40-shipping_container.glb', 'CAÇAMBA-CHEIA.glb', 'abandoned_wooden_log_pallet.glb',
    'cardboard_boxes_with_plastic_inside.glb', 'cargo_shipping_container_40ft.glb',
    'container-10-PES.glb', 'container-20-VELHO (1).glb', 'container.glb',
    'container_decheterie.glb', 'damaged_cable_roll_2.glb', 'deteriorated_boxes_on_a_pallet.glb',
    'fuel_container.glb', 'gas_tank.glb', 'green_shipping_container.glb', 'logs_on_pallet.glb',
    'mesh_container.glb', 'palet_wooden_-_11mb.glb', 'palete_game_ready.glb',
    'pile_bricks_in_pallet.glb', 'sea_container_-_low_poly.glb',
    'simple_industrial_storage_tank.glb', 'tarp-covered_palettes.glb',
    'wood__boxes_strapped_on_palet.glb'
]);

// Correct horizontal rotations baked into these particular source models.
const GENERAL_CARGO_ROTATIONS = new Map([
    ['02container.glb', -39.25385],
    ['CAÇAMBA-CHEIA.glb', -33.21165],
    ['bobina.glb', -15.03860],
    ['container_with_cooler_prop.glb', 39.98947],
    ['damaged_cable_roll_2.glb', 12.25403],
    ['deteriorated_boxes_on_a_pallet.glb', -9.94359],
    ['large_fluid_container.glb', -44.24086],
    ['small_fluid_container.glb', 43.11983]
]);

function getGeneralCargoBounds(group, precise) {
    if (!precise) return new THREE.Box3().setFromObject(group);

    const bounds = new THREE.Box3();
    const vertex = new THREE.Vector3();
    group.updateMatrixWorld(true);
    group.traverse(child => {
        if (!child.isMesh || !child.geometry.attributes.position) return;
        const positions = child.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i).applyMatrix4(child.matrixWorld);
            bounds.expandByPoint(vertex);
        }
    });
    return bounds;
}

function getCargoLabel(type) {
    return generalCargoByType.get(type)?.label || LOAD_TYPES.find(item => item.value === type)?.label || 'Carga';
}

function loadGeneralCargo(type) {
    if (!generalCargoPromises.has(type)) {
        const model = generalCargoByType.get(type);
        const promise = new Promise((resolve, reject) => {
            loadCompressedGlb(
                `./modelos/cargas/${encodeURIComponent(model.file)}.gz`,
                `./cargas/${encodeURIComponent(model.file)}`
            ).then(source => {
                try {
                    const oriented = new THREE.Group();
                    const aligned = new THREE.Group();
                    aligned.add(source);
                    oriented.add(aligned);
                    const rotation = GENERAL_CARGO_ROTATIONS.get(model.file);
                    aligned.rotation.y = THREE.MathUtils.degToRad(rotation ?? 0);
                    let bounds = getGeneralCargoBounds(oriented, rotation !== undefined);
                    let size = bounds.getSize(new THREE.Vector3());
                    if (size.x > size.z) {
                        aligned.rotation.y += Math.PI / 2;
                        bounds = getGeneralCargoBounds(oriented, rotation !== undefined);
                        size = bounds.getSize(new THREE.Vector3());
                    }
                    if (bounds.isEmpty() || ![size.x, size.y, size.z].every(value => Number.isFinite(value) && value > 0)) {
                        throw new Error('O modelo não possui dimensões 3D válidas.');
                    }
                    const center = bounds.getCenter(new THREE.Vector3());
                    aligned.position.sub(center);
                    const darkMaterials = new Set();
                    oriented.traverse(child => {
                        if (child.isMesh) {
                            child.userData.sharedResource = true;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (GENERAL_CARGO_DARK_MODELS.has(model.file)) {
                                const materials = Array.isArray(child.material) ? child.material : [child.material];
                                materials.forEach(material => darkMaterials.add(material));
                            }
                        }
                    });
                    darkMaterials.forEach(material => {
                        // The renderer outputs linear color and has no environment map for metallic materials.
                        if (material.map) {
                            material.map.encoding = THREE.LinearEncoding;
                            material.map.needsUpdate = true;
                        }
                        if (material.metalness > 0.35) material.metalness = 0.35;
                        material.needsUpdate = true;
                    });
                    resolve({ oriented, size });
                } catch (error) {
                    reject(error);
                }
            }, reject);
        });
        generalCargoPromises.set(type, promise);
        promise.catch(() => {
            if (generalCargoPromises.get(type) === promise) generalCargoPromises.delete(type);
        });
    }
    return generalCargoPromises.get(type);
}

const CONTAINER_LOAD_TYPES = new Set(LOAD_TYPES
    .filter(({ value }) => value.startsWith('container_'))
    .map(({ value }) => value));
const OPEN_TOP_LOAD_TYPES = new Set([
    'container_20', 'container_40',
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
    'container_mae',
    ...FLAT_RACK_LOAD_TYPES,
    ...FLAT_PLATFORM_LOAD_TYPES,
    ...TANK_CONTAINER_LOAD_TYPES
]);
const LOCKED_LOAD_TYPES = new Set([...CONTAINER_LOAD_TYPES, 'caixa_metalica', 'cesta_metalica', 'cesta']);

function isLockedLoad(type, tr) {
    if (LOCKED_LOAD_TYPES.has(type)) return true;
    const model = generalCargoByType.get(type);
    return !!(model && tr && tr.tipo !== 'caminhao' && isMesaOnlyVehicle(tr) &&
        /container|cesta/i.test(model.file));
}

function isContainerLoad(type) {
    const model = generalCargoByType.get(type);
    return CONTAINER_LOAD_TYPES.has(type) || /container/i.test(model?.file || '');
}

function requiresLoadLockClearance(type, tr) {
    if (tr?.modelo === 'truck') return isContainerLoad(type);
    return tr?.tipo !== 'caminhao' && isLockedLoad(type, tr);
}

function getLoadStartClearance(type, tr) {
    if (tr?.modelo === 'truck' && isContainerLoad(type)) return 1;
    if (tr?.tipo === 'caminhao') return 0.1;
    return isLockedLoad(type, tr) ? 1.4 : 0.2;
}

function getPranchaLoadStart(offset, clearance, areaLength, loadLength) {
    if (offset === 0 && loadLength <= areaLength + 1e-9 && clearance + loadLength > areaLength) {
        return Math.max(0, areaLength - loadLength);
    }
    return Math.max(offset, clearance);
}

function getDeckTransitionLength(tr) {
    return tr.tipo === 'reta' ? 0 : (tr.transicao ?? 1.2);
}

function getPranchaAxleArea(tr) {
    const bridgeLength = 3.15;
    const rearTransition = 0.8;
    return tr.tipo === 'reta'
        ? { length: Math.min(bridgeLength, tr.mesa), start: Math.max(0, tr.mesa - bridgeLength), height: 1.6 }
        : { length: tr.mesaEixos ?? bridgeLength - rearTransition, start: tr.mesa + rearTransition, height: tr.h + 0.2 };
}

const inputs = {
    cavalinho: document.getElementById('input_cavalinho'),
    placa_prancha: document.getElementById('input_placa'),
    placa_carreta: document.getElementById('input_placa_carreta'),
    placa_caminhao: document.getElementById('input_placa_caminhao'),
    cComp: document.getElementById('input_carga_comp'),
    cLarg: document.getElementById('input_carga_largura'),
    cAlt: document.getElementById('input_carga_altura'),
    cPeso: document.getElementById('input_carga_peso'),
    cPesoUnit: document.getElementById('input_carga_peso_unit'),
    cQtd: document.getElementById('input_carga_qtd'),
    cCamadas: document.getElementById('input_carga_camadas'),
    cSobreAnterior: document.getElementById('input_empilhar_anterior'),
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

const generalCargo = {
    form: document.getElementById('general_cargo_form'),
    model: document.getElementById('general_cargo_model'),
    comp: document.getElementById('general_cargo_length'),
    larg: document.getElementById('general_cargo_width'),
    alt: document.getElementById('general_cargo_height'),
    peso: document.getElementById('general_cargo_weight'),
    pesoUnit: document.getElementById('general_cargo_weight_unit'),
    qtd: document.getElementById('general_cargo_quantity'),
    camadas: document.getElementById('general_cargo_layers'),
    stack: document.getElementById('general_cargo_stack'),
    add: document.getElementById('general_cargo_add'),
    cancel: document.getElementById('general_cargo_cancel')
};

function weightInTonnes(value, unit) {
    return unit === 'kg' ? Number(value) / 1000 : Number(value);
}

function weightForInput(tonnes, unit) {
    return Number((unit === 'kg' ? tonnes * 1000 : tonnes).toPrecision(15));
}

function configureWeightUnit(input, unit) {
    unit.dataset.previousUnit = unit.value;
    unit.addEventListener('change', () => {
        if (input.value !== '') {
            input.value = weightForInput(weightInTonnes(input.value, unit.dataset.previousUnit), unit.value);
        }
        unit.dataset.previousUnit = unit.value;
        renderListaCargas();
    });
}

configureWeightUnit(inputs.cPeso, inputs.cPesoUnit);
configureWeightUnit(generalCargo.peso, generalCargo.pesoUnit);

function getGeneralCargoPreset(file) {
    if (/container/i.test(file)) {
        const size = file.match(/(?:^|[^0-9])(10|20|40)(?:[^0-9]|$)/)?.[1] || '20';
        const preset = LOAD_TYPES.find(type => type.value === `container_dry_${size}`).preset;
        return { comp: preset[0], larg: preset[1], alt: preset[2] };
    }
    if (/palet|pallet/i.test(file)) return { comp: 1.2, larg: 1.2, alt: 1.4, peso: 0.1 };
    return null;
}

GENERAL_CARGO_TYPES.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    generalCargo.model.appendChild(option);
});
generalCargo.model.addEventListener('change', () => {
    [generalCargo.comp, generalCargo.larg, generalCargo.alt, generalCargo.peso].forEach(input => {
        input.value = '';
    });
    const model = generalCargoByType.get(generalCargo.model.value);
    if (!model) return;
    const preset = getGeneralCargoPreset(model.file);
    if (!preset) return;
    generalCargo.comp.value = preset.comp;
    generalCargo.larg.value = preset.larg;
    generalCargo.alt.value = preset.alt;
    if (preset.peso !== undefined) {
        generalCargo.peso.value = weightForInput(preset.peso, generalCargo.pesoUnit.value);
    }
});

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

let scene, camera, renderer, controls, trailerGroup, loadGroup, sceneGrid;
let currentTrailer = bdVeiculos["carreta_padrao"];
let trailerChassisPromise;
let draw3DRevision = 0;

function applySceneTheme() {
    if (!scene || !sceneGrid) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    const background = dark ? 0x131b2b : 0xeef2f6;
    scene.background = new THREE.Color(background);
    scene.fog = dark ? new THREE.Fog(background, 120, 330) : null;
    const center = new THREE.Color(dark ? 0x526783 : 0xcbd5e1);
    const lines = new THREE.Color(dark ? 0x2c3c54 : 0xe2e8f0);
    const colors = sceneGrid.geometry.getAttribute('color');
    for (let i = 0; i < colors.count; i++) {
        const color = i >= 400 && i < 404 ? center : lines;
        colors.setXYZ(i, color.r, color.g, color.b);
    }
    colors.needsUpdate = true;
}

function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const button = document.getElementById('theme_toggle');
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    document.getElementById('theme_toggle_label').textContent = dark ? 'Claro' : 'Escuro';
    applySceneTheme();
}

applyTheme(document.documentElement.dataset.theme);
document.getElementById('theme_toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
        localStorage.setItem('truck-var-theme', theme);
    } catch (error) {
        console.warn('Não foi possível salvar a preferência de tema.', error);
    }
});

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
                ? loadCompressedGlb(model.url, './scania_S-730.glb')
                : new Promise((resolve, reject) => {
                const loader = new THREE.GLTFLoader();
                loader.load(model.url, gltf => resolve(gltf.scene), undefined, reject);
            });
        cabModelPromises.set(modelId, promise);
        promise.catch(() => {
            if (cabModelPromises.get(modelId) === promise) cabModelPromises.delete(modelId);
        });
    }
    return cabModelPromises.get(modelId);
}

const glbClips = new WeakMap();

function loadCompressedGlb(compressedUrl, uncompressedUrl) {
    const loader = new THREE.GLTFLoader();
    const sceneWithClips = gltf => {
        if (gltf.animations.length) glbClips.set(gltf.scene, gltf.animations);
        return gltf.scene;
    };
    const loadUncompressed = () => new Promise((resolve, reject) => {
        loader.load(uncompressedUrl, gltf => resolve(sceneWithClips(gltf)), undefined, reject);
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
            loader.parse(data, './', gltf => resolve(sceneWithClips(gltf)), reject);
        }))
        .catch(error => {
            console.warn(`Falha ao carregar ${compressedUrl}; tentando o modelo original.`, error);
            return loadUncompressed();
        });
}

function loadTrailerChassis() {
    if (!trailerChassisPromise) {
        const loadPromise = loadCompressedGlb(
            './chassi-para-carreta-14-15.glb.gz',
            './chassi-para-carreta-14-15.glb'
        );
        const promise = loadPromise.catch(error => {
            if (trailerChassisPromise === promise) trailerChassisPromise = undefined;
            throw error;
        });
        trailerChassisPromise = promise;
    }
    return trailerChassisPromise;
}

const rigidVehiclePromises = new Map();
const frontFacadeTextures = new WeakMap();
let ivecoLogoImagePromise;

function loadIvecoLogoImage() {
    if (!ivecoLogoImagePromise) {
        ivecoLogoImagePromise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Não foi possível carregar a logo Iveco.'));
            image.src = './assets/iveco-logo.png';
        });
    }
    return ivecoLogoImagePromise;
}

// Motorista: o modelo sentado (rig Mixamo) tem os braços ajustados ao volante de cada
// veículo e é convertido em malhas estáticas, que podem ser clonadas junto com a cabine.
const DRIVER_MODEL = { height: 1.72, poseTime: 1 };
const DRIVER_MODELS = {
    motorista_1: { url: './motoristas/motorista.glb', compressedUrl: './modelos/motorista.glb.gz' },
    motorista_2: { url: './motoristas/motorista-2.glb', compressedUrl: './modelos/motorista-2.glb.gz' }
};
const driverRigPromises = new Map();
const driverBakes = new Map();

function getSelectedDriverId() {
    const id = document.getElementById('input_motorista')?.value;
    return DRIVER_MODELS[id] ? id : null;
}

function loadDriverRig(driverId = getSelectedDriverId()) {
    if (!driverId) return Promise.resolve(null);
    if (!driverRigPromises.has(driverId)) {
        const model = DRIVER_MODELS[driverId];
        const promise = loadCompressedGlb(model.compressedUrl, model.url)
            .then(source => ({ ...prepareDriverRig(source), id: driverId }))
            .catch(error => {
                console.warn('Não foi possível carregar o motorista; o veículo será exibido sem ele.', error);
                return null;
            });
        driverRigPromises.set(driverId, promise);
    }
    return driverRigPromises.get(driverId);
}

function prepareDriverRig(source) {
    const clip = glbClips.get(source)?.[0];
    const skinned = [];
    const bones = {};
    source.updateMatrixWorld(true);
    source.traverse(node => {
        if (node.isSkinnedMesh) skinned.push(node);
        const name = node.isBone && /^mixamorig\d*:?(.+?)_\d+$/.exec(node.name);
        if (name) bones[name[1]] = node;
    });
    const required = ['Hips', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightArm', 'RightForeArm', 'RightHand'];
    if (!clip || !skinned.length || required.some(name => !bones[name])) {
        throw new Error('O modelo do motorista não possui a postura sentada esperada.');
    }
    const standingHeight = new THREE.Box3().setFromObject(source).getSize(new THREE.Vector3()).y;
    // O modelo traz todos os materiais em BLEND; a ordenação de transparência gera manchas no rosto e no corpo.
    skinned.forEach(mesh => {
        [].concat(mesh.material).forEach(material => {
            material.transparent = false;
            material.alphaTest = 0.5;
            material.depthWrite = true;
            material.needsUpdate = true;
        });
    });
    const mixer = new THREE.AnimationMixer(source);
    mixer.clipAction(clip).play();
    return { source, skinned, bones, mixer, standingHeight };
}

function aimDriverBone(bone, childPosition, targetPosition) {
    const origin = bone.getWorldPosition(new THREE.Vector3());
    const delta = new THREE.Quaternion().setFromUnitVectors(
        childPosition.clone().sub(origin).normalize(),
        targetPosition.clone().sub(origin).normalize()
    );
    const world = bone.getWorldQuaternion(new THREE.Quaternion());
    const parent = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    bone.quaternion.copy(parent.multiply(delta.multiply(world)));
    bone.updateMatrixWorld(true);
}

function reachDriverHand(rig, side, target, pole) {
    const upper = rig.bones[`${side}Arm`];
    const fore = rig.bones[`${side}ForeArm`];
    const hand = rig.bones[`${side}Hand`];
    const shoulder = upper.getWorldPosition(new THREE.Vector3());
    const elbow = fore.getWorldPosition(new THREE.Vector3());
    const wrist = hand.getWorldPosition(new THREE.Vector3());
    const upperLength = shoulder.distanceTo(elbow);
    const foreLength = elbow.distanceTo(wrist);
    const toTarget = target.clone().sub(shoulder);
    const distance = THREE.MathUtils.clamp(
        toTarget.length(), Math.abs(upperLength - foreLength) + 1e-4, upperLength + foreLength - 1e-4
    );
    const axis = toTarget.normalize();
    const along = (upperLength ** 2 - foreLength ** 2 + distance ** 2) / (2 * distance);
    const bend = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
    const side3 = pole.clone().addScaledVector(axis, -pole.dot(axis)).normalize();
    const newElbow = shoulder.clone().addScaledVector(axis, along).addScaledVector(side3, bend);
    aimDriverBone(upper, elbow, newElbow);
    aimDriverBone(fore, hand.getWorldPosition(new THREE.Vector3()), shoulder.clone().addScaledVector(axis, distance));
}

function bakeDriver(rig, layout) {
    const { bones } = rig;
    const scale = DRIVER_MODEL.height * (layout.scale ?? 1) / rig.standingHeight;
    rig.mixer.setTime(DRIVER_MODEL.poseTime);
    rig.source.updateMatrixWorld(true);
    const hips = bones.Hips.getWorldPosition(new THREE.Vector3());

    // Pontos de pegada no aro do volante, em metros a partir do quadril (x = esquerda, y = cima, z = frente).
    const wheel = layout.wheel;
    const tilt = THREE.MathUtils.degToRad(wheel.tilt);
    const grip = THREE.MathUtils.degToRad(wheel.grip ?? 60);
    const rimUp = new THREE.Vector3(0, Math.cos(tilt), Math.sin(tilt));
    const center = new THREE.Vector3(0, wheel.y - layout.y, layout.z - wheel.z);
    [['Left', 1], ['Right', -1]].forEach(([side, sign]) => {
        const point = center.clone()
            .addScaledVector(new THREE.Vector3(sign, 0, 0), Math.sin(grip) * wheel.radius)
            .addScaledVector(rimUp, Math.cos(grip) * wheel.radius);
        reachDriverHand(
            rig, side, hips.clone().addScaledVector(point, 1 / scale),
            new THREE.Vector3(sign * 0.6, -1, -0.35)
        );
        const hand = bones[`${side}Hand`];
        hand.rotateY(sign * (layout.handTwist ?? 0));
        hand.updateMatrixWorld(true);
        ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'].forEach(finger => {
            for (let joint = 1; joint <= 3; joint++) {
                const bone = bones[`${side}Hand${finger}${joint}`];
                if (!bone) continue;
                bone.rotateZ(sign * (layout.fingerCurl ?? 0.7) * (finger === 'Thumb' ? 0.5 : 1));
                bone.updateMatrixWorld(true);
            }
        });
    });

    const group = new THREE.Group();
    const vertex = new THREE.Vector3();
    let lowest = Infinity;
    rig.skinned.forEach(mesh => {
        mesh.skeleton.update();
        const source = mesh.geometry;
        const count = source.attributes.position.count;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            mesh.boneTransform(i, vertex).applyMatrix4(mesh.matrixWorld).sub(hips).multiplyScalar(scale);
            // Achata a parte escondida pelo piso em cabines sem espaço para as pernas.
            if (layout.minY !== undefined) vertex.y = Math.max(vertex.y, layout.minY - layout.y);
            positions.set([vertex.x, vertex.y, vertex.z], i * 3);
            lowest = Math.min(lowest, vertex.y);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        Object.entries(source.attributes).forEach(([name, attribute]) => {
            if (!/^(position|normal|skinIndex|skinWeight)$/.test(name)) geometry.setAttribute(name, attribute);
        });
        if (source.index) geometry.setIndex(source.index);
        geometry.computeVertexNormals();
        const baked = new THREE.Mesh(geometry, mesh.material);
        baked.castShadow = true;
        baked.receiveShadow = false;
        baked.userData.sharedResource = true;
        group.add(baked);
    });
    group.userData.soleY = lowest;
    return group;
}

function getVehicleDriver(rig, vehicleId, layout) {
    const key = `${rig.id}:${vehicleId}`;
    if (!driverBakes.has(key)) driverBakes.set(key, bakeDriver(rig, layout));
    return driverBakes.get(key).clone(true);
}

function addRigidVehicleDriver(root, rig, vehicleId, layout) {
    const front = new THREE.Box3().setFromObject(root).max.z;
    const driver = getVehicleDriver(rig, vehicleId, layout);
    driver.position.set(layout.x, layout.y, front - layout.z);
    root.add(driver);
}

// A cabine recebe escalas diferentes por eixo; o motorista compensa isso para manter as proporções reais.
function addCabDriver(cab, rig, vehicleId, layout, scale) {
    cab.updateMatrixWorld(true);
    const front = new THREE.Box3().setFromObject(cab).max.z;
    const driver = getVehicleDriver(rig, vehicleId, layout);
    const placement = new THREE.Matrix4().compose(
        new THREE.Vector3(layout.x * scale, layout.y * scale, front - layout.z * scale),
        new THREE.Quaternion(),
        new THREE.Vector3(scale, scale, scale)
    );
    driver.matrixAutoUpdate = true;
    new THREE.Matrix4().copy(cab.matrixWorld).invert().multiply(placement)
        .decompose(driver.position, driver.quaternion, driver.scale);
    cab.add(driver);
}

function loadRigidVehicle(tr) {
    const cacheKey = `${tr.modelo}:${getSelectedDriverId() ?? 'none'}`;
    if (!rigidVehiclePromises.has(cacheKey)) {
        const cfg = RIGID_VEHICLE_MODELS[tr.modelo];
        const sourcePromise = loadCompressedGlb(cfg.compressedUrl, cfg.url);
        const logoPromise = cfg.ivecoLogo ? loadIvecoLogoImage() : Promise.resolve(null);
        const driverPromise = cfg.driver ? loadDriverRig() : Promise.resolve(null);
        const promise = Promise.all([sourcePromise, logoPromise, driverPromise])
            .then(([source, logo, driverRig]) => {
                const vehicle = buildRigidVehicle(source, cfg, tr, logo);
                if (driverRig) {
                    try {
                        addRigidVehicleDriver(vehicle, driverRig, tr.modelo, cfg.driver);
                    } catch (error) {
                        console.warn(`Não foi possível posicionar o motorista em ${tr.modelo}.`, error);
                    }
                }
                return vehicle;
            });
        rigidVehiclePromises.set(cacheKey, promise);
        promise.catch(() => {
            if (rigidVehiclePromises.get(cacheKey) === promise) rigidVehiclePromises.delete(cacheKey);
        });
    }
    return rigidVehiclePromises.get(cacheKey);
}

function mergeVehicleGeometries(geometries) {
    const merged = geometries.length === 1 ? geometries[0] : joinVehicleGeometries(geometries);
    merged.computeBoundingBox();
    merged.computeBoundingSphere();
    return merged;
}

function joinVehicleGeometries(geometries) {
    const names = ['position', 'normal', 'uv'].filter(name => geometries.every(g => g.attributes[name]));
    const vertexCount = geometries.reduce((total, g) => total + g.attributes.position.count, 0);
    const indexCount = geometries.reduce(
        (total, g) => total + (g.index ? g.index.count : g.attributes.position.count),
        0
    );
    const merged = new THREE.BufferGeometry();

    const readers = ['getX', 'getY', 'getZ'];
    names.forEach(name => {
        const itemSize = geometries[0].attributes[name].itemSize;
        const array = new Float32Array(vertexCount * itemSize);
        let offset = 0;
        geometries.forEach(g => {
            const attribute = g.attributes[name];
            for (let i = 0; i < attribute.count; i++) {
                for (let c = 0; c < itemSize; c++) {
                    array[(offset + i) * itemSize + c] = attribute[readers[c]](i);
                }
            }
            offset += attribute.count;
        });
        merged.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
    });

    const indices = new Uint32Array(indexCount);
    let vertexOffset = 0;
    let indexOffset = 0;
    geometries.forEach(g => {
        const count = g.index ? g.index.count : g.attributes.position.count;
        for (let i = 0; i < count; i++) {
            indices[indexOffset + i] = vertexOffset + (g.index ? g.index.getX(i) : i);
        }
        indexOffset += count;
        vertexOffset += g.attributes.position.count;
    });
    merged.setIndex(new THREE.BufferAttribute(indices, 1));
    return merged;
}

function recolorFrontFacadeTexture(texture, ivecoLogo) {
    if (frontFacadeTextures.has(texture)) return frontFacadeTextures.get(texture);
    if (!ivecoLogo) {
        throw new Error('A logo Iveco não está disponível para a frente do caminhão.');
    }

    const image = texture.image;
    const width = image?.naturalWidth || image?.width;
    const height = image?.naturalHeight || image?.height;
    if (!width || !height) {
        throw new Error('A textura da frente do caminhão não possui dimensões válidas.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
        throw new Error('Não foi possível preparar a textura da frente do caminhão.');
    }

    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];
        const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const pixel = i / 4;
        const x = (pixel % width) / width;
        const y = Math.floor(pixel / width) / height;
        // A textura embutida usa tons distintos para a grade, o painel e as barras.
        const isLogo = x >= 0.33 && x <= 0.68 && y >= 0.13 && y <= 0.205;
        const blackDetail = !isLogo && (luminance < 25 || (luminance >= 72 && luminance < 170));
        const color = blackDetail ? [8, 10, 12] : [255, 255, 255];
        pixels.data[i] = color[0];
        pixels.data[i + 1] = color[1];
        pixels.data[i + 2] = color[2];
    }
    context.putImageData(pixels, 0, 0);

    const logoBounds = {
        x: width * 0.33,
        y: height * 0.13,
        width: width * 0.35,
        height: height * 0.075
    };
    const logoWidth = logoBounds.width;
    const logoHeight = logoWidth * ivecoLogo.naturalHeight / ivecoLogo.naturalWidth;
    context.drawImage(
        ivecoLogo,
        logoBounds.x,
        logoBounds.y + (logoBounds.height - logoHeight) / 2,
        logoWidth,
        logoHeight
    );

    const recoloredTexture = texture.clone();
    recoloredTexture.image = canvas;
    recoloredTexture.needsUpdate = true;
    frontFacadeTextures.set(texture, recoloredTexture);
    return recoloredTexture;
}

function splitRigidWheelGeometry(geometry, mesh, cfg) {
    const config = cfg.animationWheels;
    if ((config.meshes && !config.meshes.test(mesh.name)) ||
        (config.materials && !config.materials.test(mesh.material?.name || ''))) return null;

    const positions = geometry.attributes.position;
    const index = geometry.index;
    // Alguns GLBs juntam pneus, aros e carroceria em uma única malha.
    const parents = Array.from({ length: positions.count }, (_, i) => i);
    const vertices = new Map();
    const find = i => {
        while (parents[i] !== i) {
            parents[i] = parents[parents[i]];
            i = parents[i];
        }
        return i;
    };
    const join = (a, b) => { parents[find(b)] = find(a); };
    for (let i = 0; i < positions.count; i++) {
        const key = [positions.getX(i), positions.getY(i), positions.getZ(i)]
            .map(value => value.toFixed(5)).join(',');
        if (vertices.has(key)) join(i, vertices.get(key));
        else vertices.set(key, i);
    }
    const count = index ? index.count : positions.count;
    const vertexIndex = i => index ? index.getX(i) : i;
    for (let i = 0; i < count; i += 3) {
        join(vertexIndex(i), vertexIndex(i + 1));
        join(vertexIndex(i), vertexIndex(i + 2));
    }

    const components = new Map();
    const cos = Math.cos(cfg.rotationY), sin = Math.sin(cfg.rotationY);
    for (let i = 0; i < positions.count; i++) {
        const root = find(i);
        if (!components.has(root)) components.set(root, { count: 0, bounds: new THREE.Box3() });
        const component = components.get(root);
        component.count++;
        const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
        component.bounds.expandByPoint(new THREE.Vector3(
            (x * cos + z * sin) * cfg.unit - cfg.bed.centerX,
            y * cfg.unit - cfg.groundY,
            (-x * sin + z * cos) * cfg.unit - cfg.bed.front
        ));
    }
    const componentAxles = new Map();
    components.forEach((component, root) => {
        const bounds = component.bounds;
        if (config.componentCounts && !config.componentCounts.includes(component.count)) return;
        if (bounds.min.x < config.minX * 0.75 && bounds.max.x > -config.minX * 0.75) return;
        const tolerance = config.radius * 1.16;
        if (bounds.min.y < config.y - tolerance || bounds.max.y > config.y + tolerance) return;
        const center = bounds.getCenter(new THREE.Vector3());
        const axle = config.z.findIndex(z =>
            bounds.min.z >= z - tolerance && bounds.max.z <= z + tolerance &&
            (config.maxCenterOffset === undefined ||
                Math.hypot(center.y - config.y, center.z - z) <= config.radius * config.maxCenterOffset));
        if (axle !== -1) componentAxles.set(root, axle);
    });
    const subsets = new Map();
    for (let i = 0; i < count; i += 3) {
        const a = vertexIndex(i), b = vertexIndex(i + 1), c = vertexIndex(i + 2);
        const axle = componentAxles.get(find(a));
        const key = axle === undefined ? -1 : axle;
        if (!subsets.has(key)) subsets.set(key, []);
        subsets.get(key).push(a, b, c);
    }
    return subsets.size === 1 && subsets.has(-1) ? null : subsets;
}

function rigidGeometrySubset(geometry, indices) {
    const result = new THREE.BufferGeometry();
    const remap = new Map();
    const unique = [];
    const mapped = indices.map(index => {
        if (!remap.has(index)) {
            remap.set(index, unique.length);
            unique.push(index);
        }
        return remap.get(index);
    });
    Object.entries(geometry.attributes).forEach(([name, attribute]) => {
        const array = new attribute.array.constructor(unique.length * attribute.itemSize);
        unique.forEach((index, i) => {
            for (let j = 0; j < attribute.itemSize; j++) {
                array[i * attribute.itemSize + j] = attribute.array[index * attribute.itemSize + j];
            }
        });
        result.setAttribute(name, new THREE.BufferAttribute(array, attribute.itemSize, attribute.normalized));
    });
    result.setIndex(mapped);
    return result;
}

// Remodela um caminhão 3D: a carroceria passa a ter exatamente o comprimento, a largura e a
// altura de piso de `spec`, mantendo cabine e rodas com as proporções originais. O resultado
// fica em metros, com a frente da carroceria em z = 0 e a traseira em z = -spec.mesa.
function buildRigidVehicle(source, cfg, spec, ivecoLogo) {
    const { bed, wheels } = cfg;
    const scale = cfg.preScale ?? spec.h / bed.floor;
    const bedLength = bed.front - bed.rear;
    const targetLength = spec.mesa / scale;
    const lengthFactor = targetLength / bedLength;
    const widthFactor = (spec.w / scale) / bed.width;
    const lift = (spec.h / scale) / bed.floor;
    const wheelReach = wheels.radius * 1.12;
    const wheelScale = wheels.scale ?? lift;
    const cos = Math.cos(cfg.rotationY);
    const sin = Math.sin(cfg.rotationY);
    const step = t => {
        const clamped = Math.min(1, Math.max(0, t));
        return clamped * clamped * (3 - 2 * clamped);
    };
    const mapZ = z => z >= 0
        ? z
        : (z >= -bedLength ? z * lengthFactor : z + bedLength - targetLength);
    const mapY = y => y <= bed.floor ? y * lift : y + bed.floor * (lift - 1);

    const reshape = (x, y, z, out, meshWidthFactor = widthFactor, isWheel = false, forceFullWidth = false) => {
        if (Math.abs(x) > wheels.innerX) {
            for (const axleZ of wheels.z) {
                const dz = z - axleZ;
                const dy = y - wheels.radius;
                if (dz * dz + dy * dy < wheelReach * wheelReach) {
                    out[0] = x;
                    out[1] = y * wheelScale + (isWheel ? (wheels.offsetY ?? 0) : 0);
                    out[2] = mapZ(axleZ) + dz * wheelScale;
                    return out;
                }
            }
        }
        const widening = forceFullWidth
            ? 1
            : step((0.2 - z) / 0.5) * step((y - bed.floor * 0.6) / (bed.floor * 0.25));
        out[0] = x * (1 + (meshWidthFactor - 1) * widening);
        out[1] = mapY(y);
        out[2] = mapZ(z);
        return out;
    };

    const paintedMaterials = new Map();
    const paintMaterial = original => {
        if (!original) return original;
        if (paintedMaterials.has(original)) return paintedMaterials.get(original);

        const material = original.clone();
        const name = material.name || '';
        const paint = cfg.paints.find(rule => rule.match.test(name));
        if (paint) {
            material.map = paint.recolorTexture && material.map
                ? recolorFrontFacadeTexture(material.map, ivecoLogo)
                : null;
            material.metalnessMap = null;
            material.roughnessMap = null;
            material.color.setHex(paint.color);
            material.metalness = paint.metalness ?? 0.1;
            material.roughness = paint.roughness ?? 0.5;
        } else if (material.metalness > 0.4) {
            // Sem mapa de ambiente, metais puros aparecem pretos na cena.
            material.metalness = 0.4;
        }
        if (cfg.brighten && !paint && material.map && material.emissive) {
            material.emissive.setHex(0xffffff);
            material.emissiveMap = material.map;
            material.emissiveIntensity = 0.3;
        }
        if (cfg.interior?.test(name) && material.emissive) {
            material.emissive.setHex(0xfff1d6);
            material.emissiveIntensity = /Dashboard|LED/i.test(name) ? 0.9 : 0.3;
        }
        if (cfg.glassMaterial?.test(name)) {
            material.color.setHex(0xe6eef2);
            material.transparent = true;
            material.opacity = 0.25;
            material.depthWrite = false;
            material.metalness = 0;
            material.roughness = 0.2;
        }
        material.needsUpdate = true;
        paintedMaterials.set(original, material);
        return material;
    };

    source.updateMatrixWorld(true);
    const meshes = [];
    source.traverse(node => {
        if (node.isMesh) meshes.push(node);
    });

    const point = [0, 0, 0];
    const geometriesByMaterial = new Map();
    const hiddenTransportGeometries = new Map();
    const wheelGeometries = cfg.animationWheels.z.map(() => new Map());
    const wheelTireBounds = cfg.animationWheels.z.map(() => new THREE.Box3());
    meshes.forEach(mesh => {
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        if (mesh.matrixWorld.determinant() < 0 && geometry.index) {
            const index = geometry.index;
            for (let i = 0; i < index.count; i += 3) {
                const second = index.getX(i + 1);
                index.setX(i + 1, index.getX(i + 2));
                index.setX(i + 2, second);
            }
        }

        const hiddenInTransport = cfg.animationWheels.hiddenMeshes?.test(mesh.name);
        const subsets = hiddenInTransport ? null : splitRigidWheelGeometry(geometry, mesh, cfg);
        const positions = geometry.attributes.position;
        const wheelAxles = subsets ? new Int16Array(positions.count).fill(-1) : null;
        if (subsets) subsets.forEach((indices, axle) => {
            if (axle >= 0) indices.forEach(index => { wheelAxles[index] = axle; });
        });
        const isTimberFloor = mesh.material?.name === 'Ascot_timber' && bed.floorWidth;
        const meshWidthFactor = isTimberFloor
            ? (spec.w / scale) / bed.floorWidth
            : widthFactor;
        const isWheel = /^Tire_/i.test(mesh.name);
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const modelX = (x * cos + z * sin) * cfg.unit - bed.centerX;
            const modelY = y * cfg.unit - cfg.groundY;
            const modelZ = (-x * sin + z * cos) * cfg.unit - bed.front;
            const axle = wheelAxles ? wheelAxles[i] : -1;
            if (axle >= 0) {
                const axleZ = cfg.animationWheels.z[axle];
                point[0] = modelX;
                point[1] = modelY * wheelScale + (wheels.offsetY ?? 0);
                point[2] = mapZ(axleZ) + (modelZ - axleZ) * wheelScale;
            } else {
                reshape(modelX, modelY, modelZ, point, meshWidthFactor, isWheel, Boolean(isTimberFloor));
            }
            positions.setXYZ(i, point[0] * scale, point[1] * scale, point[2] * scale);
        }
        const normals = geometry.attributes.normal;
        if (normals) {
            for (let i = 0; i < normals.count; i++) {
                const x = normals.getX(i);
                const z = normals.getZ(i);
                normals.setXYZ(i, x * cos + z * sin, normals.getY(i), -x * sin + z * cos);
            }
        }

        const material = paintMaterial(mesh.material);
        if (!subsets) {
            const target = hiddenInTransport ? hiddenTransportGeometries : geometriesByMaterial;
            if (!target.has(material)) target.set(material, []);
            target.get(material).push(geometry);
        } else {
            subsets.forEach((indices, axle) => {
                const part = rigidGeometrySubset(geometry, indices);
                const target = axle < 0 ? geometriesByMaterial : wheelGeometries[axle];
                if (!target.has(material)) target.set(material, []);
                target.get(material).push(part);
                if (axle >= 0) {
                    part.computeBoundingBox();
                    const size = part.boundingBox.getSize(new THREE.Vector3());
                    if (size.y > cfg.animationWheels.radius * scale) {
                        wheelTireBounds[axle].union(part.boundingBox);
                    }
                }
            });
            geometry.dispose();
        }
    });

    // Junta as peças que usam o mesmo material para reduzir as chamadas de desenho.
    const root = new THREE.Group();
    geometriesByMaterial.forEach((geometries, material) => {
        const merged = new THREE.Mesh(mergeVehicleGeometries(geometries), material);
        merged.castShadow = true;
        merged.receiveShadow = true;
        merged.userData.sharedResource = true;
        root.add(merged);
    });
    hiddenTransportGeometries.forEach((geometries, material) => {
        const merged = new THREE.Mesh(mergeVehicleGeometries(geometries), material);
        merged.castShadow = true;
        merged.receiveShadow = true;
        merged.userData.sharedResource = true;
        merged.userData.hiddenInTransport = true;
        root.add(merged);
    });
    wheelGeometries.forEach((materials, axle) => {
        if (!materials.size) return;
        if (wheelTireBounds[axle].isEmpty()) {
            materials.forEach(geometries => geometries.forEach(geometry => {
                geometry.computeBoundingBox();
                wheelTireBounds[axle].union(geometry.boundingBox);
            }));
        }
        const center = wheelTireBounds[axle].getCenter(new THREE.Vector3());
        const pivot = new THREE.Group();
        pivot.position.set(0, center.y, center.z);
        pivot.userData.rigidWheelRadius = wheelTireBounds[axle].getSize(new THREE.Vector3()).y / 2;
        materials.forEach((geometries, material) => {
            const merged = new THREE.Mesh(mergeVehicleGeometries(geometries), material);
            merged.position.set(0, -center.y, -center.z);
            merged.castShadow = true;
            merged.receiveShadow = true;
            merged.userData.sharedResource = true;
            pivot.add(merged);
        });
        root.add(pivot);
    });

    if (cfg.bedFloorColor !== undefined) {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(spec.w_util, spec.mesa),
            new THREE.MeshStandardMaterial({
                color: cfg.bedFloorColor,
                metalness: 0,
                roughness: 0.9
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, spec.h + 0.003, -spec.mesa / 2);
        floor.receiveShadow = true;
        floor.userData.sharedResource = true;
        root.add(floor);
    }

    reshape(cfg.cabLight.x, cfg.cabLight.y, cfg.cabLight.z, point);
    const cabinLight = new THREE.PointLight(0xfff1dc, 2.4, 7, 2);
    cabinLight.position.set(point[0] * scale, point[1] * scale, point[2] * scale);
    root.add(cabinLight);

    return root;
}

function setVehicleModelStatus(message, isError = false) {
    const status = document.getElementById('vehicle_model_status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('hidden', !message);
    status.classList.toggle('text-red-700', isError);
    status.classList.toggle('text-slate-600', !isError);
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
    if (inputs.placa_caminhao.value) return inputs.placa_caminhao.value;
    return "prancha_reb_6_3";
}

function setVehicleSelectorTab(tab) {
    document.querySelectorAll('[data-vehicle-tab]').forEach(button => {
        const isActive = button.dataset.vehicleTab === tab;
        button.classList.toggle('vehicle-tab-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
    });

    ['cavalinho', 'prancha', 'carreta', 'caminhao'].forEach(panel => {
        document.getElementById(`panel_${panel}`).classList.toggle('hidden', panel !== tab);
    });
}

document.querySelectorAll('[data-vehicle-tab]').forEach(button => {
    button.addEventListener('click', () => setVehicleSelectorTab(button.dataset.vehicleTab));
});
setVehicleSelectorTab('carreta');

inputs.cavalinho.addEventListener('change', analyzeAndDraw);
document.getElementById('input_motorista').addEventListener('change', analyzeAndDraw);
inputs.posicao.addEventListener('change', analyzeAndDraw);
inputs.tampas.addEventListener('change', analyzeAndDraw);
inputs.placa_prancha.addEventListener('change', () => {
    if (inputs.placa_prancha.value) {
        inputs.placa_carreta.value = "";
        inputs.placa_caminhao.value = "";
        setVehicleSelectorTab('prancha');
    }
    updateTrailerInfo();
});
inputs.placa_carreta.addEventListener('change', () => {
    if (inputs.placa_carreta.value) {
        inputs.placa_prancha.value = "";
        inputs.placa_caminhao.value = "";
        setVehicleSelectorTab('carreta');
    }
    updateTrailerInfo();
});
inputs.placa_caminhao.addEventListener('change', () => {
    if (inputs.placa_caminhao.value) {
        inputs.placa_prancha.value = "";
        inputs.placa_carreta.value = "";
        setVehicleSelectorTab('caminhao');
    }
    updateTrailerInfo();
});

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
    const camadas = Math.max(1, Number.parseInt(carga.camadas, 10) || 1);
    const pecasNaBase = Math.ceil(cQtd / camadas);
    const standardGap = getLoadGap(type);
    const usesGates = usesSideGates(tr, isCarreta);
    const availableWidth = usesGates ? tr.w_util : tr.w;
    const lockClearance = isCarreta && requiresLoadLockClearance(type, tr)
        ? getLoadStartClearance(type, tr)
        : 0;
    const isDistributed = isCarreta &&
        peso * cQtd > tr.cap / 2 &&
        pecasNaBase > 1 &&
        pecasNaBase * cComp + lockClearance <= tr.mesa;
    const gap = isDistributed
        ? (tr.mesa - lockClearance - pecasNaBase * cComp) / (pecasNaBase - 1)
        : standardGap;

    let maxCols = isDistributed
        ? 1
        : Math.floor((availableWidth + gap) / (cLarg + gap));
    if (maxCols < 1) maxCols = 1;

    const rows = Math.ceil(pecasNaBase / maxCols);
    const totalComp = rows * cComp + Math.max(0, rows - 1) * gap;
    const maxItemsInRow = Math.min(pecasNaBase, maxCols);
    const totalLarg = maxItemsInRow * cLarg + Math.max(0, maxItemsInRow - 1) * gap;

    return {
        maxCols,
        rows,
        totalComp,
        totalLarg,
        availableWidth,
        centerX: getLoadAreaCenterX(tr),
        gap,
        isDistributed,
        pecasNaBase,
        camadas,
        maxStackHeight: carga.alt * Math.min(camadas, cQtd)
    };
}

function getStackCount(carga, baseIndex, camadas = Math.max(1, Number.parseInt(carga.camadas, 10) || 1)) {
    return Math.max(0, Math.min(camadas, carga.qtd - baseIndex * camadas));
}

function applyStackingPositions(loads, allocations) {
    const loadsByCompositionIndex = new Map();
    loads.forEach(load => {
        load.stackBaseHeight = 0;
        const previousLoad = load.carga.colocarSobreAnterior && allocations[load.compositionIndex - 1] > 0
            ? loadsByCompositionIndex.get(load.compositionIndex - 1)
            : null;
        if (previousLoad) {
            load.startOffset = previousLoad.startOffset;
            load.stackBaseHeight = previousLoad.stackBaseHeight + previousLoad.grid.maxStackHeight;
        }
        loadsByCompositionIndex.set(load.compositionIndex, load);
    });
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

function getTubePositions(tube, limit = Math.min(tube.loaded, 1200), centerXmm = 0) {
    const positions = [];
    for (let layer = 0; layer < tube.loadedLayerCounts.length && positions.length < limit; layer++) {
        const count = Math.min(tube.loadedLayerCounts[layer], limit - positions.length);
        for (let index = 0; index < count && positions.length < limit; index++) {
            positions.push({
                xMm: centerXmm + (index - (count - 1) / 2) * tube.diameterMm,
                layer
            });
        }
    }
    return positions;
}

function positionLoadAllocations(tr, isCarreta, allocations) {
    let mesaOffset = 0;
    let eixoOffset = 0;
    const pos = inputs.posicao.value;
    const loads = composicaoCargas.flatMap((originalCarga, index) => {
        const qtdAlocada = allocations[index] || 0;
        if (qtdAlocada <= 0) return [];
        const carga = { ...originalCarga, qtd: qtdAlocada, qtdAlocada };
        const splitCoils = !isCarreta && tr.pescoco > 0 &&
            (carga.type === 'bobina_lado_2' || carga.type === 'bobina_frente_2');
        const clearance = getLoadStartClearance(carga.type, tr);
        const coilLength = splitCoils ? carga.comp / 2 : carga.comp;
        const grid = getGridMetrics(tr, carga, isCarreta, coilLength);
        const isConcentrada = isCarreta &&
            carga.qtd === 1 &&
            carga.peso * carga.qtd > tr.cap / 2 &&
            grid.totalComp + grid.gap < tr.mesa / 2;
        return [{
            carga,
            originalCarga,
            compositionIndex: index,
            grid,
            clearance,
            splitCoils,
            coilLength,
            isConcentrada
        }];
    });

    if (isCarreta) {
        const distributedLoads = loads.filter(load => load.grid.isDistributed);
        if (distributedLoads.length) {
            distributedLoads.forEach(load => {
                load.startOffset = requiresLoadLockClearance(load.carga.type, tr)
                    ? load.clearance
                    : 0;
            });
            const positionedLoadsByIndex = new Map(
                distributedLoads.map(load => [load.compositionIndex, load])
            );
            let normalOffset = tr.mesa;
            loads.filter(load => !load.grid.isDistributed).forEach(load => {
                const previousLoad = load.carga.colocarSobreAnterior &&
                    allocations[load.compositionIndex - 1] > 0
                    ? positionedLoadsByIndex.get(load.compositionIndex - 1)
                    : null;
                if (previousLoad) {
                    load.startOffset = previousLoad.startOffset;
                    positionedLoadsByIndex.set(load.compositionIndex, load);
                    return;
                }
                load.startOffset = normalOffset;
                normalOffset += load.grid.totalComp + load.grid.gap;
                positionedLoadsByIndex.set(load.compositionIndex, load);
            });
            applyStackingPositions(loads, allocations);
            const mesaComp = loads.reduce(
                (maxEnd, load) => Math.max(maxEnd, load.startOffset + load.grid.totalComp),
                0
            );
            return {
                loads,
                totalComp: mesaComp,
                mesaComp,
                eixoComp: 0,
                allocations
            };
        }

        const concentratedLoads = loads.filter(load => load.isConcentrada);
        let concentratedEnd = 0;
        let concentratedStart = 0;
        let concentratedCursor = 0;
        const concentratedPositionsByIndex = new Map();
        let lastConcentratedGap = 0;
        if (concentratedLoads.length) {
            concentratedLoads.forEach(load => {
                const previousLoad = load.carga.colocarSobreAnterior &&
                    allocations[load.compositionIndex - 1] > 0
                    ? concentratedPositionsByIndex.get(load.compositionIndex - 1)
                    : null;
                if (previousLoad) {
                    load.startOffset = previousLoad.startOffset;
                    concentratedPositionsByIndex.set(load.compositionIndex, load);
                    return;
                }
                if (concentratedPositionsByIndex.size > 0) {
                    concentratedCursor += lastConcentratedGap;
                }
                load.startOffset = concentratedCursor;
                concentratedCursor += load.grid.totalComp;
                lastConcentratedGap = load.grid.gap;
                concentratedPositionsByIndex.set(load.compositionIndex, load);
            });
            const concentratedLength = concentratedCursor;
            const axleLayout = getCarretaAxleLayout(tr);
            const axleCenterFromRear = axleLayout.firstFromRear +
                (Math.max(1, tr.eixos) - 1) * axleLayout.spacing / 2;
            const axleCenterOffset = tr.mesa - axleCenterFromRear;
            const minimumStart = concentratedLoads.reduce(
                (min, load) => requiresLoadLockClearance(load.carga.type, tr)
                    ? Math.max(min, load.clearance - load.startOffset)
                    : min,
                0
            );
            concentratedStart = Math.max(
                minimumStart,
                Math.min(tr.mesa - concentratedLength, axleCenterOffset - concentratedLength / 2)
            );
            concentratedLoads.forEach(load => {
                load.startOffset += concentratedStart;
            });
            concentratedEnd = concentratedStart + concentratedLength;
        }

        const positionedLoadsByIndex = new Map(
            concentratedLoads.map(load => [load.compositionIndex, load])
        );
        let normalFrontOffset = 0;
        let normalRearOffset = concentratedEnd;
        let normalRearGap = concentratedLoads.length ? lastConcentratedGap : 0;
        let rearQueueStarted = false;
        loads.filter(load => !load.isConcentrada).forEach(load => {
            const previousLoad = load.carga.colocarSobreAnterior &&
                allocations[load.compositionIndex - 1] > 0
                ? positionedLoadsByIndex.get(load.compositionIndex - 1)
                : null;
            if (previousLoad) {
                load.startOffset = previousLoad.startOffset;
                positionedLoadsByIndex.set(load.compositionIndex, load);
                return;
            }
            const candidateStartOffset = Math.max(normalFrontOffset, load.clearance);
            const fitsBeforeConcentrated = !concentratedLoads.length ||
                (candidateStartOffset + load.grid.totalComp + load.grid.gap <= concentratedStart);
            if (!rearQueueStarted && fitsBeforeConcentrated) {
                load.startOffset = candidateStartOffset;
                normalFrontOffset = candidateStartOffset + load.grid.totalComp + load.grid.gap;
                positionedLoadsByIndex.set(load.compositionIndex, load);
                return;
            }

            rearQueueStarted = true;
            load.startOffset = normalRearOffset + normalRearGap;
            if (requiresLoadLockClearance(load.carga.type, tr)) {
                load.startOffset = Math.max(load.startOffset, load.clearance);
            }
            normalRearOffset = load.startOffset + load.grid.totalComp;
            normalRearGap = load.grid.gap;
            positionedLoadsByIndex.set(load.compositionIndex, load);
        });

        applyStackingPositions(loads, allocations);
        const mesaComp = loads.reduce(
            (maxEnd, load) => Math.max(maxEnd, load.startOffset + load.grid.totalComp),
            0
        );
        return { loads, totalComp: mesaComp, mesaComp, eixoComp: 0, allocations };
    }

    let mesaEnd = 0;
    let eixoEnd = 0;
    const axleArea = getPranchaAxleArea(tr);
    const mesaLength = tr.tipo === 'reta' && loads.some(load => load.splitCoils)
        ? axleArea.start : tr.mesa;
    const positionedLoadsByIndex = new Map();
    loads.forEach(load => {
        const { grid, clearance, splitCoils } = load;
        const gap = grid.gap;
        const previousLoad = load.carga.colocarSobreAnterior && allocations[load.compositionIndex - 1] > 0
            ? positionedLoadsByIndex.get(load.compositionIndex - 1)
            : null;
        if (previousLoad) {
            load.startOffset = previousLoad.startOffset;
            load.stackBaseHeight = previousLoad.stackBaseHeight + previousLoad.grid.maxStackHeight;
            if (splitCoils) {
                load.mesaStartOffset = previousLoad.mesaStartOffset ?? previousLoad.startOffset;
                load.eixoStartOffset = previousLoad.eixoStartOffset ?? previousLoad.startOffset;
                mesaEnd = Math.max(mesaEnd, load.mesaStartOffset + grid.totalComp);
                eixoEnd = Math.max(eixoEnd, load.eixoStartOffset + grid.totalComp);
            } else {
                load.inEixos = previousLoad.splitCoils
                    ? pos === 'eixos'
                    : previousLoad.inEixos;
                if (previousLoad.splitCoils) {
                    load.startOffset = load.inEixos ? previousLoad.eixoStartOffset : previousLoad.mesaStartOffset;
                }
                if (load.inEixos) {
                    eixoEnd = Math.max(eixoEnd, load.startOffset + grid.totalComp);
                } else {
                    mesaEnd = Math.max(mesaEnd, load.startOffset + grid.totalComp);
                }
            }
            positionedLoadsByIndex.set(load.compositionIndex, load);
            return;
        }
        load.stackBaseHeight = 0;
        if (splitCoils) {
            const mesaStartOffset = getPranchaLoadStart(mesaOffset, clearance, mesaLength, grid.totalComp);
            const eixoStartOffset = getPranchaLoadStart(eixoOffset, clearance, axleArea.length, grid.totalComp);
            mesaOffset = mesaStartOffset + grid.totalComp + gap;
            eixoOffset = eixoStartOffset + grid.totalComp + gap;
            mesaEnd = Math.max(mesaEnd, mesaStartOffset + grid.totalComp);
            eixoEnd = Math.max(eixoEnd, eixoStartOffset + grid.totalComp);
            Object.assign(load, {
                startOffset: pos === 'eixos' ? eixoStartOffset : mesaStartOffset,
                mesaStartOffset,
                eixoStartOffset
            });
            positionedLoadsByIndex.set(load.compositionIndex, load);
            return;
        }

        const inEixos = pos === 'eixos';
        load.inEixos = inEixos;
        const startOffset = getPranchaLoadStart(
            inEixos ? eixoOffset : mesaOffset,
            clearance,
            inEixos ? axleArea.length : mesaLength,
            grid.totalComp
        );
        if (inEixos) {
            eixoOffset = startOffset + grid.totalComp + gap;
            eixoEnd = Math.max(eixoEnd, startOffset + grid.totalComp);
        } else {
            mesaOffset = startOffset + grid.totalComp + gap;
            mesaEnd = Math.max(mesaEnd, startOffset + grid.totalComp);
        }
        Object.assign(load, { startOffset });
        positionedLoadsByIndex.set(load.compositionIndex, load);
    });

    return {
        loads,
        totalComp: pos === 'eixos' ? eixoEnd : mesaEnd,
        mesaComp: mesaEnd,
        eixoComp: eixoEnd,
        allocations
    };
}

function getLoadSequenceMetrics(tr, isCarreta) {
    const allocations = composicaoCargas.map(() => 0);
    cargasTransbordo = [];

    // O peso gera alerta operacional, mas não deve ocultar a carga na prévia.
    const fitsCargoArea = sequence => {
        if (isCarreta) return sequence.mesaComp <= tr.mesa + 1e-9;
        const axleArea = getPranchaAxleArea(tr);
        const mesaLimit = tr.tipo === 'reta' && sequence.eixoComp > 0
            ? axleArea.start : tr.mesa;
        return sequence.mesaComp <= mesaLimit + 1e-9 &&
            sequence.eixoComp <= axleArea.length + 1e-9;
    };

    composicaoCargas.forEach((carga, index) => {
        let low = 0;
        let high = carga.qtd;
        while (low < high) {
            const candidate = Math.ceil((low + high) / 2);
            allocations[index] = candidate;
            const sequence = positionLoadAllocations(tr, isCarreta, allocations);
            if (fitsCargoArea(sequence)) low = candidate;
            else high = candidate - 1;
        }
        allocations[index] = low;
        const qtdExcedente = carga.qtd - low;
        if (qtdExcedente > 0) {
            cargasTransbordo.push({ ...carga, qtd: qtdExcedente, qtdExcedente });
        }
    });

    return positionLoadAllocations(tr, isCarreta, allocations);
}

const lashingEquipment = {
    polyester_strap: 'Cinta de Poliéster',
    chain_grade_8: 'Corrente Grau 8',
    steel_cable: 'Cabo de Aço'
};
const lashingArrangements = {
    transverse: 'Transversal / Direto',
    crossed: 'Diagonal / Cruzado em X',
    longitudinal: 'Longitudinal / Amadrinhado'
};
const lashingFields = Object.fromEntries([
    'item', 'equipment', 'count', 'arrangement'
].map(name => [name, document.getElementById(`lashing_${name}`)]));
const lashingMessage = document.getElementById('lashing_form_message');
const lashingAnalysis = document.getElementById('lashing_analysis');
let lashingPreview = null;

function defaultLashing() {
    return { version: 2, equipment: 'polyester_strap', count: 2, arrangement: 'transverse' };
}

function validLashing(plan) {
    return plan && plan.version === 2 &&
        Object.prototype.hasOwnProperty.call(lashingEquipment, plan.equipment) &&
        Object.prototype.hasOwnProperty.call(lashingArrangements, plan.arrangement) &&
        Number.isInteger(plan.count) && plan.count >= 1 && plan.count <= 100;
}

function validLegacyLashing(plan) {
    return plan && plan.version === undefined &&
        ['strap5', 'strap10', 'chain8', 'chain10', 'chain13'].includes(plan.equipment) &&
        ['top', 'direct'].includes(plan.method) && ['wood', 'steel', 'rubber'].includes(plan.surface) &&
        (plan.method === 'direct' && plan.stf === null || Number.isFinite(plan.stf) && plan.stf > 0) &&
        Number.isFinite(plan.lc) && plan.lc > 0 &&
        Number.isFinite(plan.alpha) && plan.alpha > 0 && plan.alpha <= 90 &&
        [1.5, 2].includes(plan.k) && Number.isInteger(plan.count) && plan.count >= 1 && plan.count <= 100 &&
        (plan.cg === null || (Number.isFinite(plan.cg) && plan.cg > 0)) &&
        typeof plan.front === 'boolean' && typeof plan.side === 'boolean' &&
        [plan.frontCapacity, plan.sideCapacity].every(value => value === null || (Number.isFinite(value) && value >= 0));
}

function illustrativeLashingPoints(plan, index, width, length, top, hookY, anchorX, clearance) {
    if (plan.arrangement === 'crossed') {
        const groups = Math.ceil(plan.count / 2);
        const segment = length * 0.85 / groups;
        const center = -length * 0.425 + (Math.floor(index / 2) + 0.5) * segment;
        const direction = index % 2 === 0 ? 1 : -1;
        const z1 = center - direction * segment * 0.4;
        const z2 = center + direction * segment * 0.4;
        return [
            [anchorX[0], hookY, z1],
            [-width / 2 - clearance, top, z1],
            [width / 2 + clearance, top, z2],
            [anchorX[1], hookY, z2]
        ];
    }
    const x = ((index + 1) / (plan.count + 1) - 0.5) * width * 0.85;
    const end = length / 2 + clearance;
    return [[x, hookY, -end], [x, top, -length / 2], [x, top, length / 2], [x, hookY, end]];
}

function cylindricalLashingPoints(carga, plan, index, width, height, length, scale, hookY, anchorX, clearance, splitCoils) {
    const coil = carga.type.startsWith('bobina_');
    if (!coil && carga.type !== 'vaso') return null;

    const axis = coil && carga.type.includes('_lado_') ? 'x' : 'z';
    const coilCount = coil && carga.type.endsWith('_2') && !splitCoils ? 2 : 1;
    const section = length / coilCount;
    const radius = coil
        ? Math.max(0.06 * scale, Math.min(height, axis === 'x' ? section : width) * 0.46)
        : Math.min(width, height) * 0.39;
    const outer = radius * 1.08 + Math.max(0.045 * scale, radius * 0.055);
    const centerY = coil ? -height / 2 + height * 0.08 + outer : 0;
    const axialLength = coil ? (axis === 'x' ? width : section) * 0.78 : length * 0.78;
    const bodyRadius = coil ? radius * 0.67 + Math.max(0.025 * scale, radius * 0.025) : radius;
    const flangePosition = axialLength * 0.43;
    const flangeWidth = Math.max(0.045 * scale, radius * 0.055);
    const group = plan.arrangement === 'crossed' ? Math.floor(index / 2) : index;
    const groups = plan.arrangement === 'crossed' ? Math.ceil(plan.count / 2) : plan.count;
    const coilIndex = group % coilCount;
    const localIndex = Math.floor(group / coilCount);
    const localCount = Math.ceil((groups - coilIndex) / coilCount);
    const centerZ = coilCount === 1 ? 0 : -length / 2 + section * (coilIndex + 0.5);
    const radiusAt = axial => {
        const flange = coil ? Math.max(0, 1 - Math.abs(Math.abs(axial) - flangePosition) / (flangeWidth * 2)) : 0;
        return bodyRadius + (outer - bodyRadius) * flange + clearance;
    };
    const steps = 32;
    const points = [];
    const alongAxis = (localIndex + 1) / (localCount + 1) - 0.5;
    const crossed = plan.arrangement === 'crossed';
    const direction = index % 2 === 0 ? 1 : -1;

    if ((axis === 'z' && plan.arrangement !== 'longitudinal') ||
        (axis === 'x' && plan.arrangement !== 'transverse')) {
        const fixed = alongAxis * axialLength * 0.55;
        const segment = axialLength * 0.7 / localCount;
        const center = -axialLength * 0.35 + (localIndex + 0.5) * segment;
        for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const axial = crossed
                ? (axis === 'z' ? center + direction * (t - 0.5) * segment * 0.8 : (t - 0.5) * axialLength * 0.7)
                : fixed;
            const angle = axis === 'x' && crossed && direction < 0 ? Math.PI * t : Math.PI * (1 - t);
            const r = radiusAt(axial);
            const radial = Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            points.push(axis === 'z' ? [radial, y, centerZ + axial] : [axial, y, centerZ + radial]);
        }
    } else {
        const radial = alongAxis * bodyRadius * 1.5;
        const end = axialLength * 0.46;
        for (let step = 0; step <= steps; step++) {
            const axial = -end + 2 * end * step / steps;
            const r = radiusAt(axial);
            const y = centerY + Math.sqrt(Math.max(0, r * r - radial * radial));
            points.push(axis === 'z' ? [radial, y, centerZ + axial] : [axial, y, centerZ + radial]);
        }
    }

    const first = points[0];
    const last = points[points.length - 1];
    if (plan.arrangement === 'longitudinal') {
        points.unshift([first[0], hookY, first[2] - clearance]);
        points.push([last[0], hookY, last[2] + clearance]);
    } else {
        points.unshift([anchorX[0], hookY, first[2]]);
        points.push([anchorX[1], hookY, last[2]]);
    }
    return points;
}

function lashingFromForm() {
    return {
        version: 2, equipment: lashingFields.equipment.value,
        count: Number(lashingFields.count.value), arrangement: lashingFields.arrangement.value
    };
}

function showLashingForm() {
    lashingPreview = null;
    const carga = selectedLashingCargo();
    const saved = carga?.lashing;
    const legacy = validLegacyLashing(saved);
    const plan = legacy ? {
        equipment: saved.equipment.startsWith('chain') ? 'chain_grade_8' : 'polyester_strap',
        count: saved.count, arrangement: ''
    } : saved || defaultLashing();
    ['equipment', 'count', 'arrangement'].forEach(name => { lashingFields[name].value = plan[name]; });
    lashingMessage.textContent = !carga ? 'Adicione uma carga para configurar a amarração.'
        : legacy ? 'Amarração antiga preservada. Escolha um arranjo e salve para atualizar; os dados antigos serão substituídos.' : '';
}

function selectedLashingCargo() {
    return lashingFields.item.value === '' ? null : composicaoCargas[Number(lashingFields.item.value)];
}

function displayedLashing(carga) {
    if (lashingPreview?.carga === carga) return lashingPreview.plan;
    return validLashing(carga.lashing) ? carga.lashing : null;
}

function previewLashing() {
    const carga = selectedLashingCargo();
    const plan = lashingFromForm();
    lashingPreview = carga && validLashing(plan) ? { carga, plan } : null;
    if (carga && validLegacyLashing(carga.lashing) && !plan.arrangement) {
        lashingMessage.textContent = 'Amarração antiga preservada. Escolha um arranjo e salve para atualizar; os dados antigos serão substituídos.';
    } else {
        lashingMessage.textContent = !carga ? 'Adicione uma carga para configurar a amarração.'
            : lashingPreview ? 'Prévia não salva.' : 'Informe um arranjo e uma quantidade inteira entre 1 e 100 para visualizar a prévia.';
    }
    analyzeAndDraw();
}

function refreshLashingItems() {
    const selected = lashingFields.item.value;
    lashingFields.item.replaceChildren();
    composicaoCargas.forEach((carga, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${index + 1}. ${getCargoLabel(carga.type)} (${carga.qtd} peça(s))`;
        lashingFields.item.appendChild(option);
    });
    if ([...lashingFields.item.options].some(option => option.value === selected)) lashingFields.item.value = selected;
    showLashingForm();
}

lashingFields.item.addEventListener('change', () => {
    showLashingForm();
    analyzeAndDraw();
});
['equipment', 'count', 'arrangement'].forEach(name => lashingFields[name].addEventListener('input', previewLashing));
document.getElementById('lashing_form').addEventListener('submit', event => {
    event.preventDefault();
    const carga = selectedLashingCargo();
    const plan = lashingFromForm();
    if (!carga || !validLashing(plan)) {
        lashingMessage.textContent = 'Selecione uma carga, um arranjo e uma quantidade inteira entre 1 e 100.';
        return;
    }
    carga.lashing = plan;
    lashingPreview = null;
    lashingMessage.textContent = 'Amarração aplicada a cada peça. Para guardar na nuvem, use Salvar planejamento.';
    analyzeAndDraw();
});
document.getElementById('lashing_remove').addEventListener('click', () => {
    const carga = selectedLashingCargo();
    if (!carga) return;
    delete carga.lashing;
    showLashingForm();
    lashingMessage.textContent = 'Amarração removida.';
    analyzeAndDraw();
});

function renderLashingAnalysis(loadSequence) {
    lashingAnalysis.replaceChildren();
    lashingAnalysis.classList.toggle('hidden', loadSequence.loads.length === 0);
    if (!loadSequence.loads.length) return;
    const title = document.createElement('h3');
    title.className = 'mb-2 font-bold uppercase';
    title.textContent = 'Amarração ilustrativa por peça';
    lashingAnalysis.appendChild(title);
    loadSequence.loads.forEach(({ carga, originalCarga }) => {
        const plan = displayedLashing(originalCarga);
        const section = document.createElement('div');
        section.className = 'mb-3 border-t border-amber-300 pt-2';
        const heading = document.createElement('strong');
        heading.textContent = plan
            ? `${getCargoLabel(carga.type)} — ${plan.count} peça(s): ${lashingEquipment[plan.equipment]} — ${lashingArrangements[plan.arrangement]}${lashingPreview?.carga === originalCarga ? ' (prévia não salva)' : ''}`
            : `${getCargoLabel(carga.type)} — ${validLegacyLashing(carga.lashing) ? 'amarração antiga: escolha um arranjo para ilustrar' : 'sem amarração configurada'}`;
        section.appendChild(heading);
        const warning = document.createElement('p');
        warning.className = 'mt-1 font-semibold';
        warning.textContent = 'Desenho esquemático: contato, ancoragem e segurança não são verificados. Confirme com profissional habilitado.';
        section.appendChild(warning);
        lashingAnalysis.appendChild(section);
    });
}

function renderListaCargas() {
    refreshLashingItems();
    els.listaCargas.innerHTML = '';
    els.badgeQtd.textContent = composicaoCargas.length;

    if (composicaoCargas.length === 0) {
        els.listaCargas.innerHTML = '<li class="text-[11px] text-slate-400 italic py-2 text-center border border-dashed border-slate-300 rounded">Nenhuma carga adicionada</li>';
        return;
    }

    composicaoCargas.forEach((carga, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center bg-white border p-2 rounded shadow-sm text-[11px] ${editingCargaIndex === index ? 'border-indigo-500 ring-1 ring-indigo-200' : 'border-indigo-100'}`;
        
        const typeLabel = getCargoLabel(carga.type);
        const weightUnit = generalCargoByType.has(carga.type) ? generalCargo.pesoUnit.value : inputs.cPesoUnit.value;
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'flex flex-col flex-1 text-left cursor-pointer';
        editButton.title = 'Clique para editar esta carga';
        editButton.setAttribute('aria-label', `Editar ${carga.qtd} ${typeLabel}`);
        editButton.innerHTML = `
            <span class="font-bold text-slate-700">${carga.qtd}x ${typeLabel}</span>
            <span class="text-slate-500">${carga.comp.toFixed(1)}m x ${carga.larg.toFixed(1)}m x ${carga.alt.toFixed(1)}m &bull; ${carga.camadas || 1} camada(s)${carga.colocarSobreAnterior ? ' &bull; sobre a anterior' : ''} &bull; ${weightForInput(carga.peso, weightUnit)} ${weightUnit}/unid</span>
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
    generalCargo.add.textContent = editingCargaIndex === null ? 'Adicionar Carga' : 'Salvar Alterações';
    generalCargo.cancel.classList.toggle('hidden', editingCargaIndex === null);
}

function cancelarEdicaoCarga() {
    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
}

function editarCarga(index) {
    const carga = composicaoCargas[index];
    if (!carga) return;

    if (generalCargoByType.has(carga.type)) {
        setCargaTab('gerais');
        editingCargaIndex = index;
        generalCargo.model.value = carga.type;
        generalCargo.comp.value = carga.comp;
        generalCargo.larg.value = carga.larg;
        generalCargo.alt.value = carga.alt;
        generalCargo.peso.value = weightForInput(carga.peso, generalCargo.pesoUnit.value);
        generalCargo.qtd.value = carga.qtd;
        generalCargo.camadas.value = carga.camadas || 1;
        generalCargo.stack.checked = carga.colocarSobreAnterior === true;
        atualizarBotaoCarga();
        renderListaCargas();
        generalCargo.model.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    setCargaTab('cargas');
    editingCargaIndex = index;
    tipoCargaSelect.value = carga.type;
    tipoCargaSelect.dispatchEvent(new Event('change'));
    inputs.cComp.value = carga.comp;
    inputs.cLarg.value = carga.larg;
    inputs.cAlt.value = carga.alt;
    inputs.cPeso.value = weightForInput(carga.peso, inputs.cPesoUnit.value);
    inputs.cQtd.value = carga.qtd;
    inputs.cCamadas.value = carga.camadas || 1;
    inputs.cSobreAnterior.checked = carga.colocarSobreAnterior === true;
    inputArmador.value = carga.armador || 'generico';
    atualizarBotaoCarga();
    renderListaCargas();
    tipoCargaSelect.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
};

els.btnAdicionar.addEventListener('click', () => {
    const comp = parseFloat(inputs.cComp.value) || 0.1;
    const larg = parseFloat(inputs.cLarg.value) || 0.1;
    const alt = parseFloat(inputs.cAlt.value) || 0.1;
    const peso = weightInTonnes(inputs.cPeso.value, inputs.cPesoUnit.value);
    const qtd = parseInt(inputs.cQtd.value) || 1;
    const camadas = Math.max(1, Number.parseInt(inputs.cCamadas.value, 10) || 1);
    const colocarSobreAnterior = inputs.cSobreAnterior.checked;
    const type = document.getElementById('input_tipo_carga').value;
    const armador = document.getElementById('input_armador').value;

    const cargaAtualizada = { comp, larg, alt, peso, type, armador, qtd, camadas, colocarSobreAnterior };
    if (editingCargaIndex !== null && composicaoCargas[editingCargaIndex].lashing) {
        cargaAtualizada.lashing = composicaoCargas[editingCargaIndex].lashing;
    }
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

generalCargo.form.addEventListener('submit', event => {
    event.preventDefault();
    if (!generalCargo.form.reportValidity() || !generalCargoByType.has(generalCargo.model.value)) return;
    const carga = {
        type: generalCargo.model.value,
        comp: Number(generalCargo.comp.value),
        larg: Number(generalCargo.larg.value),
        alt: Number(generalCargo.alt.value),
        peso: weightInTonnes(generalCargo.peso.value, generalCargo.pesoUnit.value),
        qtd: Number(generalCargo.qtd.value),
        camadas: Number(generalCargo.camadas.value),
        colocarSobreAnterior: generalCargo.stack.checked,
        armador: 'generico'
    };
    if (editingCargaIndex !== null && composicaoCargas[editingCargaIndex].lashing) {
        carga.lashing = composicaoCargas[editingCargaIndex].lashing;
    }
    if (editingCargaIndex === null) composicaoCargas.push(carga);
    else composicaoCargas[editingCargaIndex] = carga;
    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
    analyzeAndDraw();
});
generalCargo.cancel.addEventListener('click', cancelarEdicaoCarga);

els.btnCancelarEdicao.addEventListener('click', cancelarEdicaoCarga);

function updateTrailerInfo() {
    if (activeCargaTab === 'tubos' && !TUBE_TRAILER_IDS.has(getActiveTrailerId())) {
        inputs.placa_prancha.value = "";
        inputs.placa_caminhao.value = "";
        inputs.placa_carreta.value = "carreta_padrao";
    }
    if (activeCargaTab === 'tubos') setVehicleSelectorTab('carreta');

    inputs.placa_prancha.disabled = activeCargaTab === 'tubos';
    inputs.placa_caminhao.disabled = activeCargaTab === 'tubos';
    document.getElementById('tube_trailer_rule').classList.toggle('hidden', activeCargaTab !== 'tubos');
    const placa = getActiveTrailerId();
    if (bdVeiculos[placa]) {
        currentTrailer = bdVeiculos[placa];
        tubeInputs.width.value = Math.round((currentTrailer.w_util || currentTrailer.w) * 1000);
        tubeInputs.length.value = getTubeLengthForTrailer(currentTrailer).toFixed(2);
        tubeInputs.trailerCapacity.value = currentTrailer.cap.toFixed(1);
        infos.largura.value = currentTrailer.w.toFixed(2);
        infos.altura.value = currentTrailer.h.toFixed(2);
        infos.mesa.value = currentTrailer.mesa.toFixed(2);
        infos.areaCargaTotal.value = isMesaOnlyVehicle(currentTrailer)
            ? (currentTrailer.areaCargaTotal === undefined ? "-" : currentTrailer.areaCargaTotal.toFixed(2))
            : (currentTrailer.mesa + (currentTrailer.tipo === 'reta' ? 0 : getPranchaAxleArea(currentTrailer).length)).toFixed(2);
        infos.compTotal.value = currentTrailer.compTotal === undefined
            ? "-"
            : currentTrailer.compTotal.toFixed(2);
        
        const isCarreta = isMesaOnlyVehicle(currentTrailer);
        if (isCarreta) {
            infos.pescoco.value = "-";
            inputs.posicao.value = "mesa";
            inputs.posicao.disabled = true;
            if (currentTrailer.tipo === 'sider' || currentTrailer.tipo === 'carreta_bau' || currentTrailer.paredesFixas) {
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
        if (currentTrailer.tipo === 'reta') tipoNome = "Prancha Reta";
        if (currentTrailer.tipo === 'semi-rebaixada') tipoNome = "Semi-Reta";
        if (currentTrailer.tipo === 'carreta') tipoNome = "Carreta Padrão";
        if (currentTrailer.tipo === 'carreta_ext') tipoNome = "Carreta Extensiva";
        if (currentTrailer.tipo === 'carreta_bau') tipoNome = "Carreta Baú (15m)";
        if (currentTrailer.tipo === 'vanderleia') tipoNome = "Vanderléia";
        if (currentTrailer.tipo === 'sider') tipoNome = "Carreta Sider";
        if (currentTrailer.tipo === 'caminhao') tipoNome = currentTrailer.nome;
        
        infos.tagTipo.textContent = tipoNome;
        
        if (currentTrailer.tipo === 'caminhao') {
            infos.tagTipo.className = "px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded";
        } else if (isCarreta) {
            infos.tagTipo.className = "px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded";
        } else {
            infos.tagTipo.className = "px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded";
        }
    }
    analyzeAndDraw();
}

function addVehicleSceneLights(targetScene) {
    targetScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 150, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10; dirLight.shadow.camera.far = 500;
    const d = 100;
    dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d; dirLight.shadow.camera.bottom = -d;
    targetScene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-100, 50, -100);
    targetScene.add(fillLight);
}

function initThreeJS() {
    const container = document.getElementById('three-container');
    scene = new THREE.Scene();

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

    addVehicleSceneLights(scene);

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

    sceneGrid = new THREE.GridHelper(600, 200, 0xcbd5e1, 0xe2e8f0);
    sceneGrid.position.y = 0.01;
    scene.add(sceneGrid);
    applySceneTheme();
    if (typeof ResizeObserver === 'function') {
        new ResizeObserver(resizeMainView).observe(container);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

const FLEET_YARD_MODELS = [
    ['caminhao_saveiro', 'Picape Saveiro'],
    ['caminhao_vuc_honda', 'VUC F350 Honda'],
    ['caminhao_toco', 'Caminhão Toco'],
    ['caminhao_truck', 'Caminhão Truck'],
    ['carreta_padrao', 'Carreta Padrão'],
    ['prancha_reb_7_0', 'Prancha Rebaixada (mesa de 7 m)'],
    ['prancha_reta_12_5', 'Prancha Reta']
];

const fleetYardDialog = document.getElementById('fleet_yard');
const fleetYardContainer = document.getElementById('fleet_yard_scene');
const fleetYardStatus = document.getElementById('fleet_yard_status');
const fleetYardReplay = document.getElementById('replay_fleet_yard');
let fleetYard = null;

function resizeFleetYard(yard) {
    const width = fleetYardContainer.clientWidth;
    const height = fleetYardContainer.clientHeight;
    if (!width || !height) return;
    yard.camera.aspect = width / height;
    yard.camera.updateProjectionMatrix();
    yard.renderer.setSize(width, height);
}

function frameFleetYard(yard, bounds) {
    const center = bounds.getCenter(new THREE.Vector3());
    const direction = new THREE.Vector3(1, 1.15, 1.5).normalize();
    const forward = direction.clone().negate();
    const right = forward.clone().cross(yard.camera.up).normalize();
    const up = right.clone().cross(forward).normalize();
    const tanVertical = Math.tan(THREE.MathUtils.degToRad(yard.camera.fov / 2));
    const tanHorizontal = tanVertical * yard.camera.aspect;
    let distance = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
                const offset = new THREE.Vector3(x, y, z).sub(center);
                distance = Math.max(distance,
                    offset.dot(direction) + Math.abs(offset.dot(right)) / tanHorizontal,
                    offset.dot(direction) + Math.abs(offset.dot(up)) / tanVertical);
            }
        }
    }
    yard.controls.target.copy(center);
    yard.camera.position.copy(center).addScaledVector(direction, distance * 1.15);
    yard.camera.lookAt(center);
    yard.controls.update();
}

function replayFleetYard(yard) {
    yard.startedAt = performance.now();
    yard.autoFrame = null;
    yard.vehicles.forEach(vehicle => {
        vehicle.root.position.z = -35;
        vehicle.wheels.forEach(wheel => { wheel.group.rotation.x = 0; });
    });
}

function animateFleetYard(yard, now) {
    if (!yard.active) return;
    yard.frame = requestAnimationFrame(time => animateFleetYard(yard, time));
    if (yard.startedAt !== null) {
        yard.vehicles.forEach((vehicle, index) => {
            const progress = Math.max(0, Math.min(1, (now - yard.startedAt - index * 400) / 4000));
            const distance = 35 * (1 - Math.pow(1 - progress, 3));
            vehicle.root.position.z = -35 + distance;
            vehicle.wheels.forEach(wheel => { wheel.group.rotation.x = -distance / wheel.radius; });
        });
        if (yard.autoFrame) {
            const duration = 4000 + (yard.vehicles.length - 1) * 400;
            const progress = Math.max(0, Math.min(1, (now - yard.startedAt - 1000) / (duration - 1000)));
            const eased = progress * progress * (3 - 2 * progress);
            yard.camera.position.lerpVectors(yard.autoFrame.fromPosition, yard.autoFrame.toPosition, eased);
            yard.controls.target.lerpVectors(yard.autoFrame.fromTarget, yard.autoFrame.toTarget, eased);
            if (progress === 1) yard.autoFrame = null;
        }
    }
    yard.controls.update();
    yard.renderer.render(yard.scene, yard.camera);
}

function disposeFleetYard(yard) {
    yard.active = false;
    cancelAnimationFrame(yard.frame);
    window.removeEventListener('resize', yard.resize);
    yard.controls.dispose();
    const geometries = new Set();
    const materials = new Set();
    yard.scene.traverse(node => {
        if (node.userData.sharedResource) return;
        if (node.geometry && !node.userData.sharedGeometry) geometries.add(node.geometry);
        if (node.material) {
            (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
        }
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    yard.textures.forEach(texture => texture.dispose());
    yard.renderer.dispose();
    yard.renderer.domElement.remove();
}

async function openFleetYard() {
    fleetYardDialog.showModal();
    fleetYardStatus.textContent = 'Carregando os modelos 3D da frota…';
    fleetYardReplay.disabled = true;
    let yard;
    try {
        const yardScene = new THREE.Scene();
        yardScene.background = new THREE.Color('#eef2f6');
        const yardRenderer = new THREE.WebGLRenderer({ antialias: true });
        yardRenderer.shadowMap.enabled = true;
        yardRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        fleetYardContainer.prepend(yardRenderer.domElement);
        const yardCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const yardControls = new THREE.OrbitControls(yardCamera, yardRenderer.domElement);
        yardControls.enableDamping = true;
        yardControls.dampingFactor = 0.05;
        yardControls.maxPolarAngle = Math.PI / 2 + 0.1;
        yard = {
            scene: yardScene, renderer: yardRenderer, camera: yardCamera, controls: yardControls,
            active: true, vehicles: [], textures: [], startedAt: null, frame: 0
        };
        yardControls.addEventListener('start', () => { yard.autoFrame = null; });
        fleetYard = yard;
        yard.resize = () => resizeFleetYard(yard);
        window.addEventListener('resize', yard.resize);
        resizeFleetYard(yard);
        addVehicleSceneLights(yardScene);
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.15 }));
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        yardScene.add(ground);
        const grid = new THREE.GridHelper(200, 200, 0xcbd5e1, 0xe2e8f0);
        grid.position.y = 0.01;
        yardScene.add(grid);

        const results = await Promise.allSettled(FLEET_YARD_MODELS.map(async ([id, name]) => {
            const tr = bdVeiculos[id];
            const model = new THREE.Group();
            const root = new THREE.Group();
            const context = { group: model, wheels: [], textures: yard.textures, isActive: () => yard.active };
            root.add(model);
            yardScene.add(root);
            try {
                await draw3D(tr, 'mesa', isMesaOnlyVehicle(tr), context);
            } catch (error) {
                root.visible = false;
                throw error;
            }
            if (!yard.active) return null;
            model.scale.setScalar(1 / 3);
            model.updateMatrixWorld(true);
            const bounds = new THREE.Box3().setFromObject(model);
            if (bounds.isEmpty()) {
                root.visible = false;
                throw new Error(`Modelo vazio: ${name}`);
            }
            const size = bounds.getSize(new THREE.Vector3());
            model.position.set(-(bounds.min.x + bounds.max.x) / 2, -bounds.min.y, -bounds.max.z);
            return { root, wheels: context.wheels, size };
        }));
        if (!yard.active) return;
        const failures = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) yard.vehicles.push(result.value);
            else if (result.status === 'rejected') {
                console.error(`Erro no pátio: ${FLEET_YARD_MODELS[index][1]}`, result.reason);
                failures.push(FLEET_YARD_MODELS[index][1]);
            }
        });
        fleetYardStatus.textContent = failures.length ? `Não foi possível carregar: ${failures.join(', ')}.` : '';
        if (!yard.vehicles.length) return;
        const totalWidth = yard.vehicles.reduce((sum, vehicle) => sum + vehicle.size.x, 0) + (yard.vehicles.length - 1) * 1.8;
        let x = -totalWidth / 2;
        let longest = 0;
        let tallest = 0;
        yard.vehicles.forEach(vehicle => {
            vehicle.root.position.x = x + vehicle.size.x / 2;
            x += vehicle.size.x + 1.8;
            longest = Math.max(longest, vehicle.size.z);
            tallest = Math.max(tallest, vehicle.size.y + 2);
        });
        frameFleetYard(yard, new THREE.Box3(
            new THREE.Vector3(-totalWidth / 2, 0, -35 - longest),
            new THREE.Vector3(totalWidth / 2, tallest, 0)
        ));
        const fromPosition = yard.camera.position.clone();
        const fromTarget = yard.controls.target.clone();
        frameFleetYard(yard, new THREE.Box3(
            new THREE.Vector3(-totalWidth / 2, 0, -longest),
            new THREE.Vector3(totalWidth / 2, tallest, 0)
        ));
        const toPosition = yard.camera.position.clone();
        const toTarget = yard.controls.target.clone();
        yard.camera.position.copy(fromPosition);
        yard.controls.target.copy(fromTarget);
        yard.controls.update();
        replayFleetYard(yard);
        yard.autoFrame = { fromPosition, fromTarget, toPosition, toTarget };
        fleetYardReplay.disabled = false;
        yard.frame = requestAnimationFrame(time => animateFleetYard(yard, time));
    } catch (error) {
        console.error('Erro ao abrir o pátio da frota:', error);
        if (!yard || yard.active) fleetYardStatus.textContent = 'Não foi possível iniciar o pátio 3D. Feche e tente novamente.';
    }
}

document.getElementById('open_fleet_yard').addEventListener('click', openFleetYard);
fleetYardReplay.addEventListener('click', () => { if (fleetYard) replayFleetYard(fleetYard); });
function closeFleetYard() {
    if (fleetYard) disposeFleetYard(fleetYard);
    fleetYard = null;
    if (fleetYardDialog.open) fleetYardDialog.close();
    document.getElementById('open_fleet_yard').focus();
}
document.getElementById('close_fleet_yard').addEventListener('click', closeFleetYard);
fleetYardDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeFleetYard();
});
fleetYardDialog.addEventListener('close', () => {
    if (!fleetYardDialog.open && fleetYard) closeFleetYard();
});

const transportDialog = document.getElementById('transport_animation');
const transportContainer = document.getElementById('transport_animation_scene');
const transportStatus = document.getElementById('transport_animation_status');
let transportAnimation = null;

function resizeTransportAnimation(animation) {
    const width = transportContainer.clientWidth;
    const height = transportContainer.clientHeight;
    if (!width || !height) return;
    animation.camera.aspect = width / height;
    animation.camera.updateProjectionMatrix();
    animation.renderer.setSize(width, height);
}

function getTransportBounds(root) {
    const bounds = new THREE.Box3();
    const instanceMatrix = new THREE.Matrix4();
    const worldMatrix = new THREE.Matrix4();
    const instanceBounds = new THREE.Box3();
    root.updateMatrixWorld(true);
    root.traverse(node => {
        const geometry = node.geometry;
        if (!geometry) return;
        if (geometry.boundingBox === null) geometry.computeBoundingBox();
        if (!geometry.boundingBox) return;
        if (!node.isInstancedMesh) {
            bounds.union(instanceBounds.copy(geometry.boundingBox).applyMatrix4(node.matrixWorld));
            return;
        }
        for (let i = 0; i < node.count; i++) {
            node.getMatrixAt(i, instanceMatrix);
            worldMatrix.multiplyMatrices(node.matrixWorld, instanceMatrix);
            bounds.union(instanceBounds.copy(geometry.boundingBox).applyMatrix4(worldMatrix));
        }
    });
    return bounds;
}

function separateFortniteWheels(cab) {
    const body = cab.getObjectByName('Object_2');
    const geometry = body?.geometry;
    const positions = geometry?.attributes.position;
    const indices = geometry?.index;
    if (!body?.isMesh || !positions || !indices) {
        throw new Error('Não foi possível localizar a malha do cavalinho Fortnite.');
    }

    const parents = Array.from({ length: positions.count }, (_, index) => index);
    const vertices = new Map();
    const find = index => {
        while (parents[index] !== index) {
            parents[index] = parents[parents[index]];
            index = parents[index];
        }
        return index;
    };
    const join = (a, b) => { parents[find(b)] = find(a); };
    for (let i = 0; i < positions.count; i++) {
        const key = [positions.getX(i), positions.getY(i), positions.getZ(i)]
            .map(value => value.toFixed(5)).join(',');
        if (vertices.has(key)) join(i, vertices.get(key));
        else vertices.set(key, i);
    }
    for (let i = 0; i < indices.count; i += 3) {
        join(indices.getX(i), indices.getX(i + 1));
        join(indices.getX(i), indices.getX(i + 2));
    }
    const components = new Map();
    for (let i = 0; i < positions.count; i++) {
        const root = find(i);
        if (!components.has(root)) components.set(root, { count: 0, bounds: new THREE.Box3() });
        const component = components.get(root);
        component.count++;
        component.bounds.expandByPoint(new THREE.Vector3().fromBufferAttribute(positions, i));
    }
    // O GLB do Fortnite contém seis rodas como componentes desconectados de uma única malha.
    const wheelRoots = [...components.entries()].filter(([, component]) => {
        const size = component.bounds.getSize(new THREE.Vector3());
        const center = component.bounds.getCenter(new THREE.Vector3());
        return (component.count === 194 || component.count === 245) &&
            center.z < 2 && size.z > 3.5 && size.z < 4 && size.y > 3.5 && size.y < 4;
    }).map(([root]) => root);
    if (wheelRoots.length !== 6) {
        throw new Error('Não foi possível identificar as seis rodas do cavalinho Fortnite.');
    }

    const wheelIndices = wheelRoots.map(() => []);
    const bodyIndices = [];
    for (let i = 0; i < indices.count; i += 3) {
        const wheelIndex = wheelRoots.indexOf(find(indices.getX(i)));
        const target = wheelIndex < 0 ? bodyIndices : wheelIndices[wheelIndex];
        target.push(indices.getX(i), indices.getX(i + 1), indices.getX(i + 2));
    }
    const subsetGeometry = (subset, bounds) => {
        const result = geometry.clone();
        result.setIndex(subset);
        result.boundingBox = bounds;
        result.boundingSphere = bounds.getBoundingSphere(new THREE.Sphere());
        return result;
    };
    wheelIndices.forEach((wheelIndex, index) => {
        const wheel = body.clone();
        wheel.name = `fortnite_wheel_${index}`;
        wheel.geometry = subsetGeometry(wheelIndex, components.get(wheelRoots[index]).bounds.clone());
        wheel.userData.sharedGeometry = false;
        body.parent.add(wheel);
    });
    const bodyBounds = new THREE.Box3();
    bodyIndices.forEach(index => bodyBounds.expandByPoint(new THREE.Vector3().fromBufferAttribute(positions, index)));
    body.geometry = subsetGeometry(bodyIndices, bodyBounds);
    body.userData.sharedGeometry = false;
}

function addTransportModelWheels(model, wheels, cab, cabModelId) {
    if (cab && cabModelId === 'fortnite_semi_truck') separateFortniteWheels(cab);
    model.updateMatrixWorld(true);
    const parts = [];
    model.traverse(node => {
        const materialName = node.isMesh && !Array.isArray(node.material) ? node.material?.name : '';
        const scaniaPart = /^(RODA|PNEU|PARAFUSO|CUBO)\d+_\d+$/i.test(node.name);
        const chassisPart = /^(Rims|Tyre_tread|Tyre_sidewalls)$/i.test(materialName || '');
        const objBolt = node.isMesh && /pCylinder(?:28|29|30|31|32|33|34|35)\b/i.test(node.name);
        const objPart = objBolt || (node.isMesh && /pCylinder(?:15|16|17|18|19)\b/i.test(node.name));
        const gamePart = node.isMesh && /^(?:Car7|Car10)_Wheel_(?:(?:LOD|Moving)_)?\d+_\d+_/i.test(node.name);
        const fortnitePart = node.isMesh && /^fortnite_wheel_\d+$/.test(node.name);
        if (!node.visible || (!scaniaPart && !chassisPart && !objPart && !gamePart && !fortnitePart)) return;
        const bounds = new THREE.Box3().setFromObject(node);
        if (bounds.isEmpty()) return;
        parts.push({
            node, center: bounds.getCenter(new THREE.Vector3()),
            radius: bounds.getSize(new THREE.Vector3()).y / 2,
            tire: /^PNEU/i.test(node.name) || /^Tyre_tread$/i.test(materialName) ||
                (objPart && materialName === 'lambert3SG') || gamePart || fortnitePart,
            objPart, objBolt, gamePart, scaniaPart
        });
    });
    const tires = parts.filter(part => part.tire);
    parts.forEach(part => {
        const matchingTires = tires.filter(candidate => {
            if ((part.objPart && candidate.objPart) || (part.scaniaPart && candidate.scaniaPart)) {
                const tolerance = part.objBolt ? 0.25 : 0.1;
                return Math.sign(candidate.center.x) === Math.sign(part.center.x) &&
                    Math.abs(candidate.center.y - part.center.y) < tolerance &&
                    Math.abs(candidate.center.z - part.center.z) < tolerance;
            }
            return candidate.center.distanceTo(part.center) < 0.1;
        });
        const tire = part.gamePart
            ? matchingTires.sort((a, b) => b.radius - a.radius)[0]
            : matchingTires[0];
        if (!tire || !part.node.parent) return;
        const parent = part.node.parent;
        const center = parent.worldToLocal(tire.center.clone());
        const axisPoint = parent.worldToLocal(tire.center.clone().add(new THREE.Vector3(1, 0, 0)));
        const pivot = new THREE.Group();
        pivot.position.copy(center);
        parent.add(pivot);
        parent.remove(part.node);
        part.node.position.sub(center);
        pivot.add(part.node);
        wheels.push({ group: pivot, radius: tire.radius, axis: axisPoint.sub(center).normalize() });
    });
}

function addTransportRigidWheels(vehicle, wheels, tr) {
    const pivots = vehicle.children.filter(child => child.userData.rigidWheelRadius);
    if (pivots.length !== RIGID_VEHICLE_MODELS[tr.modelo].animationWheels.z.length) {
        throw new Error(`Não foi possível identificar as rodas do veículo ${tr.modelo}.`);
    }
    pivots.forEach(pivot => {
        const scale = pivot.getWorldScale(new THREE.Vector3());
        // A frente dos caminhões aponta para +Z; a estrada se desloca para -Z.
        wheels.push({ group: pivot, radius: pivot.userData.rigidWheelRadius * scale.y, direction: 1 });
    });
}

function animateTransport(animation, now) {
    if (!animation.active) return;
    animation.frame = requestAnimationFrame(time => animateTransport(animation, time));
    const distance = (now - animation.startedAt) / 1000 * 8;
    animation.markers.forEach(marker => {
        marker.position.z = ((marker.userData.startZ - distance + 180) % 360 + 360) % 360 - 180;
    });
    animation.wheels.forEach(wheel => {
        if (wheel.axis) wheel.group.quaternion.setFromAxisAngle(wheel.axis, -distance / wheel.radius);
        else wheel.group.rotation.x = (wheel.direction ?? -1) * distance / wheel.radius;
    });
    animation.controls.update();
    animation.renderer.render(animation.scene, animation.camera);
}

function addTransportLandscape(animation) {
    const scene = animation.scene;
    scene.background = new THREE.Color(0x9bcdf0);
    scene.fog = new THREE.Fog(0xc8e1e9, 180, 400);

    const sky = new THREE.Mesh(
        new THREE.SphereGeometry(450, 32, 16),
        new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            vertexShader: 'varying vec3 vDirection; void main() { vDirection = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
            fragmentShader: 'varying vec3 vDirection; void main() { float h = smoothstep(-0.08, 0.65, vDirection.y); gl_FragColor = vec4(mix(vec3(0.78, 0.88, 0.93), vec3(0.20, 0.55, 0.84), h), 1.0); }'
        })
    );
    scene.add(sky);

    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 256;
    cloudCanvas.height = 128;
    const cloudContext = cloudCanvas.getContext('2d');
    [[62, 70, 43], [100, 54, 53], [145, 62, 45], [185, 74, 36]].forEach(([x, y, radius]) => {
        const gradient = cloudContext.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.65)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        cloudContext.fillStyle = gradient;
        cloudContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    animation.textures.push(cloudTexture);
    const cloudMaterial = new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, depthWrite: false, opacity: 0.8 });
    for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI * 2 / 12;
        const cloud = new THREE.Sprite(cloudMaterial);
        cloud.position.set(Math.cos(angle) * 200, 55 + (i % 3) * 13, Math.sin(angle) * 200);
        cloud.scale.set(85 + (i % 3) * 10, 34, 1);
        scene.add(cloud);
    }

    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = grassCanvas.height = 256;
    const grassContext = grassCanvas.getContext('2d');
    const pixels = grassContext.createImageData(256, 256);
    let seed = 1937;
    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            const noise = (seed >>> 24) / 255;
            const patch = Math.sin(x * 0.12) * Math.cos(y * 0.09) * 10;
            const i = (y * 256 + x) * 4;
            pixels.data[i] = 165 + noise * 55 + patch;
            pixels.data[i + 1] = 165 + noise * 55 + patch;
            pixels.data[i + 2] = 165 + noise * 55 + patch;
            pixels.data[i + 3] = 255;
        }
    }
    grassContext.putImageData(pixels, 0, 0);
    const grassTexture = new THREE.CanvasTexture(grassCanvas);
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.encoding = THREE.sRGBEncoding;
    animation.textures.push(grassTexture);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        new THREE.MeshStandardMaterial({ color: 0x637f4e, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const terrainMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, vertexColors: true, roughness: 1 });
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x72974a, side: THREE.DoubleSide, roughness: 1 });
    const grassGeometry = new THREE.BufferGeometry();
    grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
        -0.12, 0, 0, 0.12, 0, 0, 0, 1, 0,
        0, 0, -0.12, 0, 0, 0.12, 0, 1, 0
    ], 3));
    grassGeometry.computeVertexNormals();
    const bushGeometry = new THREE.IcosahedronGeometry(1, 1);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x52723a, roughness: 1 });
    const heightAt = (offset, z) => {
        const rise = Math.min(1, Math.max(0, (offset - 9) / 12));
        const ridge = 23 + 12 * Math.cos(z * Math.PI / 60) +
            6 * Math.sin(z * Math.PI / 30 + offset * 0.04) +
            3 * Math.abs(Math.sin(z * Math.PI / 20 + offset * 0.12));
        const mountain = Math.exp(-Math.pow((offset - 75) / 29, 2));
        return rise * (0.8 + mountain * Math.max(3, ridge)) + 0.01;
    };

    [-1, 1].forEach(side => {
        const positions = [], colors = [], uvs = [], indices = [];
        const columns = 28, rows = 60;
        for (let row = 0; row <= rows; row++) {
            const z = -60 + row * 120 / rows;
            for (let column = 0; column <= columns; column++) {
                const offset = 6 + column * 114 / columns;
                const height = heightAt(offset, z);
                positions.push(3 + side * offset, height, z);
                uvs.push(offset * 0.2, (z + 60) * 0.2);
                const rock = Math.min(0.9, Math.max(0, (height - 4) / 14)) *
                    (0.45 + 0.55 * Math.abs(Math.sin(offset * 0.3 + Math.cos(z * Math.PI / 30) * 4)));
                colors.push(0.38 + rock * 0.34, 0.55 + rock * 0.15, 0.24 + rock * 0.45);
            }
        }
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const a = row * (columns + 1) + column;
                const b = a + 1, c = a + columns + 1, d = c + 1;
                if (side > 0) indices.push(a, c, b, b, c, d);
                else indices.push(a, b, c, b, d, c);
            }
        }
        const terrainGeometry = new THREE.BufferGeometry();
        terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        terrainGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        terrainGeometry.setIndex(indices);
        terrainGeometry.computeVertexNormals();

        for (let segment = -1; segment <= 1; segment++) {
            const landscape = new THREE.Group();
            landscape.position.z = segment * 120;
            landscape.userData.startZ = segment * 120;
            const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
            terrain.receiveShadow = true;
            landscape.add(terrain);
            const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, 360);
            grass.frustumCulled = false;
            const transform = new THREE.Object3D();
            for (let i = 0; i < grass.count; i++) {
                const random = n => {
                    const value = Math.sin((i + 1) * (n * 17.73 + 11.31) + side * 7) * 43758.5453;
                    return value - Math.floor(value);
                };
                const offset = 7 + random(1) * 35;
                const z = -60 + random(2) * 120;
                const scale = 0.12 + random(3) * 0.22;
                transform.position.set(3 + side * offset, heightAt(offset, z) - 0.04, z);
                transform.rotation.y = random(4) * Math.PI;
                transform.scale.setScalar(scale);
                transform.updateMatrix();
                grass.setMatrixAt(i, transform.matrix);
            }
            grass.instanceMatrix.needsUpdate = true;
            landscape.add(grass);
            const bushes = new THREE.InstancedMesh(bushGeometry, bushMaterial, 55);
            bushes.frustumCulled = false;
            for (let i = 0; i < bushes.count; i++) {
                const random = n => {
                    const value = Math.sin((i + 1) * (n * 19.17 + 3.41) + side * 13) * 43758.5453;
                    return value - Math.floor(value);
                };
                const offset = 14 + random(1) * 90;
                const z = -60 + random(2) * 120;
                const scale = 0.35 + random(3) * 0.8;
                transform.position.set(3 + side * offset, heightAt(offset, z) + scale * 0.35, z);
                transform.rotation.y = random(4) * Math.PI;
                transform.scale.set(scale, scale * 0.6, scale);
                transform.updateMatrix();
                bushes.setMatrixAt(i, transform.matrix);
            }
            bushes.instanceMatrix.needsUpdate = true;
            landscape.add(bushes);
            scene.add(landscape);
            animation.markers.push(landscape);
        }
    });
}

async function openTransportAnimation() {
    transportDialog.showModal();
    transportStatus.textContent = 'Carregando o veículo e as cargas…';
    let animation;
    try {
        const transportScene = new THREE.Scene();
        const transportRenderer = new THREE.WebGLRenderer({ antialias: true });
        transportRenderer.shadowMap.enabled = true;
        transportRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        transportContainer.prepend(transportRenderer.domElement);
        const transportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const transportControls = new THREE.OrbitControls(transportCamera, transportRenderer.domElement);
        transportControls.enableDamping = true;
        transportControls.dampingFactor = 0.05;
        transportControls.maxPolarAngle = Math.PI / 2 + 0.1;
        transportControls.autoRotate = true;
        transportControls.autoRotateSpeed = 0.5;
        animation = {
            scene: transportScene, renderer: transportRenderer, camera: transportCamera,
            controls: transportControls, active: true, frame: 0, textures: [], wheels: [], markers: []
        };
        transportAnimation = animation;
        animation.resize = () => resizeTransportAnimation(animation);
        window.addEventListener('resize', animation.resize);
        resizeTransportAnimation(animation);
        addVehicleSceneLights(transportScene);
        addTransportLandscape(animation);
        const road = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 400),
            new THREE.MeshStandardMaterial({ color: 0x343b40, roughness: 1 })
        );
        road.rotation.x = -Math.PI / 2;
        road.position.set(3, 0.01, 0);
        road.receiveShadow = true;
        transportScene.add(road);
        const roadPaint = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 1 });
        [-2.85, 8.85].forEach(x => {
            const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 400), roadPaint);
            edge.rotation.x = -Math.PI / 2;
            edge.position.set(x, 0.02, 0);
            transportScene.add(edge);
        });
        const stripeGeometry = new THREE.PlaneGeometry(0.15, 5);
        const postGeometry = new THREE.BoxGeometry(0.12, 0.8, 0.12);
        const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        for (let z = -180; z < 180; z += 12) {
            const stripe = new THREE.Mesh(stripeGeometry, roadPaint);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(3, 0.02, z);
            stripe.userData.startZ = z;
            transportScene.add(stripe);
            animation.markers.push(stripe);
            [-3.4, 9.4].forEach(x => {
                const post = new THREE.Mesh(postGeometry, postMaterial);
                post.position.set(x, 0.4, z);
                post.userData.startZ = z;
                transportScene.add(post);
                animation.markers.push(post);
            });
        }

        const model = new THREE.Group();
        const vehicle = new THREE.Group();
        const cargo = new THREE.Group();
        model.add(vehicle, cargo);
        transportScene.add(model);
        const context = {
            group: vehicle, loadGroup: cargo, includeLoads: true,
            wheels: animation.wheels, textures: animation.textures, isActive: () => animation.active
        };
        const tr = currentTrailer;
        const cabModelId = inputs.cavalinho.value;
        await draw3D(tr, inputs.posicao.value, isMesaOnlyVehicle(tr), context);
        if (!animation.active) return;
        model.scale.setScalar(1 / 3);
        model.updateMatrixWorld(true);
        const bounds = getTransportBounds(model);
        if (bounds.isEmpty()) throw new Error('O veículo não possui geometria 3D.');
        const center = bounds.getCenter(new THREE.Vector3());
        const vehicleBounds = getTransportBounds(vehicle);
        if (vehicleBounds.isEmpty()) throw new Error('O veículo não possui geometria 3D.');
        model.position.set(-center.x, -vehicleBounds.min.y, -center.z);
        model.updateMatrixWorld(true);
        addTransportModelWheels(vehicle, animation.wheels, context.cab, cabModelId);
        if (context.rigidVehicle) addTransportRigidWheels(context.rigidVehicle, animation.wheels, tr);
        frameFleetYard(animation, getTransportBounds(model));
        transportStatus.textContent = '';
        animation.startedAt = performance.now();
        animation.frame = requestAnimationFrame(time => animateTransport(animation, time));
    } catch (error) {
        console.error('Erro ao iniciar a animação do transporte:', error);
        if (!animation || animation.active) {
            transportStatus.textContent = 'Não foi possível carregar o veículo ou as cargas. Feche e tente novamente.';
        }
    }
}

function closeTransportAnimation() {
    if (transportAnimation) disposeFleetYard(transportAnimation);
    transportAnimation = null;
    if (transportDialog.open) transportDialog.close();
    document.getElementById('open_transport_animation').focus();
}

document.getElementById('open_transport_animation').addEventListener('click', openTransportAnimation);
document.getElementById('close_transport_animation').addEventListener('click', closeTransportAnimation);
transportDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeTransportAnimation();
});
transportDialog.addEventListener('close', () => {
    if (!transportDialog.open && transportAnimation) closeTransportAnimation();
});

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
    const totalUnits = loadSequence.loads.reduce((total, load) => total + load.carga.qtd, 0);
    els.cargoSummary.units.textContent = format(totalUnits);
    els.cargoSummary.types.textContent = format(loadSequence.loads.length);
    els.cargoSummary.weight.textContent = `${format(totalWeight, 2)} t`;
    els.cargoSummary.length.textContent = `${format(loadSequence.totalComp, 2)} m`;
    els.cargoSummary.items.replaceChildren();
    els.cargoSummary.empty.classList.toggle('hidden', loadSequence.loads.length > 0);

    loadSequence.loads.forEach(({ carga }) => {
        const typeLabel = getCargoLabel(carga.type);
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

function getSpilloverSuggestion() {
    const fleet = [...new Map(Object.values(bdVeiculos)
        .filter(vehicle => vehicle.tipo === 'caminhao')
        .map(vehicle => [vehicle.grupo, { name: vehicle.grupo, cap: vehicle.cap, comp: vehicle.mesa, larg: vehicle.w_util, alt: 3 }])
    ).values()].sort((a, b) => a.cap - b.cap);
    const totalPieces = cargasTransbordo.reduce((total, carga) => total + carga.qtd, 0);
    const totalWeight = cargasTransbordo.reduce((total, carga) => total + carga.peso * carga.qtd, 0);
    const vehicle = fleet.find(candidate => {
        const vehicleTrailer = {
            tipo: 'caminhao',
            w: candidate.larg,
            w_util: candidate.larg,
            mesa: candidate.comp,
            cap: candidate.cap
        };
        let totalLength = 0;
        let maxWidth = 0;
        let maxHeight = 0;
        let previousGap = 0;
        cargasTransbordo.forEach((carga, index) => {
            const grid = getGridMetrics(vehicleTrailer, carga, true);
            const startGap = index === 0
                ? (grid.isDistributed ? 0 : getLoadStartClearance(carga.type, vehicleTrailer))
                : previousGap;
            totalLength += grid.totalComp + startGap;
            previousGap = grid.gap;
            maxWidth = Math.max(maxWidth, grid.totalLarg);
            maxHeight = Math.max(maxHeight, grid.maxStackHeight);
        });
        return totalWeight <= candidate.cap &&
            totalLength <= candidate.comp &&
            maxWidth <= candidate.larg &&
            maxHeight <= candidate.alt;
    });

    return { totalPieces, totalWeight, vehicle: vehicle?.name || 'Outra Carreta' };
}

function setStatusIcon(isNormal) {
    document.getElementById('icon_aet_check').classList.toggle('hidden', !isNormal);
    document.getElementById('icon_aet_warning').classList.toggle('hidden', isNormal);
}

function analyzeTubesAndDraw(tr, isCarreta) {
    const tube = getTubeMetrics(tr);
    renderTubeResults(tube);

    const floorHeight = tr.tipo === 'reta' ? 1.6 : tr.h;
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
    setStatusIcon(!hardLimitExceeded && !operationalWarning);

    draw3D(tr, inputs.posicao.value, isCarreta);
    draw2D(tr, inputs.posicao.value, isCarreta);
}

function analyzeAndDraw() {
    const tr = currentTrailer;
    const pos = inputs.posicao.value;
    const isCarreta = isMesaOnlyVehicle(tr);
    const spilloverAlert = document.getElementById('spillover_alert');
    if (activeCargaTab === 'tubos') {
        spilloverAlert.classList.add('hidden');
        spilloverAlert.textContent = '';
        lashingAnalysis.classList.add('hidden');
        analyzeTubesAndDraw(tr, isCarreta);
        return;
    }
    const usesGates = usesSideGates(tr, isCarreta);
    const availableWidth = usesGates ? tr.w_util : tr.w;
    const espacoDisponivel = !isCarreta && pos === 'eixos' ? getPranchaAxleArea(tr).length : tr.mesa;

    let pesoTotal = 0;
    let totalLargMax = 0;
    let maxAlt = 0;
    const loadSequence = getLoadSequenceMetrics(tr, isCarreta);
    const compTotalUsado = loadSequence.totalComp;

    loadSequence.loads.forEach(({ carga, grid, stackBaseHeight }) => {
        pesoTotal += (carga.peso * carga.qtd);
        if (grid.totalLarg > totalLargMax) totalLargMax = grid.totalLarg;
        maxAlt = Math.max(maxAlt, stackBaseHeight + grid.maxStackHeight);
    });
    renderCargoAnalysisSummary(loadSequence, pesoTotal);
    renderLashingAnalysis(loadSequence);
    spilloverAlert.classList.toggle('hidden', cargasTransbordo.length === 0);
    if (cargasTransbordo.length) {
        const suggestion = getSpilloverSuggestion();
        spilloverAlert.textContent = `⚠️ EXCEDENTE DE CARGA: ${suggestion.totalPieces} peças não couberam. Veículo sugerido para o transbordo: ${suggestion.vehicle}`;
    } else {
        spilloverAlert.textContent = '';
    }

    let reqAET = false;
    let aetMotivo = "";
    let alertClass = "bg-green-50 border-green-200 text-green-800";
    let iconColor = "text-green-600";
    
    if (totalLargMax > tr.w) { 
        reqAET = true;
        aetMotivo = `Um ou mais blocos de carga (${totalLargMax.toFixed(2)}m) excedem a largura do veículo (${tr.w.toFixed(2)}m). `;
        if (totalLargMax > 3.20) aetMotivo += `(Excede limite legal de 3.20m).`;
    } else if (isCarreta && totalLargMax > availableWidth) {
        if (usesGates) {
            aetMotivo = tr.paredesFixas
                ? `Atenção: Algum bloco de carga (${totalLargMax.toFixed(2)}m) excede a largura interna da carroceria (${availableWidth.toFixed(2)}m). `
                : `Atenção: Algum bloco de carga (${totalLargMax.toFixed(2)}m) excede a área útil entre as tampas (${availableWidth.toFixed(2)}m). Mude para "Sem tampas laterais". `;
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    if (pesoTotal > tr.cap) {
        aetMotivo += aetMotivo ? " E " : "ALERTA: ";
        aetMotivo += `O peso total somado (${pesoTotal.toFixed(2)}t) excede a capacidade do veículo (${tr.cap.toFixed(2)}t).`;
        if (!reqAET) {
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    const reducedClearance = !isCarreta && loadSequence.loads.some(load =>
        load.splitCoils
            ? load.mesaStartOffset < load.clearance - 1e-9 || load.eixoStartOffset < load.clearance - 1e-9
            : load.startOffset < load.clearance - 1e-9
    );
    if (reducedClearance) {
        aetMotivo += aetMotivo ? " " : "";
        aetMotivo += "A folga inicial da carga foi reduzida para caber na prancha; confira os apoios, obstáculos e pontos de fixação no veículo real.";
        if (!reqAET) {
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    const areaExcedida = [];
    if (!isCarreta && loadSequence.eixoComp > getPranchaAxleArea(tr).length) {
        areaExcedida.push(`eixos (${loadSequence.eixoComp.toFixed(2)}m usados de ${getPranchaAxleArea(tr).length.toFixed(2)}m)`);
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
    if (tr.tipo === 'reta') {
        baseH = pH;
    } else if (!isCarreta && pos === 'eixos') {
        baseH = getPranchaAxleArea(tr).height;
    }
    if (!isCarreta && loadSequence.loads.some(load => load.splitCoils)) {
        baseH = Math.max(baseH, getPranchaAxleArea(tr).height);
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
        els.titleAet.textContent = tr.tipo === 'caminhao' ? "CARROCERIA VAZIA" : "CARRETA VAZIA"; 
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
    setStatusIcon(composicaoCargas.length > 0 && !reqAET && aetMotivo === '');

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
function draw3D(tr, pos, isCarreta, comparison = null, targetTrailerGroup = trailerGroup, targetLoadGroup = loadGroup) {
    const trailerGroup = comparison ? comparison.group : targetTrailerGroup;
    const loadGroup = comparison?.loadGroup || targetLoadGroup;
    const drawRevision = comparison ? draw3DRevision : ++draw3DRevision;
    const isCurrent = () => comparison ? comparison.isActive() : drawRevision === draw3DRevision;
    const modelPromises = [];
    const cargoStatus = document.getElementById('cargo_model_status');
    let pendingCargoModels = 0;
    const cargoModelErrors = new Set();
    const updateCargoModelStatus = () => {
        const messages = [];
        if (pendingCargoModels) messages.push('Carregando modelos 3D das cargas…');
        if (cargoModelErrors.size) messages.push(`Não foi possível carregar: ${[...cargoModelErrors].join(', ')}.`);
        cargoStatus.textContent = messages.join(' ');
        cargoStatus.classList.toggle('hidden', messages.length === 0);
        cargoStatus.classList.toggle('text-red-700', cargoModelErrors.size > 0);
        cargoStatus.classList.toggle('text-slate-600', cargoModelErrors.size === 0);
    };
    if (!comparison) updateCargoModelStatus();
    const clearGroup = (group) => {
        while (group.children.length) {
            const obj = group.children.pop();
            obj.traverse?.(child => {
                if (child.userData?.sharedResource) return;
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    (Array.isArray(child.material) ? child.material : [child.material]).forEach(m => {
                        if (m.userData.ownedTexture) m.userData.ownedTexture.dispose();
                        m.dispose();
                    });
                }
            });
        }
    };
    clearGroup(trailerGroup);
    if (!comparison || comparison.includeLoads) clearGroup(loadGroup);

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
    const neckWood = mat(0xa8794e);
    const siderMat = matTransp(0x1e293b, 0.88);
    siderMat.depthWrite = false;
    
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
        for (let i = 0; i < 128; i += 16) {
            ctx.fillRect(0, i, 128, 12);
        }
        const tex = new THREE.CanvasTexture(canvas);
        if (comparison) comparison.textures.push(tex);
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
        for (let i = 0; i < segments; i++) {
            const m = i % 2 === 0 ? bumperRed : bumperWhite;
            box(segW, h, d, m, startX + (i*segW), y, z, group);
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
        const wheelGroup = comparison ? new THREE.Group() : group;
        if (comparison) group.add(wheelGroup);
        const tire = mesh(new THREE.CylinderGeometry(r, r, width, 32, 1), rubber, x, y, z, wheelGroup);
        tire.rotation.z = Math.PI/2;
        
        const hubR = r * 0.55;
        const hub = mesh(new THREE.CylinderGeometry(hubR, hubR, width*1.02, 24), rim, x, y, z, wheelGroup);
        hub.rotation.z = Math.PI/2;
        
        const centerCap = mesh(new THREE.CylinderGeometry(r*.2, r*.2, width*1.06, 16), steel, x, y, z, wheelGroup);
        centerCap.rotation.z = Math.PI/2;
        
        const boltR = 0.04 * S;
        const boltDist = hubR * 0.65;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bx = x > 0 ? x + (width/2 * 1.04) : x - (width/2 * 1.04);
            const by = y + Math.cos(angle) * boltDist;
            const bz = z + Math.sin(angle) * boltDist;
            const bolt = mesh(new THREE.CylinderGeometry(boltR, boltR, 0.04*S, 6), steel, bx, by, bz, wheelGroup);
            bolt.rotation.z = Math.PI/2;
        }
        if (comparison) {
            wheelGroup.position.set(x, y, z);
            wheelGroup.children.forEach(child => child.position.sub(wheelGroup.position));
            comparison.wheels.push({ group: wheelGroup, radius: r / S });
        }
        
        if (connectAxle && x > 0) {
            const axleLen = (Math.abs(x) * 2) - width;
            const axle = mesh(new THREE.CylinderGeometry(0.12*S, 0.12*S, axleLen, 16), frame, 0, y, z, group);
            axle.rotation.z = Math.PI/2;
        }
        return tire;
    }

    function drawDeckDetails(width,length,centerZ,topY,includeStructure=true,plankMaterial=wood) {
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

            for (let i=0;i<plankCount;i++){
                const x = -width*0.45+plankWidth*(i+0.5);
                box(plankWidth*0.97,0.035*S,plankLength,plankMaterial,x,topY+0.018*S,centerZ);
            }

            const beamCount = Math.max(4,Math.min(18,Math.ceil(length/(0.55*S))));
            for (let i=0;i<=beamCount;i++){
                const z = centerZ-length/2+length*i/beamCount;
                box(width*1.04,0.1*S,0.1*S,crossBeam,0,topY-0.23*S,z);
            }
        } else {
            const plankCount = 10;
            const plankWidth = width*0.9/plankCount;
            for (let i=0;i<plankCount;i++){
                const x = -width*0.45+plankWidth*(i+0.5);
                box(plankWidth*0.98,0.035*S,length*0.975,plankMaterial,x,topY+0.025*S,centerZ);
            }
        }

        const reflectorCount = Math.max(4,Math.min(24,Math.floor(length/(0.55*S))));
        for (let i=0;i<=reflectorCount;i++){
            const z = centerZ-length/2+length*i/reflectorCount;
            [-1,1].forEach(side=>{
                box(0.06*S,0.12*S,0.2*S,i%2===0?bumperWhite:bumperRed,side*(width/2+0.015*S),topY-0.12*S,z);
            });
        }

        const tieDownCount = Math.max(3,Math.floor(length/(1.2*S)));
        for (let i=0;i<=tieDownCount;i++){
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

        if (includeSides){
            [-1,1].forEach(side=>{
                railY.forEach(y=>{
                    box(thickness*1.35,railHeight,length,railMat,side*sideX,y,centerZ);
                });
                for (let i=0;i<=postCount;i++){
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
            for (let i=1;i<=3;i++){
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
            for (let i=0;i<rungCount;i++){
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
        for (let x=-128;x<896;x+=96){
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
        if (comparison) comparison.textures.push(signTexture);
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
    let pL=0, mL=tr.mesa*S, bridgeL=(isCarreta || tr.tipo === 'reta' ? 3.15 : getPranchaAxleArea(tr).length + 0.8)*S;
    if (!isCarreta) pL = tr.pescoco*S;
    
    const isRigidTruck = tr.tipo === 'caminhao';
    const deckY = isRigidTruck ? hT : ((tr.tipo==='reta' || isCarreta) ? pH : hT);
    let rearStart = 0;
    if (isCarreta) {
        rearStart = -mL; 
    } else {
        rearStart = tr.tipo==='reta' ? -pL-mL : -pL-getDeckTransitionLength(tr)*S-mL;
    }
    const rearEnd = isCarreta || tr.tipo === 'reta' ? rearStart : rearStart-bridgeL;
    
    const shiftZ = 1.5 * S; 
    
    const usesChassisModel = ['carreta_ext', 'carreta', 'sider', 'carreta_bau', 'vanderleia'].includes(tr.tipo);

    function drawRigidTruckBodywork() {
        const tampH = 0.80*S, tampT = 0.03*S;
        const includeSideboards = inputs.tampas.value === 'com';
        const deckCenterZ = -mL/2 + shiftZ;

        // Malhal (frente) mais alto, tampa traseira e, opcionalmente, as laterais.
        box(wT, tampH*1.5, tampT, corrugatedMat, 0, deckY + (tampH*1.5)/2, shiftZ - tampT/2);
        box(wT, tampH, tampT, corrugatedMat, 0, deckY + tampH/2, -mL + shiftZ + tampT/2);
        if (includeSideboards) {
            [-1,1].forEach(side => {
                box(tampT, tampH, mL - 2*tampT, corrugatedMat, side*(wT/2 - tampT/2), deckY + tampH/2, deckCenterZ);
            });
        }
        drawTrailerSideboardDetails(wT, mL, deckY, tampH, tampT, deckCenterZ, includeSideboards);

        // Sinalização vermelha e branca colada na lateral, na linha do assoalho.
        const stripCount = Math.max(2, Math.round(tr.mesa / 0.4));
        const stripLength = (mL - 0.3*S) / stripCount;
        const stripThickness = 0.012*S;
        for (let i = 0; i < stripCount; i++) {
            const z = shiftZ - 0.15*S - stripLength*(i + 0.5);
            [-1,1].forEach(side => {
                box(stripThickness, 0.09*S, stripLength, i % 2 === 0 ? bumperRed : bumperWhite,
                    side*(wT/2 + stripThickness/2), deckY - 0.11*S, z);
            });
        }
    }

    function drawRigidTruckFallback() {
        const deckCenterZ = -mL/2 + shiftZ;
        const cabLength = (tr.cabL ?? 2) * S;
        const cabHeight = (tr.cabH ?? 2.5) * S;
        box(wT, .24*S, mL, frame, 0, deckY - .12*S, deckCenterZ);
        box(wT*.94, .045*S, mL*.96, wood, 0, deckY + .02*S, deckCenterZ);
        box(wT*.98, cabHeight - deckY + .24*S, cabLength, white, 0, (cabHeight + deckY - .24*S)/2, shiftZ + cabLength/2 + .05*S);
        const wheelRadius = (tr.wheelR ?? .5) * S;
        const wheelZs = [shiftZ + cabLength*.55];
        for (let i = 0; i < (tr.rearAxles ?? 1); i++) wheelZs.push(shiftZ - mL + (1 + i*1.3)*S);
        wheelZs.forEach(z => [-1, 1].forEach(side => {
            wheel(side*(wT/2 - .2*S), wheelRadius, z, wheelRadius, .3*S, trailerGroup, false);
        }));
    }

    function addRigidTruckModel() {
        if (!comparison) setVehicleModelStatus('Carregando o modelo 3D do veículo…');
        const promise = loadRigidVehicle(tr).then(vehicle => {
            if (!isCurrent()) return;

            const object = vehicle.clone(true);
            object.scale.setScalar(S);
            object.position.set(0, 0, shiftZ);
            trailerGroup.add(object);
            if (comparison?.includeLoads) {
                object.traverse(node => {
                    if (node.userData.hiddenInTransport) node.visible = false;
                });
                comparison.rigidVehicle = object;
            }
            if (!comparison) {
                if (!comparison) setVehicleModelStatus('');
                frameVehicleView();
            }
        }).catch(error => {
            console.error(`Erro ao carregar o modelo ${tr.modelo}:`, error);
            if (!isCurrent()) return;
            if (comparison) throw error;
            setVehicleModelStatus('Não foi possível carregar o modelo 3D; exibindo uma carroceria simplificada.', true);
            drawRigidTruckFallback();
            frameVehicleView();
        });
        modelPromises.push(promise);
    }

    function addChassisModel() {
        const loadChassis = () => loadTrailerChassis().then(source => {
            if (!isCurrent()) return;

            const chassis = source.clone(true);
            // O pino do GLB é substituído pelo pino alinhado à quinta-roda.
            const originalKingpin = chassis.getObjectByName('mesh_32');
            if (!originalKingpin || originalKingpin.material?.name !== 'plastic_black.002') {
                throw new Error('Não foi possível localizar o pino original do chassi da carreta.');
            }
            originalKingpin.visible = false;
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
                        material.color.setHex(0x202124);
                    } else if (/rim|hub|alum|chrome|mirror/.test(name)) {
                        material.map = null;
                        material.color.setHex(0x9ca3af);
                        if ('metalness' in material) material.metalness = 0.12;
                        if ('roughness' in material) material.roughness = 0.48;
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

            if (isCurrent()) trailerGroup.add(chassis);
        }).catch(error => {
            console.error('Erro ao carregar o chassi da carreta:', error);
            if (comparison && isCurrent()) throw error;
            if (!comparison && isCurrent()) setVehicleModelStatus('Não foi possível carregar o chassi 3D da carreta. Verifique a conexão e tente novamente.', true);
        });

        modelPromises.push(loadChassis());
    }

    const cabModelId = inputs.cavalinho.value || 'semi_obj';
    if (isRigidTruck) addRigidTruckModel();
    else {
        setVehicleModelStatus('');
        const driverPromise = CAB_MODELS[cabModelId].driver ? loadDriverRig() : Promise.resolve(null);
        const promise = Promise.all([loadCabModel(cabModelId), driverPromise]).then(([source, driverRig]) => {
        if (!isCurrent()) return;

        const object = source.clone(true);
        if (comparison) object.traverse(node => { if (node.isMesh) node.userData.sharedGeometry = true; });
        
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
                    const sourceMaterialName = (material.name || '').toLowerCase();

                    const isDarkDetail = /glass|window|windshield|tire|tyre|rubber|wheel|pneu|vidro|grill|grille|lamp|headlight|tail.?light|preto|black|chrome|logo|cinza|gray|grey|prata|silver/.test(materialName);

                    if (Array.isArray(cabConfig.grayMeshNames) && cabConfig.grayMeshNames.includes(node.name)) {
                        material.color.setHex(0x383c42);
                        if ('metalness' in material) material.metalness = 0.45;
                        if ('roughness' in material) material.roughness = 0.55;
                    } else if (Array.isArray(cabConfig.whiteMeshNames) && cabConfig.whiteMeshNames.includes(node.name)) {
                        material.color.setHex(0xffffff);
                        material.emissive = new THREE.Color(0xffffff);
                        material.emissiveIntensity = 0.8;
                        if ('metalness' in material) material.metalness = 0.05;
                        if ('roughness' in material) material.roughness = 0.5;
                    } else if (cabModelId === 'scania_s_730' && /^logo_scania(?:\.\d+)?$/.test(sourceMaterialName)) {
                        material.color.setHex(0xf2f4f6);
                        material.emissive = new THREE.Color(0x626870);
                        material.emissiveIntensity = 0.35;
                        if ('metalness' in material) material.metalness = 0.75;
                        if ('roughness' in material) material.roughness = 0.22;
                    } else if (cabModelId === 'scania_s_730' && /^preto_scania(?:\.\d+)?$/.test(sourceMaterialName)) {
                        material.color.setHex(0x282a2e);
                        material.emissive = new THREE.Color(0x080a0c);
                        material.emissiveIntensity = 0.15;
                        if ('metalness' in material) material.metalness = 0.15;
                        if ('roughness' in material) material.roughness = 0.70;
                    } else if (cabModelId === 'scania_s_730' && /^prata(?:\.\d+)?$/.test(sourceMaterialName)) {
                        material.color.setHex(0x9ca3af);
                        material.emissive = new THREE.Color(0x252a30);
                        material.emissiveIntensity = 0.2;
                        if ('metalness' in material) material.metalness = 0.18;
                        if ('roughness' in material) material.roughness = 0.48;
                    } else if (cabModelId === 'scania_s_730' && /^pneu(?:\.\d+)?$/.test(sourceMaterialName)) {
                        material.color.setHex(0x202124);
                        if ('metalness' in material) material.metalness = 0;
                        if ('roughness' in material) material.roughness = 0.9;
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

            if (cabModelId === 'scania_s_730') {
                const cabinLight = new THREE.PointLight(0xfff4e8, 2.5, 8, 2);
                cabinLight.position.set(
                    0,
                    bounds.min.y + size.y * 0.66,
                    bounds.max.z - size.z * 0.28
                );
                object.add(cabinLight);
            }
        }

        if (isCurrent()) {
            const fifthWheel = CAB_MODELS[cabModelId].fifthWheel;
            const kingpinZ = shiftZ - 0.5 * S;
            object.position.z += kingpinZ - fifthWheel.z * S;
            if (driverRig) {
                try {
                    addCabDriver(object, driverRig, cabModelId, CAB_MODELS[cabModelId].driver, S);
                } catch (error) {
                    console.warn(`Não foi possível posicionar o motorista em ${cabModelId}.`, error);
                }
            }
            const kingpinTop = (isCarreta ? deckY - 0.26 * S : pH - 0.2 * S);
            const kingpinBottom = fifthWheel.y * S - 0.03 * S;
            const kingpinHeight = kingpinTop - kingpinBottom;
            const kingpin = mesh(
                new THREE.CylinderGeometry(0.08*S, 0.08*S, kingpinHeight, 16),
                steel, 0, (kingpinTop + kingpinBottom) / 2, kingpinZ
            );
            kingpin.name = 'trailer_kingpin';
            trailerGroup.add(object);
            if (comparison?.includeLoads) comparison.cab = object;
            if (!comparison) frameVehicleView();
        }
    }).catch(error => {
        console.error(`Erro ao carregar o cavalinho ${cabModelId}:`, error);
        if (comparison && isCurrent()) throw error;
        if (!comparison && isCurrent()) setVehicleModelStatus('Não foi possível carregar o cavalinho 3D. Verifique a conexão e tente novamente.', true);
    });
        modelPromises.push(promise);
    }

    const deckMat=usesChassisModel ? white : frame;
    const woodMat=wood;

    if (isRigidTruck) {
        // A carroceria vem do modelo 3D; tampas e sinalização são desenhadas aqui.
        if (!tr.paredesFixas) drawRigidTruckBodywork();
    } else if (isCarreta) {
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
                
                for (let i=0; i<tr.eixos; i++){
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
            const lgZ = -1.8 * S + shiftZ;
            box(0.1*S, deckY - 0.2*S, 0.15*S, frame, wT/2 - 0.3*S, (deckY - 0.2*S)/2, lgZ);
            box(0.1*S, deckY - 0.2*S, 0.15*S, frame, -wT/2 + 0.3*S, (deckY - 0.2*S)/2, lgZ);
            box(0.2*S, 0.05*S, 0.2*S, frame, wT/2 - 0.3*S, 0.025*S, lgZ);
            box(0.2*S, 0.05*S, 0.2*S, frame, -wT/2 + 0.3*S, 0.025*S, lgZ);
            box(0.05*S, 0.05*S, 0.2*S, steel, wT/2 - 0.2*S, deckY - 0.6*S, lgZ);

            const axleY = 0.49*S;
            const rW = 0.48*S;
            const axSpacing = axleLayout.spacing*S;
            
            for (let i=0; i<tr.eixos; i++){
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
        box(wT*.9, 0.04*S, pL*.96, neckWood, 0, pH+0.02*S, -pL/2 + shiftZ);
        drawDeckDetails(wT,pL,-pL/2+shiftZ,pH+0.045*S,true,neckWood);

        const spare = new THREE.Group();
        spare.name = 'estepe';
        spare.position.set(0, pH + 0.0805*S, shiftZ - pL/2);
        trailerGroup.add(spare);
        const spareWidth = 0.3*S;
        mesh(new THREE.CylinderGeometry(0.48*S, 0.48*S, spareWidth, 32), rubber, 0, spareWidth/2, 0, spare);
        mesh(new THREE.CylinderGeometry(0.26*S, 0.26*S, spareWidth + 0.01*S, 32), rim, 0, spareWidth/2, 0, spare);
        mesh(new THREE.CylinderGeometry(0.1*S, 0.1*S, spareWidth + 0.02*S, 24), steel, 0, spareWidth/2, 0, spare);

        const supportZ = shiftZ - pL + 0.48*S;
        const supportTop = pH - 0.1*S;
        [-1, 1].forEach(side => {
            const support = new THREE.Group();
            support.name = 'pe_de_apoio';
            support.position.set(side*wT*0.32, 0, supportZ);
            trailerGroup.add(support);
            const outerBottom = 0.76*S;
            box(0.24*S, supportTop-outerBottom, 0.24*S, frame, 0, (supportTop+outerBottom)/2, 0, support);
            box(0.16*S, 0.52*S, 0.16*S, frame, 0, 0.60*S, 0, support);
            const foot = mesh(new THREE.CylinderGeometry(0.11*S, 0.22*S, 0.14*S, 4), frame, 0, 0.35*S, 0, support);
            foot.rotation.y = Math.PI/4;
        });
        
        if (tr.tipo==='reta'){
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
            back.rotation.x = Math.atan2(rearDy, rearDrop);
            
            const axleDeckLength = getPranchaAxleArea(tr).length * S;
            const axleDeckY = hT + rearDy;
            const axleDeckCenterZ = rearEnd + shiftZ + axleDeckLength/2;
            box(wT, 0.24*S, axleDeckLength, deckMat, 0, axleDeckY - 0.12*S, axleDeckCenterZ);
            box(wT*.9, 0.045*S, axleDeckLength*.96, woodMat, 0, axleDeckY + 0.02*S, axleDeckCenterZ);
            drawDeckDetails(wT,axleDeckLength,axleDeckCenterZ,axleDeckY+0.045*S);
        }
        const axleY=.49*S;
        const axlePositions=[];
        for (let i=0;i<tr.eixos;i++){
            const z = rearEnd + shiftZ + .55*S + i*(Math.min(1.18*S,bridgeL/Math.max(1,tr.eixos)));
            axlePositions.push(z);
            [-1,1].forEach(side=>{
                const x=side*(wT/2-.35*S);
                wheel(x-side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, side > 0);
                wheel(x+side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, false);
            });
        }
        if (tr.tipo==='reta'){
            drawStraightSuspension(wT,pH,pL+mL,(-pL-mL)/2+shiftZ,axleY,axlePositions);
        }

        drawRearRamps(wT,tr.tipo==='reta'?pH:hT+0.2*S,rearEnd+shiftZ);
    }

    if (comparison && !comparison.includeLoads) return Promise.all(modelPromises);

    // --- RENDERIZAÇÃO DAS CARGAS COMPOSTAS ---
    let loadFrontZ = shiftZ;
    if (!isCarreta) {
        loadFrontZ -= pL + getDeckTransitionLength(tr)*S;
        if (pos === 'eixos') loadFrontZ -= getPranchaAxleArea(tr).start*S;
    }
    const loadSequence = activeCargaTab === 'tubos'
        ? { loads: [] }
        : getLoadSequenceMetrics(tr,isCarreta);

    function lashingRibbon(curve, width, material, group, widthX = 0, widthZ = 1) {
        const points = curve.getPoints(16);
        const vertices = [];
        const indices = [];
        points.forEach((point, index) => {
            vertices.push(point.x - widthX * width / 2, point.y, point.z - widthZ * width / 2,
                point.x + widthX * width / 2, point.y, point.z + widthZ * width / 2);
            if (index) {
                const a = (index - 1) * 2;
                indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
            }
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return mesh(geometry, material, 0, 0, 0, group);
    }

    function drawLoadLashing(carga, x, y, z, width, height, length, deckHeight, plan, splitCoils) {
        if (!plan) return;
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.name = 'amarração ilustrativa';
        trailerGroup.add(group);
        const chain = plan.equipment === 'chain_grade_8';
        const cable = plan.equipment === 'steel_cable';
        const material = mat(chain ? 0x505b61 : cable ? 0xa2adb3 : 0xe59a13, 0.55, chain || cable ? 0.75 : 0.1);
        if (!chain && !cable) material.side = THREE.DoubleSide;
        const metal = mat(0x89949a, 0.35, 0.8);
        const radius = (chain ? 0.018 : 0.025) * S;
        const hookY = deckHeight - y - 0.02 * S;
        const halfWidth = width / 2 + radius * 2;
        const top = height / 2 + radius * 2;
        const bottom = -height / 2;
        const anchorX = [-wT / 2 - x, wT / 2 - x];
        const corner = radius * 2;

        for (let i = 0; i < plan.count; i++) {
            const along = ((i + 1) / (plan.count + 1) - 0.5) * length * 0.85;
            const curve = new THREE.CurvePath();
            const point = (px, py, pz = along) => new THREE.Vector3(px, py, pz);
            const cylindrical = cylindricalLashingPoints(carga, plan, i, width, height, length, S, hookY, anchorX, corner, splitCoils);
            if (cylindrical) {
                const points = cylindrical.map(coords => new THREE.Vector3(...coords));
                for (let j = 1; j < points.length; j++) curve.add(new THREE.LineCurve3(points[j - 1], points[j]));
            } else if (plan.arrangement === 'transverse') {
                const leftAnchor = point(anchorX[0], hookY);
                const leftBase = point(-halfWidth, bottom);
                const leftSide = point(-halfWidth, top - corner);
                const leftTop = point(-halfWidth + corner, top);
                const rightTop = point(halfWidth - corner, top);
                const rightSide = point(halfWidth, top - corner);
                const rightBase = point(halfWidth, bottom);
                const rightAnchor = point(anchorX[1], hookY);
                curve.add(new THREE.LineCurve3(leftAnchor, leftBase));
                curve.add(new THREE.LineCurve3(leftBase, leftSide));
                curve.add(new THREE.QuadraticBezierCurve3(leftSide, point(-halfWidth, top), leftTop));
                curve.add(new THREE.LineCurve3(leftTop, rightTop));
                curve.add(new THREE.QuadraticBezierCurve3(rightTop, point(halfWidth, top), rightSide));
                curve.add(new THREE.LineCurve3(rightSide, rightBase));
                curve.add(new THREE.LineCurve3(rightBase, rightAnchor));
            } else {
                const points = illustrativeLashingPoints(plan, i, width, length, top, hookY, anchorX, corner)
                    .map(coords => new THREE.Vector3(...coords));
                for (let j = 1; j < points.length; j++) curve.add(new THREE.LineCurve3(points[j - 1], points[j]));
            }
            if (chain || cable) {
                mesh(new THREE.TubeGeometry(curve, 64, radius, 8, false), material, 0, 0, 0, group);
            }
            if (chain) {
                const linkCount = Math.min(256, Math.max(2, Math.ceil(curve.getLength() / (0.10 * S))));
                const links = new THREE.InstancedMesh(new THREE.TorusGeometry(radius * 1.6, radius * 0.35, 5, 10), metal, linkCount);
                const link = new THREE.Object3D();
                for (let linkIndex = 0; linkIndex < linkCount; linkIndex++) {
                    const t = (linkIndex + 0.5) / linkCount;
                    link.position.copy(curve.getPointAt(t));
                    link.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), curve.getTangentAt(t).normalize());
                    if (linkIndex % 2) link.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
                    link.scale.set(1.45, 1, 1);
                    link.updateMatrix();
                    links.setMatrixAt(linkIndex, link.matrix);
                }
                links.instanceMatrix.needsUpdate = true;
                links.castShadow = true;
                group.add(links);
            } else if (!cable) {
                const start = curve.getPoint(0);
                const end = curve.getPoint(1);
                const dx = end.x - start.x;
                const dz = end.z - start.z;
                const horizontal = Math.hypot(dx, dz) || 1;
                lashingRibbon(curve, 0.05 * S, material, group, dz / horizontal, -dx / horizontal);
            }
            [curve.getPoint(0), curve.getPoint(1)].forEach(hook => {
                box(radius * 4, radius * 3, radius * 6, metal, hook.x, hook.y, hook.z, group);
                box(radius * 5, radius * 3, radius * 9, metal, hook.x, hook.y + radius * 8, hook.z, group);
            });
        }
    }

    loadSequence.loads.forEach(({ carga, originalCarga, grid, startOffset, mesaStartOffset, eixoStartOffset, splitCoils, stackBaseHeight }) => {
        const lashing = displayedLashing(originalCarga);
        const cW = Math.max(.1, carga.larg) * S;
        const cH = Math.max(.1, carga.alt) * S;
        const cL = Math.max(.1, carga.comp) * S;
        
        const loadDeckY = !isCarreta && pos === 'eixos' && tr.tipo !== 'reta'
            ? getPranchaAxleArea(tr).height*S : (tr.tipo === 'reta' ? pH : (isCarreta ? deckY : hT));
        const loadY = loadDeckY +
            stackBaseHeight * S + cH/2;
        const loadZ_start = loadFrontZ-startOffset*S;
        
        const baseItem = new THREE.Group();
        const generalInstances = [];
        
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

            if (withDiagonals){
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

            if (axis === 'x'){
                cylinderAlongX(cableRadius,length*0.78,cableMaterial,x,y,z);
            } else {
                cylinderAlongZ(cableRadius,length*0.78,cableMaterial,x,y,z);
            }

            const wraps = 22;
            for (let i=0;i<wraps;i++){
                const along = (i/(wraps-1)-0.5)*length*0.76;
                const ringPosition = axis === 'x' ? [x+along,y,z] : [x,y,z+along];
                const wrap = mesh(
                    new THREE.TorusGeometry(cableRadius,Math.max(0.025*S,radius*0.025),8,32),
                    cableMaterial,...ringPosition,baseItem
                );
                if (axis === 'x') wrap.rotation.y = Math.PI/2;
            }

            endPositions.forEach(position => {
                const flange = mesh(
                    new THREE.TorusGeometry(flangeRadius,Math.max(0.045*S,radius*0.055),10,40),
                    flangeMaterial,...position,baseItem
                );
                if (axis === 'x') flange.rotation.y = Math.PI/2;

                const hub = axis === 'x'
                    ? cylinderAlongX(radius*0.22,length*0.12,hubMaterial,...position)
                    : cylinderAlongZ(radius*0.22,length*0.12,hubMaterial,...position);
                hub.castShadow = true;

                for (let spoke=0;spoke<12;spoke++){
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

        if (generalCargoByType.has(carga.type)) {
            // O modelo é anexado às instâncias após o carregamento assíncrono.
        } else if (carga.type.startsWith('bobina_')){
            const coilCount = splitCoils ? 1 : (carga.type.endsWith('_2') ? 2 : 1);
            const axis = carga.type.includes('_lado_') ? 'x' : 'z';
            const sectionLength = splitCoils ? cL/2 : cL/coilCount;
            const radius = Math.max(0.06*S,Math.min(cH,axis === 'x' ? sectionLength : cW)*0.46);
            const supportThickness = cH*0.08;
            const flangeOuterRadius = radius*1.08+Math.max(0.045*S,radius*0.055);
            const coilCenterY = -cH/2+supportThickness+flangeOuterRadius;
            for (let i=0;i<coilCount;i++){
                const centerZ = splitCoils ? 0 : -cL/2 + sectionLength*(i+0.5);
                const currentCoilLength = axis === 'x' ? cW*0.78 : sectionLength*0.78;
                drawCoil(axis,radius,currentCoilLength,0,coilCenterY,centerZ);
            }
            cargoBox(cW*0.84,supportThickness,(splitCoils?sectionLength:cL)*0.92,navy,0,-cH/2+supportThickness/2,0);
        } else if (carga.type === 'container_mae') {
            const red = mat(0x9f0814,0.5,0.35);
            const frameRed = mat(0x790711,0.45,0.45);
            const white = mat(0xf3f4ed,0.55,0.2);
            const yellow = mat(0xd5e900,0.5,0.2);
            const dark = mat(0x3e1114,0.55,0.4);
            const rail = Math.min(cW,cH,cL)*0.035;
            cargoBox(cW*0.96,cH*0.96,cL*0.96,red);
            [-1,1].forEach(side => {
                const x = side*cW*0.48;
                cargoBox(rail,cH*0.96,cL*0.98,frameRed,x,0,0);
                cargoBox(rail*1.12,cH*0.075,cL*0.98,white,x,0,0);
                for (let i=0;i<=4;i++) {
                    const z = -cL*0.46+i*cL*0.23;
                    cargoBox(rail*1.15,cH*0.92,rail,frameRed,x,0,z);
                    cargoBox(rail*1.3,cH*0.075,rail*1.15,white,x,0,z);
                }
                [-1,1].forEach(end => {
                    const z = end*cL*0.47;
                    cargoBox(cW*0.065,cH*0.17,cL*0.065,yellow,side*cW*0.47,cH*0.415,z);
                    cargoBox(cW*0.065,cH*0.17,cL*0.065,yellow,side*cW*0.47,-cH*0.415,z);
                });
            });
            [-1,1].forEach(end => {
                const z = end*cL*0.485;
                cargoBox(cW*0.94,rail,cL*0.035,frameRed,0,cH*0.46,z);
                cargoBox(cW*0.94,rail,cL*0.035,frameRed,0,-cH*0.46,z);
                if (end < 0) {
                    cargoBox(cW*0.94,cH*0.075,cL*0.025,white,0,0,z);
                    [-1,1].forEach(side => {
                        cargoBeam([side*cW*0.42,cH*0.42,z],[side*cW*0.16,cH*0.05,z],rail,frameRed);
                        cargoBox(rail,cH*0.9,rail,frameRed,side*cW*0.16,0,z);
                    });
                } else {
                    cargoBox(rail,cH*0.91,rail,frameRed,0,0,z);
                    [-1,1].forEach(side => {
                        cargoBox(rail*0.65,cH*0.86,rail,frameRed,side*cW*0.17,0,z);
                        [-0.29,0.29].forEach(y => {
                            cargoBox(cW*0.13,rail*0.6,rail*1.3,frameRed,side*cW*0.17,y*cH,z);
                            cargoBox(rail*0.8,rail*0.85,rail*1.4,dark,side*cW*0.17,y*cH,z);
                        });
                        [-0.32,0,0.32].forEach(y => {
                            cargoBox(cW*0.12,rail*0.75,rail,frameRed,side*cW*0.39,y*cH,z);
                        });
                    });
                }
            });
            const labelCanvas = document.createElement('canvas');
            labelCanvas.width = 512; labelCanvas.height = 256;
            const labelContext = labelCanvas.getContext('2d');
            labelContext.fillStyle = '#ffffff';
            labelContext.font = 'bold 42px sans-serif';
            labelContext.fillText('CORAÇÃO DE MÃE', 16, 62);
            labelContext.font = 'bold 34px monospace';
            labelContext.fillText('CM-0001', 16, 128);
            labelContext.fillText('TYPE A', 16, 172);
            const labelTexture = new THREE.CanvasTexture(labelCanvas);
            const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, depthWrite: false });
            labelMaterial.userData.ownedTexture = labelTexture;
            [-1,1].forEach(side => {
                const label = new THREE.Mesh(new THREE.PlaneGeometry(cL*0.3,cH*0.16),labelMaterial);
                label.position.set(side*cW*0.499,cH*0.25,0);
                label.rotation.y = side*Math.PI/2;
                baseItem.add(label);
            });
            const doorLabel = new THREE.Mesh(new THREE.PlaneGeometry(cW*0.3,cH*0.16),labelMaterial);
            doorLabel.position.set(cW*0.22,-cH*0.16,cL*0.505);
            baseItem.add(doorLabel);
        } else if (CONTAINER_LOAD_TYPES.has(carga.type)){
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
                for (let i=0;i<plankCount;i++){
                    const z=-cL*0.47+(i+0.5)*cL*0.94/plankCount;
                    cargoBox(cW*0.9,cH*0.035,cL*0.94/plankCount*0.92,containerWood,0,-cH*0.38,z);
                }
                if (isFlatRack) {
                    [-1,1].forEach(end=>{
                        cargoBox(cW*0.88,cH*0.74,ribD*2.8,steelBlue,0,cH*0.03,end*cL*0.46);
                        [-1,1].forEach(side=>{
                            cargoBox(ribD*2.8,cH*0.82,ribD*3.2,steelBlue,side*cW*0.44,cH*0.02,end*cL*0.46);
                            for (let row=0;row<8;row++){
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

                for (let i=0;i<=ribs;i++){
                    const z=-cL/2+i*cL/ribs;
                    [-1,1].forEach(side=>{
                        if (!isSideOpen || side<0){
                            cargoBox(ribD,cH*.94,.035*S,ribMat,side*(cW/2-ribD/2),isSideOpen?-cH*0.05:0,z);
                        }
                    });
                }
                if (isSideOpen){
                    cargoBox(cW,cH*.94,ribD,contMat,0,0,-cL/2+ribD/2);
                    cargoBox(cW,cH*.94,ribD,contMat,0,0,cL/2-ribD/2);
                    const postCount=Math.max(4,Math.min(16,Math.floor(cL/(0.9*S))));
                    for (let i=0;i<=postCount;i++){
                        const z=-cL/2+i*cL/postCount;
                        cargoBox(ribD,cH*.94,ribD,steelBlue,cW*0.47,cH*0.02,z);
                    }
                    [-1,1].forEach(side=>{
                        const door=cargoBox(cW*0.08,cH*0.82,cL*0.35,contMat,side*cW*0.42,0,side*cL*0.29);
                        door.rotation.y=side*Math.PI/5;
                    });
                }
                if (isVented){
                    for (let row=0;row<5;row++){
                        const y=-cH*0.28+row*cH*0.14;
                        for (let side of [-1,1]){
                            if (!isSideOpen || side<0) cargoBox(ribD*0.5,cH*0.035,cL*0.66,doorMat,side*cW*0.502,y,0);
                        }
                    }
                }

                const roofMat=isHardTop?steelBlue:contMat;
                if (!isOpenTop){
                    cargoBox(cW*.98,.08*S,cL*.98,roofMat,0,cH/2,0);
                } else {
                    cargoBox(cW*.06,.08*S,cL*.98,steelBlue,-cW*.47,cH/2,0);
                    cargoBox(cW*.06,.08*S,cL*.98,steelBlue,cW*.47,cH/2,0);
                    for (let i=0;i<6;i++){
                        const z=-cL*.42+i*cL*.168;
                        cargoBox(cW*.96,.045*S,.035*S,steelBlue,0,cH/2,z);
                    }
                }
                cargoBox(cW*.98,.08*S,cL*.98,containerWood,0,-cH/2,0);

                if (isOpenTop){
                    const tarpMat=mat(0x2563a6,0.86);
                    const tarpGeometry=new THREE.PlaneGeometry(cW,cL,8,24);
                    const positions=tarpGeometry.attributes.position;
                    for (let i=0;i<positions.count;i++){
                        const x=positions.getX(i);
                        positions.setZ(i,0.075*S*(1-Math.pow(2*x/cW,2)));
                    }
                    tarpGeometry.computeVertexNormals();
                    const tarp=mesh(tarpGeometry,tarpMat,0,cH/2+0.08*S,0,baseItem,false);
                    tarp.rotation.x=-Math.PI/2;
                    const strapMat=mat(0x1e293b);
                    for (let i=0;i<5;i++){
                        const z=-cL*0.4+i*cL*0.2;
                        cargoBox(cW*1.01,0.025*S,0.035*S,strapMat,0,cH/2+0.035*S,z);
                    }
                }

                for (let end of [-1,1]){
                    cargoBox(cW*0.96,cH*.94,ribD,doorMat,0,0,end*(cL/2-ribD));
                    for (let i=0;i<5;i++){
                        const x=-cW*0.36+i*cW*0.18;
                        cargoBox(cW*0.025,cH*.86,ribD*1.5,steelBlue,x,0,end*(cL/2+ribD*0.55));
                    }
                    cargoBox(cW*0.9,cH*.045,ribD*1.5,steelBlue,0,cH*0.24,end*(cL/2+ribD*0.55));
                    cargoBox(cW*0.9,cH*.045,ribD*1.5,steelBlue,0,-cH*0.24,end*(cL/2+ribD*0.55));
                    if (isDoubleDoor){
                        cargoBox(cW*0.04,cH*.72,ribD*2.1,bumperWhite,0,0,end*(cL/2+ribD));
                    }
                }

                if (isReefer){
                    cargoBox(cW*.22,cH*.72,cH*.12,bumperWhite,0,0,cL/2+cH*.06);
                    for (let i=0;i<5;i++){
                        cargoBox(cW*.13,cH*.025,cH*.015,steelBlue,0,cH*.18-i*cH*.07,cL/2+cH*.13);
                    }
                    for (let side of [-1,1]){
                        cargoBox(cW*.22,cH*.025,cL*.42,doorMat,side*cW*.503,cH*.2,0);
                        cargoBox(cW*.22,cH*.025,cL*.42,doorMat,side*cW*.503,cH*.28,0);
                    }
                }

                if (isBulk){
                    const hatchCount=cL>20?4:2;
                    for (let i=0;i<hatchCount;i++){
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
                    for (let i = 0; i < p * 2; i++) {
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
        } else if (carga.type==='palete_caixas'){
            const wood = mat(0x795334,0.82,0.24);
            const cardboard = mat(0xb99055,0.9,0.08);
            const tape = mat(0x6f4c27,0.8,0.2);
            const palletH = cH*0.12;
            const boxH = cH*0.82;

            for (let i=0;i<5;i++){
                const boardW = cW/5;
                cargoBox(boardW*0.94,palletH*0.28,cL*0.96,wood,-cW/2+boardW*(i+0.5),-cH/2+palletH*0.86,0);
            }
            for (let i=0;i<3;i++){
                cargoBox(cW*0.12,palletH*0.58,cL*0.92,wood,-cW*0.38+i*cW*0.38,-cH/2+palletH*0.34,0);
            }
            for (let row=0;row<2;row++){
                for (let col=0;col<2;col++){
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
        } else if (carga.type==='caixa_metalica'){
            const blue = mat(0x174a9a,0.42,0.58);
            const yellow = mat(0xd8d52c,0.52,0.4);
            const rib = Math.max(0.035*S,Math.min(cW,cH,cL)*0.018);
            cargoBox(cW*0.94,cH*0.88,cL*0.94,blue,0,0,0);
            cargoBox(cW,cH*0.06,cL,blue,0,cH*0.47,0);
            [-1,1].forEach(side=>{
                cargoBox(rib,cH*0.9,cL*0.94,blue,side*cW*0.48,0,0);
                for (let i=1;i<5;i++){
                    cargoBox(rib*0.85,cH*0.82,rib*1.4,blue,side*cW*0.49,0,-cL*0.4+i*cL*0.2);
                }
            });
            [-1,1].forEach(xSide=>[-1,1].forEach(zSide=>{
                cargoBox(cW*0.1,cH,cL*0.1,yellow,xSide*cW*0.45,0,zSide*cL*0.45);
                cargoBox(cW*0.12,cH*0.08,cL*0.12,yellow,xSide*cW*0.44,cH*0.46,zSide*cL*0.44);
            }));
            cargoBox(cW*0.94,cH*0.08,cL*0.94,blue,0,-cH*0.46,0);
        } else if (carga.type==='cesta_metalica'){
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
            for (let i=1;i<5;i++){
                const x = -halfW+i*(halfW*2/5);
                const z = -halfL+i*(halfL*2/5);
                cargoBeam([x,floorY,-halfL],[x,halfH,-halfL],tube*0.65,basketFloor);
                cargoBeam([x,floorY,halfL],[x,halfH,halfL],tube*0.65,basketFloor);
                cargoBeam([-halfW,floorY,z],[-halfW,halfH,z],tube*0.65,basketFloor);
                cargoBeam([halfW,floorY,z],[halfW,halfH,z],tube*0.65,basketFloor);
            }
        } else if (carga.type==='cacamba_vazia' || carga.type==='cacamba_cheia'){
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
                for (let i=1;i<4;i++){
                    const z = -topL+i*(topL*2/4);
                    cargoBeam([side*topW,bodyY*0.94,z],[side*bottomW,bottomY*0.96,z*bottomL/topL],rim*0.75,darkBody);
                }
            });
            cargoBox(cW*0.76,cH*0.06,cL*0.72,darkBody,0,-cH*0.45,0);

            if (carga.type==='cacamba_cheia'){
                const fillMaterial = mat(0x6f6253,0.95,0.05);
                const fill = mesh(new THREE.SphereGeometry(1,20,14),fillMaterial,0,cH*0.28,0,baseItem);
                fill.scale.set(cW*0.38,cH*0.2,cL*0.37);
                const rockColors = [0x77736b,0x9b9285,0x5c5b58,0xb0a391];
                for (let i=0;i<24;i++){
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
        } else if (carga.type==='skid_cilindros'){
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
            for (let row=0;row<rows;row++){
                for (let col=0;col<columns;col++){
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
        } else if (carga.type==='tubulacao'){
            const radius=Math.min(cH*.22,cW*.13,.35*S);
            const rowsL=Math.max(1,Math.floor(cH/(radius*2.1)));
            const colsL=Math.max(1,Math.floor(cW/(radius*2.1)));
            let n=0;
            for (let row=0;row<rowsL && n<28;row++){
                for (let col=0;col<colsL && n<28;col++,n++){
                    const cx=(col-(Math.min(colsL,28)-1)/2)*radius*2.1;
                    const cy=-cH/2+radius+(row*radius*2.1);
                    cylinderAlongZ(radius,cL*.96, n%3===0?steelLight:mat(0x647585),cx,cy,0,20);
                }
            }
            cargoBox(cW*1.02,.12*S,cL*.98,navy,0,-cH/2-.08*S,0);
        } else if (carga.type==='coracao_mae_aberto'){
            const cageFrame = mat(0x71322c,0.55,0.45);
            const cageHighlights = mat(0xd5e900,0.5,0.25);
            const engineSteel = mat(0xa6afb2,0.42,0.65);
            const engineDark = mat(0x30393e,0.48,0.58);
            const engineLight = mat(0xd0d5d3,0.38,0.68);
            buildCage(cageFrame,cageHighlights,true);

            cargoBox(cW*0.72,cH*0.08,cL*0.8,engineDark,0,-cH*0.39,0);
            cargoBox(cW*0.66,cH*0.2,cL*0.76,engineSteel,0,-cH*0.25,0);
            cargoBox(cW*0.62,cH*0.28,cL*0.73,engineLight,0,-cH*0.01,0);
            cargoBox(cW*0.54,cH*0.15,cL*0.72,engineSteel,0,cH*0.2,0);
            const cylinderCount = 6;
            for (let i=0;i<cylinderCount;i++) {
                const z = -cL*0.3+i*cL*0.12;
                [-1,1].forEach(side => {
                    cylinderAlongX(Math.min(cH*0.065,cL*0.045),cW*0.035,engineDark,side*cW*0.325,-cH*0.12,z,20);
                    cylinderAlongX(Math.min(cH*0.045,cL*0.035),cW*0.04,engineLight,side*cW*0.29,cH*0.16,z,20);
                    cargoBox(cW*0.19,cH*0.06,cL*0.085,engineDark,side*cW*0.14,cH*0.29,z);
                    cargoBox(cW*0.025,cH*0.17,cL*0.025,engineDark,side*cW*0.33,-cH*0.26,z);
                });
            }
            [-1,1].forEach(side => {
                cylinderAlongZ(cH*0.025,cL*0.72,engineLight,side*cW*0.24,cH*0.34,0,16);
            });
            cylinderAlongZ(Math.min(cW*0.2,cH*0.19),cL*0.05,engineDark,0,-cH*0.08,cL*0.39,32);
            cylinderAlongZ(Math.min(cW*0.14,cH*0.13),cL*0.06,engineLight,0,-cH*0.08,cL*0.42,32);
        } else if (carga.type==='tanque'){
            buildCage(cageSteel,cageAccent,true);
            const tankRadius = Math.min(cW,cH)*0.34;
            cylinderAlongZ(tankRadius,cL*0.72,equipmentSteel,0,-cH*0.02,0,40);
            [-1,1].forEach(side => {
                const end = mesh(new THREE.SphereGeometry(tankRadius,24,16),equipmentSteel,0,-cH*0.02,side*cL*0.36,baseItem);
                end.scale.set(1,1,0.28);
            });
        } else if (carga.type==='skid'){
            buildCage(cageSteel,cageAccent,true);
            cargoBox(cW*0.68,cH*0.42,cL*0.62,equipmentBeige,0,-cH*0.02,0);
            cargoBox(cW*0.72,0.12*S,cL*0.68,navy,0,-cH*0.34,0);
            [-1,1].forEach(side => {
                cargoBox(0.12*S,cH*0.28,cL*0.56,equipmentSteel,side*cW*0.31,0,0);
            });
        } else if (carga.type==='estrutura' || carga.type==='cesta'){
            buildCage(carga.type==='cesta' ? equipmentSteel : cageSteel,cageAccent,true);
        } else if (carga.type==='vaso'){
            const vesselRadius = Math.min(cW,cH)*0.39;
            const vesselLength = cL*0.78;
            cylinderAlongZ(vesselRadius,vesselLength,equipmentSteel,0,0,0,40);
            [-1,1].forEach(side => {
                const head = mesh(new THREE.SphereGeometry(vesselRadius,28,20),equipmentSteel,0,0,side*vesselLength*0.46,baseItem);
                head.scale.set(1,1,0.3);
                cargoBox(cW*0.26,cH*0.18,0.25*S,navy,0,-vesselRadius*0.8,side*cL*0.2);
            });
            cargoBox(cW*0.84,0.12*S,cL*0.84,navy,0,-cH/2-0.06*S,0);
        } else if (carga.type==='gerador'){
            const baseY = -cH/2 + 0.08*S;
            cargoBox(cW*0.9,0.16*S,cL*0.9,navy,0,baseY,0);
            cargoBox(cW*0.82,cH*0.64,cL*0.76,equipmentSteel,0,cH*0.02,0);
            cargoBox(cW*0.84,0.12*S,cL*0.78,frame,0,cH*0.34,0);
            cargoBox(0.05*S,cH*0.38,cL*0.42,navy,cW*0.43,0,0);
            for (let i=0;i<6;i++){
                cargoBox(0.025*S,cH*0.42,0.035*S,steelLight,-cW*0.43+i*0.12*S,0,cL*0.2);
            }
            cargoBox(0.05*S,cH*0.2,cL*0.22,orange,cW*0.44,cH*0.1,0);
        } else {
            cargoBox(cW,cH,cL,orange, 0, 0, 0);
            cargoBox(cW*1.01,.07*S,cL*1.01,darkOrange,0,cH/2,0);
            cargoBox(cW*1.01,.07*S,cL*1.01,darkOrange,0,-cH/2,0);
        }
        
        if (splitCoils) {
            const coilLength = cL/2;
            const mesaOffset = mesaStartOffset;
            const mesaFrontZ = shiftZ-pL-getDeckTransitionLength(tr)*S-mesaOffset*S;
            const eixoFrontZ = shiftZ-pL-getDeckTransitionLength(tr)*S-(getPranchaAxleArea(tr).start+eixoStartOffset)*S;
            const eixoDeckY = tr.tipo === 'reta' ? pH : getPranchaAxleArea(tr).height*S;
            const eixoY = eixoDeckY+stackBaseHeight*S+cH/2;
            const mesaY = (tr.tipo==='reta'?pH:hT)+stackBaseHeight*S+cH/2;

            for (let i=0;i<grid.pecasNaBase;i++){
                const r=Math.floor(i/grid.maxCols);
                const c=i%grid.maxCols;
                const rowItems=Math.min(grid.maxCols,grid.pecasNaBase-r*grid.maxCols);
                const rowW=rowItems*cW+Math.max(0,rowItems-1)*grid.gap*S;
                const itemX=grid.centerX*S-rowW/2+cW/2+c*(cW+grid.gap*S);
                const rowOffset=r*(coilLength+grid.gap*S);
                for (let layer = 0; layer < getStackCount(carga, i, grid.camadas); layer++) {
                    const eixoItem=baseItem.clone();
                    eixoItem.position.set(itemX,eixoY+layer*cH,eixoFrontZ-coilLength/2-rowOffset);
                    loadGroup.add(eixoItem);
                    drawLoadLashing(carga, eixoItem.position.x, eixoItem.position.y, eixoItem.position.z, cW, cH, coilLength, eixoDeckY, lashing, true);

                    const mesaItem=baseItem.clone();
                    mesaItem.position.set(itemX,mesaY+layer*cH,mesaFrontZ-coilLength/2-rowOffset);
                    loadGroup.add(mesaItem);
                    drawLoadLashing(carga, mesaItem.position.x, mesaItem.position.y, mesaItem.position.z, cW, cH, coilLength, tr.tipo==='reta'?pH:hT, lashing, true);
                }
            }
        } else {
            for (let i = 0; i < grid.pecasNaBase; i++) {
                const r = Math.floor(i / grid.maxCols);
                const c = i % grid.maxCols;
                
                const rowItems = Math.min(grid.maxCols, grid.pecasNaBase - r * grid.maxCols);
                const rowW = rowItems * cW + Math.max(0, rowItems - 1) * grid.gap * S;
                
                const itemX = grid.centerX * S - rowW / 2 + cW / 2 + c * (cW + grid.gap * S);
                const itemZ = loadZ_start - cL / 2 - r * (cL + grid.gap * S);
                for (let layer = 0; layer < getStackCount(carga, i, grid.camadas); layer++) {
                    const inst = baseItem.clone();
                    inst.position.set(itemX, loadY + layer * cH, itemZ);
                    loadGroup.add(inst);
                    drawLoadLashing(carga, inst.position.x, inst.position.y, inst.position.z, cW, cH, cL, loadY - cH/2 - stackBaseHeight*S, lashing, false);
                    if (generalCargoByType.has(carga.type)) generalInstances.push(inst);
                }
            }
        }
        if (generalInstances.length) {
            pendingCargoModels++;
            if (!comparison) updateCargoModelStatus();
            const promise = loadGeneralCargo(carga.type).then(({ oriented, size }) => {
                if (!isCurrent()) return;
                generalInstances.forEach(instance => {
                    const model = oriented.clone(true);
                    model.scale.set(cW / size.x, cH / size.y, cL / size.z);
                    instance.add(model);
                });
                pendingCargoModels--;
                if (!comparison) updateCargoModelStatus();
            }).catch(error => {
                console.error(`Falha ao carregar a carga 3D ${getCargoLabel(carga.type)}.`, error);
                if (!isCurrent()) return;
                if (comparison) throw error;
                pendingCargoModels--;
                cargoModelErrors.add(getCargoLabel(carga.type));
                updateCargoModelStatus();
            });
            modelPromises.push(promise);
        }
    });

    if (activeCargaTab === 'tubos') {
        const tube = getTubeMetrics(tr);
        const loadCenterX = getLoadAreaCenterX(tr);
        const tubePositions = getTubePositions(tube, Math.min(tube.loaded, 1200), loadCenterX * 1000);
        if (tubePositions.length && tube.tubeLengthM > 0) {
            const diameter = tube.diameterMm / 1000 * S;
            const radius = diameter / 2;
            const length = tube.tubeLengthM * S;
            const deckHeight = tr.tipo === 'reta' ? pH : (isCarreta ? deckY : hT);
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
                    box(supportWidth, supportHeight, supportDepth, wood, loadCenterX * S, supportY, supportZ, loadGroup);
                }
            }

            const postMaterial = mat(0x202a32, 0.55, 0.55);
            const postHeight = tube.stackHeightMm / 1000 * S + 0.3 * S;
            const postX = Math.min(tr.w * S / 2 - 0.08 * S, tube.widthOccupiedMm / 2000 * S + 0.1 * S);
            [-1, 1].forEach(side => {
                for (let post = 0; post < supportCount; post++) {
                    const postZ = centerZ + (post - 1) * Math.min(length * 0.34, mL * 0.34);
                    box(0.07 * S, postHeight, 0.09 * S, postMaterial, loadCenterX * S + side * postX,
                        deckHeight + postHeight / 2, postZ, loadGroup);
                }
            });

            if (tubeStrappingEnabled) {
                const strapMaterial = mat(0xf59e0b, 0.45, 0.12);
                strapMaterial.side = THREE.DoubleSide;
                const bundleHeight = tube.stackHeightMm / 1000 * S;
                const strapPositions = [-0.39, -0.13, 0.13, 0.39];
                const strapRadius = 0.025 * S;
                const outline = [];
                const samples = 24;
                const outsideRadius = (radius + strapRadius + 0.015 * S) / Math.cos(Math.PI / samples);
                tubePositions.forEach(position => {
                    const x = position.xMm / 1000 * S;
                    const y = deckHeight + (tube.firstSleeperMm + tube.diameterMm / 2 +
                        position.layer * (tube.diameterMm + tube.layerSleeperMm)) / 1000 * S;
                    for (let i = 0; i < samples; i++) {
                        const angle = i * Math.PI * 2 / samples;
                        outline.push({ x: x + outsideRadius * Math.cos(angle), y: y + outsideRadius * Math.sin(angle) });
                    }
                });
                outline.sort((a, b) => a.x - b.x || a.y - b.y);
                const upper = [];
                outline.forEach(point => {
                    while (upper.length >= 2) {
                        const a = upper[upper.length - 2];
                        const b = upper[upper.length - 1];
                        if ((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x) < 0) break;
                        upper.pop();
                    }
                    upper.push(point);
                });

                strapPositions.forEach(position => {
                    const strapZ = centerZ + position * Math.min(length, mL * 0.92);
                    const points = [
                        new THREE.Vector3(loadCenterX * S - wT / 2, deckHeight + 0.08 * S, strapZ),
                        ...upper.map(point => new THREE.Vector3(point.x, point.y, strapZ)),
                        new THREE.Vector3(loadCenterX * S + wT / 2, deckHeight + 0.08 * S, strapZ)
                    ];
                    const strapCurve = new THREE.CurvePath();
                    for (let i = 1; i < points.length; i++) strapCurve.add(new THREE.LineCurve3(points[i - 1], points[i]));
                    const strap = lashingRibbon(strapCurve, 0.05 * S, strapMaterial, loadGroup);
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
    
    if (comparison) return Promise.all(modelPromises);

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
    const deckHeight = tr.tipo === 'reta' ? 1.6 : tr.h;
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
    const deckHeight = tr.tipo === 'reta' ? 1.6 : tr.h;
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
    ctx.fillRect(centerX + getLoadAreaCenterX(tr) * scale -
        Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000) / 2,
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
        const loadCenterX = getLoadAreaCenterX(tr);
        const positions = getTubePositions(tube, Math.min(tube.loaded, 500), loadCenterX * 1000);
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
            ctx.fillRect(centerX + loadCenterX * scale - Math.min(trailerWidth, tube.widthOccupiedMm * scale / 1000) / 2,
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
    if (CONTAINER_LOAD_TYPES.has(carga.type)) {
        let color = carga.type === 'container_mae' ? 'rgba(159,8,20,0.8)' : 'rgba(23,107,135,0.7)';
        if (carga.type !== 'container_mae') {
            if (carga.armador === 'maersk') color = 'rgba(224,229,232,0.9)';
            if (carga.armador === 'msc') color = 'rgba(214,195,127,0.9)';
            if (carga.armador === 'hapag') color = 'rgba(234,88,12,0.9)';
            if (carga.armador === 'evergreen') color = 'rgba(6,95,50,0.8)';
            if (carga.armador === 'cma') color = 'rgba(15,33,66,0.8)';
        }
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
    const bridgeL = isCarreta || tr.tipo === 'reta' ? 0 : getPranchaAxleArea(tr).length + 0.8;
    let maxCargaH = 0;
    const loadSequence = getLoadSequenceMetrics(tr, isCarreta);
    loadSequence.loads.forEach(({ grid, stackBaseHeight }) => {
        maxCargaH = Math.max(maxCargaH, stackBaseHeight + grid.maxStackHeight);
    });
    
    const isRigid = tr.tipo === 'caminhao';
    const trailerSpan = isCarreta
        ? tr.mesa
        : tr.pescoco + getDeckTransitionLength(tr) + tr.mesa + bridgeL;
    const wTotal = cTractor + trailerSpan + 2;
    const hTotal = Math.max(5.0, (isRigid ? tr.h : (tr.tipo === 'reta' || isCarreta ? 1.6 : Math.max(1.6, tr.h))) + maxCargaH + 2); 

    const scale = Math.min((canvas.width - 20) / wTotal, (canvas.height - 20) / hTotal);
    const groundY = canvas.height - 15;
    const startX = 20 + trailerSpan * scale;
    
    const drawWheel = (cx, rFac=1) => {
        const r = 0.5 * scale * rFac;
        ctx.beginPath(); ctx.arc(cx, groundY - r, r, 0, Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
    };

    if (isRigid) {
        const cabL = tr.cabL * scale;
        const cabH = tr.cabH * scale;
        const wheelFactor = tr.wheelR / 0.5;
        ctx.fillStyle = '#475569';
        ctx.fillRect(startX, groundY - 0.9*scale, cabL, 0.3*scale);
        ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.rect(startX, groundY - cabH, cabL, cabH - 0.9*scale); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.fillRect(startX + cabL*0.45, groundY - cabH + 0.25*scale, cabL*0.5, (cabH - 0.9*scale)*0.38);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(startX + cabL*0.1, groundY - cabH + 0.45*scale, cabL*0.25, 0.25*scale);
        drawWheel(startX + cabL*0.55, wheelFactor);
    } else {
        ctx.fillStyle = '#0284c7'; 
        ctx.fillRect(startX + 3*scale, groundY - (2.5*scale), 1.5*scale, 1.5*scale);
        ctx.fillRect(startX + 1*scale, groundY - (3.5*scale), 2*scale, 2.5*scale);
        drawWheel(startX + 3.5*scale); drawWheel(startX); drawWheel(startX - 1.2*scale);
    }

    const pL = isCarreta ? 0 : tr.pescoco * scale;
    const pH = (isRigid ? tr.h : 1.6) * scale; 
    const hT = tr.h * scale; 
    const mL = tr.mesa * scale;

    ctx.fillStyle = '#475569';
    if (isCarreta) {
        ctx.fillRect(startX - mL, groundY - pH, mL, 0.3*scale);
        if (isRigid) {
            for (let i=0; i<tr.rearAxles; i++) drawWheel(startX - mL + (1 + i*1.3)*scale, tr.wheelR / 0.5);
        } else {
            const axleLayout = getCarretaAxleLayout(tr);
            const startAxleX = startX - mL + axleLayout.firstFromRear*scale;
            for (let i=0; i<tr.eixos; i++) drawWheel(startAxleX + (i*axleLayout.spacing*scale));
        }
    } else {
        ctx.fillRect(startX - pL, groundY - pH, pL, 0.3*scale); 
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(startX - pL/2 - 0.48*scale, groundY - pH - 0.3*scale, 0.96*scale, 0.3*scale);
        const supportX = startX - pL + 0.48*scale;
        ctx.fillRect(supportX - 0.12*scale, groundY - pH + 0.1*scale, 0.24*scale, pH - 0.86*scale);
        ctx.fillRect(supportX - 0.08*scale, groundY - 0.86*scale, 0.16*scale, 0.52*scale);
        ctx.fillRect(supportX - 0.22*scale, groundY - 0.42*scale, 0.44*scale, 0.14*scale);
        ctx.fillStyle = '#475569';
        if (tr.tipo === 'reta') {
            ctx.fillRect(startX - pL - mL, groundY - pH, mL, 0.3*scale);
            for (let i=0; i<tr.eixos; i++) drawWheel(startX - pL - mL + 1*scale + (i*1.1*scale));
        } else {
            const dropL = getDeckTransitionLength(tr) * scale;
            ctx.beginPath(); ctx.moveTo(startX - pL, groundY - pH); ctx.lineTo(startX - pL - dropL, groundY - hT);
            ctx.lineTo(startX - pL - dropL, groundY - hT + 0.3*scale); ctx.lineTo(startX - pL, groundY - pH + 0.3*scale); ctx.fill();
            ctx.fillRect(startX - pL - dropL - mL, groundY - hT, mL, 0.3*scale); 
            const axleArea = getPranchaAxleArea(tr);
            const rearX = startX - pL - dropL - mL - bridgeL*scale;
            ctx.beginPath();
            ctx.moveTo(startX - pL - dropL - mL, groundY - hT);
            ctx.lineTo(startX - pL - dropL - mL - 0.8*scale, groundY - (tr.h + 0.2)*scale);
            ctx.lineTo(startX - pL - dropL - mL - 0.8*scale, groundY - (tr.h + 0.2)*scale + 0.3*scale);
            ctx.lineTo(startX - pL - dropL - mL, groundY - hT + 0.3*scale);
            ctx.fill();
            ctx.fillRect(rearX, groundY - axleArea.height*scale, axleArea.length*scale, 0.3*scale);
            for (let i=0; i<tr.eixos; i++) drawWheel(rearX + (0.55 + i*Math.min(1.18, bridgeL/Math.max(1,tr.eixos)))*scale);
        }
    }

    let loadFrontX = startX;
    if (!isCarreta) {
        loadFrontX -= pL + getDeckTransitionLength(tr)*scale;
        if (pos === 'eixos') loadFrontX -= getPranchaAxleArea(tr).start*scale;
    }

    if (tr.tipo === 'sider') ctx.globalAlpha = 0.5;
    
    loadSequence.loads.forEach(({ carga, grid, startOffset, mesaStartOffset, eixoStartOffset, splitCoils, stackBaseHeight }) => {
        const cL = carga.comp * scale;
        const cH = carga.alt * scale;
        if (splitCoils) {
            const coilLength = cL/2;
            const mesaOffset = mesaStartOffset;
            const mesaFrontX = startX-pL-getDeckTransitionLength(tr)*scale-mesaOffset*scale;
            const eixoFrontX = startX-pL-getDeckTransitionLength(tr)*scale-(getPranchaAxleArea(tr).start+eixoStartOffset)*scale;
            const eixoBaseY = groundY-getPranchaAxleArea(tr).height*scale-stackBaseHeight*scale;
            const mesaBaseY = groundY-(tr.tipo==='reta'?pH:hT)-stackBaseHeight*scale;

            for (let i=0;i<grid.pecasNaBase;i++){
                const r=Math.floor(i/grid.maxCols);
                const rowOffset=r*(coilLength+grid.gap*scale);
                const stackHeight = cH * getStackCount(carga, i, grid.camadas);
                drawCargoRect(ctx,eixoFrontX-coilLength-rowOffset,eixoBaseY-stackHeight,coilLength,stackHeight,carga);
                drawCargoRect(ctx,mesaFrontX-coilLength-rowOffset,mesaBaseY-stackHeight,coilLength,stackHeight,carga);
            }
            return;
        }

        const baseY = (!isCarreta && pos === 'eixos' ? groundY - getPranchaAxleArea(tr).height*scale :
            (tr.tipo === 'reta' || isCarreta ? groundY - pH : groundY - hT)) -
            stackBaseHeight * scale;
        const currentX = loadFrontX-startOffset*scale;
        
        for (let r = 0; r < grid.rows; r++) {
            const itemX = currentX - cL - r * (carga.comp + grid.gap) * scale;
            const firstBaseIndex = r * grid.maxCols;
            const rowStackHeight = cH * getStackCount(carga, firstBaseIndex, grid.camadas);
            drawCargoRect(ctx, itemX, baseY - rowStackHeight, cL, rowStackHeight, carga);
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

    let maxW = 0;
    const loadSequence = getLoadSequenceMetrics(tr, isCarreta);
    let maxLoadHeight = 0;
    loadSequence.loads.forEach(({ grid, stackBaseHeight }) => {
        maxW = Math.max(maxW, grid.totalLarg);
        maxLoadHeight = Math.max(maxLoadHeight, stackBaseHeight + grid.maxStackHeight);
    });

    const rearDeckHeight = tr.tipo === 'caminhao'
        ? tr.h
        : (!isCarreta && pos === 'eixos' ? getPranchaAxleArea(tr).height :
            (tr.tipo === 'reta' || isCarreta ? 1.6 : tr.h));
    const wTotal = Math.max(tr.w, maxW) + 2; 
    const hTotal = Math.max(4.5, rearDeckHeight + (tr.tipo==='sider'?2.8: maxLoadHeight) + 1);
    const scale = Math.min((canvas.width - 20) / wTotal, (canvas.height - 20) / hTotal);
    const groundY = canvas.height - 15;
    const centerX = canvas.width / 2;

    const tW = tr.w * scale;
    const tH = rearDeckHeight * scale;
    
    ctx.fillStyle = '#475569';
    ctx.fillRect(centerX - tW/2, groundY - tH, tW, 0.4*scale);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(centerX - tW/2 + 0.1*scale, groundY - 1.0*scale, 0.6*scale, 1.0*scale);
    ctx.fillRect(centerX + tW/2 - 0.7*scale, groundY - 1.0*scale, 0.6*scale, 1.0*scale);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(centerX-tW*0.46,groundY-0.68*scale,tW*0.92,0.2*scale);
    const reflectorWidth=tW*0.92/12;
    for (let i=0;i<12;i++){
        ctx.fillStyle=i%2===0?'#dc2626':'#f8fafc';
        ctx.fillRect(centerX-tW*0.46+i*reflectorWidth,groundY-0.66*scale,reflectorWidth,0.14*scale);
    }

    loadSequence.loads.forEach(({ carga, grid, stackBaseHeight }) => {
        const cW = carga.larg * scale;
        const firstRowItems = Math.min(grid.maxCols, grid.pecasNaBase);
        const rowW_Scale = firstRowItems * cW + Math.max(0, firstRowItems - 1) * grid.gap * scale;
        const startX_row = centerX + grid.centerX * scale - rowW_Scale / 2;

        for (let c = 0; c < firstRowItems; c++) {
            const itemX = startX_row + c * (cW + grid.gap * scale);
            const stackHeight = carga.alt * getStackCount(carga, c, grid.camadas) * scale;
            drawCargoRect(
                ctx,
                itemX,
                groundY - tH - (stackBaseHeight * scale) - stackHeight,
                cW,
                stackHeight,
                carga
            );
        }
    });

    const limitW = usesSideGates(tr, isCarreta) ? tr.w_util : tr.w;
    if (maxW > limitW) {
        const excW = limitW * scale;
        const cW_max = maxW * scale;
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px Arial';
        ctx.beginPath(); ctx.moveTo(centerX - cW_max/2, groundY - tH - 10); ctx.lineTo(centerX - excW/2, groundY - tH - 10); ctx.stroke();
        ctx.fillText('Exc', centerX - cW_max/2 + 2, groundY - tH - 15);
        ctx.beginPath(); ctx.moveTo(centerX + excW/2, groundY - tH - 10); ctx.lineTo(centerX + cW_max/2, groundY - tH - 10); ctx.stroke();
    }
}

function resizeMainView() {
    const container = document.getElementById('three-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (camera && renderer && width && height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        if (trailerGroup && loadGroup) draw2D(currentTrailer, inputs.posicao.value, isMesaOnlyVehicle(currentTrailer));
    }
}
window.addEventListener('resize', resizeMainView);

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
    if (CONTAINER_LOAD_TYPES.has(val) && !UNBRANDED_CONTAINER_TYPES.has(val)) {
        divArmador.classList.remove('hidden');
    } else {
        divArmador.classList.add('hidden');
        inputArmador.value = 'generico';
    }

    const loadType = LOAD_TYPES.find(type => type.value === val);
    if (loadType) {
        const preset = loadType.preset;
        [inputs.cComp, inputs.cLarg, inputs.cAlt].forEach((el,i) => el.value = preset[i]);
        inputs.cPeso.value = weightForInput(preset[3], inputs.cPesoUnit.value);
    }
});

els.btnReset.addEventListener('click', () => {
    composicaoCargas = [];
    inputs.cCamadas.value = '1';
    inputs.cSobreAnterior.checked = false;
    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
    inputs.placa_carreta.value = ""; inputs.placa_caminhao.value = ""; inputs.placa_prancha.value = "prancha_reb_6_3";
    setVehicleSelectorTab('prancha');
    updateTrailerInfo();
});

function setCargaTab(tab) {
    const isTubes = tab === 'tubos';
    if (tab !== activeCargaTab && editingCargaIndex !== null) cancelarEdicaoCarga();
    if (isTubes && !cargoTrailerSelectionBeforeTubes) {
        cargoTrailerSelectionBeforeTubes = {
            prancha: inputs.placa_prancha.value,
            carreta: inputs.placa_carreta.value,
            caminhao: inputs.placa_caminhao.value,
            motorista: document.getElementById('input_motorista').value,
            vehicleTab: document.querySelector('[data-vehicle-tab][aria-selected="true"]')?.dataset.vehicleTab
        };
        if (!TUBE_TRAILER_IDS.has(getActiveTrailerId())) {
            inputs.placa_prancha.value = "";
            inputs.placa_caminhao.value = "";
            inputs.placa_carreta.value = "carreta_padrao";
        }
    } else if (!isTubes && cargoTrailerSelectionBeforeTubes) {
        inputs.placa_prancha.value = cargoTrailerSelectionBeforeTubes.prancha;
        inputs.placa_carreta.value = cargoTrailerSelectionBeforeTubes.carreta;
        inputs.placa_caminhao.value = cargoTrailerSelectionBeforeTubes.caminhao || '';
        setVehicleSelectorTab(cargoTrailerSelectionBeforeTubes.vehicleTab ||
            (cargoTrailerSelectionBeforeTubes.carreta ? 'carreta' : 'prancha'));
        cargoTrailerSelectionBeforeTubes = null;
    }
    activeCargaTab = tab;
    const tabCargas = document.getElementById('tab_cargas');
    const tabGerais = document.getElementById('tab_gerais');
    const tabTubos = document.getElementById('tab_tubos');
    const panelCargas = document.getElementById('panel_cargas');
    const panelGerais = document.getElementById('panel_gerais');
    const panelTubos = document.getElementById('panel_tubos');
    const tabClass = 'load-tab load-tab-active';
    const inactiveClass = 'load-tab';

    tabCargas.className = tab === 'cargas' ? tabClass : inactiveClass;
    tabGerais.className = tab === 'gerais' ? tabClass : inactiveClass;
    tabTubos.className = isTubes ? tabClass : inactiveClass;
    tabCargas.setAttribute('aria-selected', String(tab === 'cargas'));
    tabGerais.setAttribute('aria-selected', String(tab === 'gerais'));
    tabTubos.setAttribute('aria-selected', String(isTubes));
    panelCargas.classList.toggle('hidden', tab !== 'cargas');
    panelGerais.classList.toggle('hidden', tab !== 'gerais');
    panelTubos.classList.toggle('hidden', !isTubes);
    document.getElementById('cargo_actions').classList.toggle('hidden', isTubes);
    els.btnAdicionar.classList.toggle('hidden', tab !== 'cargas');
    generalCargo.add.classList.toggle('hidden', tab !== 'gerais');
    document.getElementById('composition_panel').classList.toggle('hidden', isTubes);
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
document.getElementById('tab_gerais').addEventListener('click', () => setCargaTab('gerais'));
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

function setSupabaseStatus(message, isError = false) {
    const status = document.getElementById('supabase_status');
    status.textContent = message;
    status.className = isError ? 'text-xs text-red-700' : 'sr-only';
}

function setAccountControlsVisible(isSignedIn) {
    document.getElementById('auth_form').classList.toggle('hidden', isSignedIn);
    const accountActions = document.getElementById('account_actions');
    accountActions.classList.toggle('hidden', !isSignedIn);
    accountActions.classList.toggle('flex', isSignedIn);
    const email = authenticatedUser?.email || '';
    const initials = email.split('@')[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';
    document.getElementById('account_initials').textContent = initials;
    document.getElementById('account_initials').title = isSignedIn ? 'Conta conectada' : '';
}

function setAuthBusy(isBusy) {
    document.getElementById('auth_login').disabled = isBusy;
    document.getElementById('auth_signup').disabled = isBusy;
}

function renderSavedPlans(plans) {
    const select = document.getElementById('saved_plans');
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = plans.length ? 'Selecione um planejamento' : 'Nenhum planejamento salvo';
    select.appendChild(placeholder);

    plans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id;
        option.textContent = plan.name;
        select.appendChild(option);
    });

    select.value = activePlanId || '';
    document.getElementById('plan_load').disabled = !select.value;
    document.getElementById('plan_delete').disabled = !select.value;
}

async function refreshSavedPlans() {
    if (!supabaseClient || !authenticatedUser) return;

    const { data, error } = await supabaseClient
        .from('saved_plans')
        .select('id, name, updated_at')
        .order('updated_at', { ascending: false });
    if (error) throw error;

    if (activePlanId && !data.some(plan => plan.id === activePlanId)) {
        activePlanId = null;
    }
    renderSavedPlans(data);
}

function capturePlanState() {
    return {
        version: 1,
        activeTab: activeCargaTab,
        vehicleTab: document.querySelector('[data-vehicle-tab][aria-selected="true"]')?.dataset.vehicleTab || 'prancha',
        trailer: {
            cavalinho: inputs.cavalinho.value,
            prancha: inputs.placa_prancha.value,
            carreta: inputs.placa_carreta.value,
            caminhao: inputs.placa_caminhao.value,
            motorista: document.getElementById('input_motorista').value,
            posicao: inputs.posicao.value,
            tampas: inputs.tampas.value
        },
        cargo: {
            items: composicaoCargas.map(item => ({ ...item })),
            type: tipoCargaSelect.value,
            armador: inputArmador.value,
            comp: inputs.cComp.value,
            larg: inputs.cLarg.value,
            alt: inputs.cAlt.value,
            peso: inputs.cPeso.value,
            pesoUnit: inputs.cPesoUnit.value,
            qtd: inputs.cQtd.value,
            camadas: inputs.cCamadas.value,
            colocarSobreAnterior: inputs.cSobreAnterior.checked
        },
        generalCargo: {
            type: generalCargo.model.value,
            comp: generalCargo.comp.value,
            larg: generalCargo.larg.value,
            alt: generalCargo.alt.value,
            peso: generalCargo.peso.value,
            pesoUnit: generalCargo.pesoUnit.value,
            qtd: generalCargo.qtd.value,
            camadas: generalCargo.camadas.value,
            colocarSobreAnterior: generalCargo.stack.checked
        },
        tubes: Object.fromEntries(
            Object.entries(tubeInputs).map(([key, input]) => [key, input.value])
        ),
        tubeStrappingEnabled,
        cargoTrailerSelectionBeforeTubes: cargoTrailerSelectionBeforeTubes
            ? { ...cargoTrailerSelectionBeforeTubes }
            : null
    };
}

function validatePlanState(state) {
    if (!state || state.version !== 1 || !['cargas', 'gerais', 'tubos'].includes(state.activeTab)) {
        throw new Error('Este planejamento tem um formato inválido ou incompatível.');
    }
    if (!state.trailer || !state.cargo || !Array.isArray(state.cargo.items) || !state.tubes) {
        throw new Error('Este planejamento está incompleto ou inválido.');
    }
    if (state.cargo.items.length > 500 || !LOAD_TYPES.some(type => type.value === state.cargo.type)) {
        throw new Error('Este planejamento contém dados inválidos.');
    }
    if (state.generalCargo?.type && !generalCargoByType.has(state.generalCargo.type)) {
        throw new Error('Este planejamento contém um modelo de carga desconhecido.');
    }
    if ([state.cargo.pesoUnit, state.generalCargo?.pesoUnit].some(unit => unit !== undefined && !['kg', 't'].includes(unit))) {
        throw new Error('Este planejamento contém uma unidade de peso inválida.');
    }
    const validVehicleTabs = ['cavalinho', 'prancha', 'carreta', 'caminhao'];
    if (!validVehicleTabs.includes(state.vehicleTab) ||
        !CAB_MODELS[state.trailer.cavalinho] ||
        (state.trailer.prancha && !bdVeiculos[state.trailer.prancha]) ||
        (state.trailer.carreta && !bdVeiculos[state.trailer.carreta]) ||
        (state.trailer.caminhao && bdVeiculos[state.trailer.caminhao]?.tipo !== 'caminhao') ||
        !['mesa', 'eixos', 'pescoco'].includes(state.trailer.posicao) ||
        !['com', 'sem'].includes(state.trailer.tampas)) {
        throw new Error('Este planejamento contém um veículo inválido.');
    }
    const validItems = state.cargo.items.every(item =>
        item && (generalCargoByType.has(item.type) || LOAD_TYPES.some(type => type.value === item.type)) &&
        Number.isFinite(item.comp) && item.comp > 0 &&
        Number.isFinite(item.larg) && item.larg > 0 &&
        Number.isFinite(item.alt) && item.alt > 0 &&
        Number.isFinite(item.peso) && item.peso >= 0 &&
        Number.isInteger(item.qtd) && item.qtd > 0 &&
        (item.camadas === undefined || (Number.isInteger(item.camadas) && item.camadas > 0)) &&
        (item.colocarSobreAnterior === undefined || typeof item.colocarSobreAnterior === 'boolean') &&
        (item.lashing === undefined || validLashing(item.lashing) || validLegacyLashing(item.lashing))
    );
    if (!validItems) throw new Error('Este planejamento contém cargas inválidas.');
}

function restorePlanState(state) {
    validatePlanState(state);

    activeCargaTab = 'cargas';
    cargoTrailerSelectionBeforeTubes = null;
    composicaoCargas = state.cargo.items.map(item => ({
        ...item,
        camadas: item.camadas || 1,
        colocarSobreAnterior: item.colocarSobreAnterior === true
    }));

    inputs.cavalinho.value = state.trailer.cavalinho;
    inputs.placa_prancha.value = state.trailer.prancha || '';
    inputs.placa_carreta.value = state.trailer.carreta || '';
    inputs.placa_caminhao.value = state.trailer.caminhao || '';
    document.getElementById('input_motorista').value = state.trailer.motorista ?? 'motorista_1';
    setVehicleSelectorTab(state.vehicleTab);
    if (state.activeTab === 'tubos' && state.cargoTrailerSelectionBeforeTubes) {
        cargoTrailerSelectionBeforeTubes = { ...state.cargoTrailerSelectionBeforeTubes };
    }
    setCargaTab(state.activeTab);

    tipoCargaSelect.value = state.cargo.type;
    inputArmador.value = state.cargo.armador || 'generico';
    inputs.cComp.value = state.cargo.comp;
    inputs.cLarg.value = state.cargo.larg;
    inputs.cAlt.value = state.cargo.alt;
    const restoreWeight = (input, unit, value, savedUnit) => {
        unit.value = savedUnit || 'kg';
        unit.dataset.previousUnit = unit.value;
        input.value = value === undefined || value === null || value === ''
            ? ''
            : weightForInput(weightInTonnes(value, savedUnit || 't'), unit.value);
    };
    restoreWeight(inputs.cPeso, inputs.cPesoUnit, state.cargo.peso, state.cargo.pesoUnit);
    inputs.cQtd.value = state.cargo.qtd;
    inputs.cCamadas.value = state.cargo.camadas || '1';
    inputs.cSobreAnterior.checked = state.cargo.colocarSobreAnterior === true;
    generalCargo.model.value = state.generalCargo?.type || '';
    generalCargo.comp.value = state.generalCargo?.comp || '';
    generalCargo.larg.value = state.generalCargo?.larg || '';
    generalCargo.alt.value = state.generalCargo?.alt || '';
    restoreWeight(generalCargo.peso, generalCargo.pesoUnit, state.generalCargo?.peso, state.generalCargo?.pesoUnit);
    generalCargo.qtd.value = state.generalCargo?.qtd || '1';
    generalCargo.camadas.value = state.generalCargo?.camadas || '1';
    generalCargo.stack.checked = state.generalCargo?.colocarSobreAnterior === true;
    divArmador.classList.toggle(
        'hidden',
        !CONTAINER_LOAD_TYPES.has(state.cargo.type) || UNBRANDED_CONTAINER_TYPES.has(state.cargo.type)
    );

    Object.entries(tubeInputs).forEach(([key, input]) => {
        if (typeof state.tubes[key] === 'string' || typeof state.tubes[key] === 'number') {
            input.value = String(state.tubes[key]);
        }
    });
    inputs.posicao.value = state.trailer.posicao === 'pescoco' ? 'eixos' : state.trailer.posicao;
    if (isMesaOnlyVehicle(currentTrailer)) inputs.posicao.value = 'mesa';
    inputs.tampas.value = state.trailer.tampas;
    tubeStrappingEnabled = state.tubeStrappingEnabled !== false;
    document.getElementById('tube_strapping_on').className = tubeStrappingEnabled
        ? 'load-tab load-tab-active'
        : 'load-tab';
    document.getElementById('tube_strapping_off').className = tubeStrappingEnabled
        ? 'load-tab'
        : 'load-tab load-tab-active';
    document.getElementById('tube_strapping_on').setAttribute('aria-pressed', String(tubeStrappingEnabled));
    document.getElementById('tube_strapping_off').setAttribute('aria-pressed', String(!tubeStrappingEnabled));

    editingCargaIndex = null;
    atualizarBotaoCarga();
    renderListaCargas();
    analyzeAndDraw();
}

async function initializeSupabaseCloud() {
    if (!window.supabase?.createClient) {
        setSupabaseStatus('Não foi possível carregar o cliente Supabase. Verifique a conexão e recarregue a página.', true);
        return;
    }

    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    } catch (error) {
        setSupabaseStatus(`Não foi possível iniciar o Supabase: ${error.message}`, true);
        return;
    }
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        authenticatedUser = session?.user || null;
        setAccountControlsVisible(Boolean(authenticatedUser));
        if (authenticatedUser) {
            setSupabaseStatus('Conta conectada. Seus planejamentos são privados.');
            window.setTimeout(() => {
                refreshSavedPlans().catch(error => {
                    setSupabaseStatus(`Não foi possível listar os planejamentos: ${error.message}`, true);
                });
            }, 0);
        } else {
            activePlanId = null;
            renderSavedPlans([]);
            setSupabaseStatus('Entre ou crie uma conta para salvar seus planejamentos na nuvem.');
        }
    });

    let session;
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        session = data.session;
    } catch (error) {
        setSupabaseStatus(`Não foi possível verificar a sessão: ${error.message}`, true);
        return;
    }

    await appReady;
    authenticatedUser = session?.user || null;
    setAccountControlsVisible(Boolean(authenticatedUser));
    if (authenticatedUser) {
        setSupabaseStatus('Conta conectada. Seus planejamentos são privados.');
        try {
            await refreshSavedPlans();
        } catch (refreshError) {
            setSupabaseStatus(`Não foi possível listar os planejamentos: ${refreshError.message}`, true);
        }
    } else {
        renderSavedPlans([]);
        setSupabaseStatus('Entre ou crie uma conta para salvar seus planejamentos na nuvem.');
    }
}

document.getElementById('auth_form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!supabaseClient) {
        setSupabaseStatus('O Supabase ainda não está disponível. Recarregue a página e tente novamente.', true);
        return;
    }

    setAuthBusy(true);
    const email = document.getElementById('auth_email').value.trim();
    const password = document.getElementById('auth_password').value;
    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSupabaseStatus('Login realizado com sucesso.');
    } catch (error) {
        setSupabaseStatus(`Não foi possível entrar: ${error.message}`, true);
    } finally {
        setAuthBusy(false);
    }
});

document.getElementById('auth_signup').addEventListener('click', async () => {
    if (!supabaseClient) {
        setSupabaseStatus('O Supabase ainda não está disponível. Recarregue a página e tente novamente.', true);
        return;
    }

    const form = document.getElementById('auth_form');
    if (!form.reportValidity()) return;
    setAuthBusy(true);
    const email = document.getElementById('auth_email').value.trim();
    const password = document.getElementById('auth_password').value;
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.href }
        });
        if (error) throw error;
        setSupabaseStatus(data.session
            ? 'Conta criada e conectada.'
            : 'Conta criada. Confirme seu e-mail para concluir o acesso.');
    } catch (error) {
        setSupabaseStatus(`Não foi possível criar a conta: ${error.message}`, true);
    } finally {
        setAuthBusy(false);
    }
});

document.getElementById('auth_logout').addEventListener('click', async () => {
    if (!supabaseClient) return;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    } catch (error) {
        setSupabaseStatus(`Não foi possível sair da conta: ${error.message}`, true);
    }
});

document.getElementById('saved_plans').addEventListener('change', event => {
    activePlanId = event.target.value || null;
    document.getElementById('plan_load').disabled = !activePlanId;
    document.getElementById('plan_delete').disabled = !activePlanId;
});

document.getElementById('plan_new').addEventListener('click', () => {
    activePlanId = null;
    document.getElementById('saved_plans').value = '';
    document.getElementById('plan_name').value = '';
    document.getElementById('plan_load').disabled = true;
    document.getElementById('plan_delete').disabled = true;
    setSupabaseStatus('Novo planejamento. Salve para armazená-lo na sua conta.');
});

document.getElementById('plan_save').addEventListener('click', async () => {
    if (!supabaseClient || !authenticatedUser) {
        setSupabaseStatus('Entre na sua conta antes de salvar um planejamento.', true);
        return;
    }

    const name = document.getElementById('plan_name').value.trim();
    if (!name || name.length > 100) {
        setSupabaseStatus('Informe um nome de até 100 caracteres para o planejamento.', true);
        return;
    }

    const payload = {
        name,
        data: capturePlanState(),
        updated_at: new Date().toISOString()
    };
    const button = document.getElementById('plan_save');
    button.disabled = true;
    try {
        const request = activePlanId
            ? supabaseClient.from('saved_plans').update(payload)
                .eq('id', activePlanId).eq('user_id', authenticatedUser.id)
            : supabaseClient.from('saved_plans').insert({
                ...payload,
                user_id: authenticatedUser.id
            });
        const { data, error } = await request.select('id').single();
        if (error) throw error;
        activePlanId = data.id;
        await refreshSavedPlans();
        setSupabaseStatus('Planejamento salvo com segurança na sua conta.');
    } catch (error) {
        setSupabaseStatus(`Não foi possível salvar. Verifique se a migração SQL foi aplicada: ${error.message}`, true);
    } finally {
        button.disabled = false;
    }
});

document.getElementById('plan_load').addEventListener('click', async () => {
    if (!supabaseClient || !authenticatedUser || !activePlanId) return;
    try {
        const { data, error } = await supabaseClient
            .from('saved_plans')
            .select('id, name, data')
            .eq('id', activePlanId)
            .single();
        if (error) throw error;
        restorePlanState(data.data);
        document.getElementById('plan_name').value = data.name;
        const migrationNotice = data.data.trailer.posicao === 'pescoco'
            ? ' A antiga posição no pescoço foi alterada para os eixos; revise a distribuição e o transbordo.'
            : '';
        setSupabaseStatus(`Planejamento "${data.name}" carregado.${migrationNotice}`);
    } catch (error) {
        setSupabaseStatus(`Não foi possível carregar o planejamento: ${error.message}`, true);
    }
});

document.getElementById('plan_delete').addEventListener('click', async () => {
    if (!supabaseClient || !authenticatedUser || !activePlanId) return;
    const selectedPlan = document.getElementById('saved_plans').selectedOptions[0]?.textContent;
    if (!window.confirm(`Excluir o planejamento "${selectedPlan}"? Esta ação não pode ser desfeita.`)) return;
    try {
        const { error } = await supabaseClient
            .from('saved_plans')
            .delete()
            .eq('id', activePlanId)
            .eq('user_id', authenticatedUser.id);
        if (error) throw error;
        activePlanId = null;
        document.getElementById('plan_name').value = '';
        await refreshSavedPlans();
        setSupabaseStatus('Planejamento excluído.');
    } catch (error) {
        setSupabaseStatus(`Não foi possível excluir o planejamento: ${error.message}`, true);
    }
});

loadCabModel('scania_s_730').catch(error => {
    console.error('Erro ao pré-carregar o cavalinho Scania:', error);
});
loadTrailerChassis().catch(error => {
    console.error('Erro ao pré-carregar o chassi da carreta:', error);
});

window.addEventListener('load', () => {
    inputs.cavalinho.value = 'scania_s_730';
    initThreeJS();
    updateTrailerInfo();
    renderListaCargas();
    appReadyResolve();
});

initializeSupabaseCloud();