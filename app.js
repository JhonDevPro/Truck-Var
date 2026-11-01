// --- Banco de Dados Integrado (Pranchas + Carretas) ---
const bdVeiculos = {
    "prancha_reb_6_3": { tipo: "rebaixada", w: 3.00, h: 1.10, pescoco: 3.50, mesa: 6.30, compTotal: 14.50, eixos: 3, cap: 45 },
    "prancha_reb_7_0": { tipo: "rebaixada", w: 3.00, h: 0.70, pescoco: 3.80, mesa: 7.00, compTotal: 16.70, eixos: 3, cap: 45 },
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
        url: './scania_S-730.glb',
        uniformScale: 3.0,
        rotationY: 0,
        alignToGround: true,
        offsetZ: -2.6, // <-- ADICIONE ESTA LINHA (teste valores positivos ou negativos para ajustar)
        bodyColor: 0xf2f2f0,
        grayMeshNames: ['Object_56', 'Object_58', 'Object_83', 'Object_125']
    }
};

const cabModelPromises = new Map();
const cabTexturePaletteCache = new WeakMap();
const cabBrightTextureCache = new WeakMap();
const cabGrayTextureCache = new WeakMap();

// --- ESTADO GLOBAL DA COMPOSIÇÃO DE CARGAS ---
let composicaoCargas = [];
let editingCargaIndex = null;

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
    { value: 'container_mae_aberto', label: 'Coração de Mãe (Aberto)', preset: [4, 4, 4, 12] },
    { value: 'container_20', label: 'Container 20 pés', preset: [6.06, 2.44, 2.59, 4] },
    { value: 'container_40', label: 'Container 40 pés', preset: [12.19, 2.44, 2.59, 8] },
    { value: 'container_10', label: 'Container 10 pés', preset: [3.05, 2.44, 2.59, 2] },
    { value: 'container_baby', label: 'Container baby', preset: [2.5, 2.2, 2.2, 1.5] },
    { value: 'tanque', label: 'Tanque em grade', preset: [3.05, 2.44, 2.59, 3.5] },
    { value: 'tubulacao', label: 'Tubulações', preset: [8, 2.4, 2, 8] },
    { value: 'vaso', label: 'Vaso de pressão', preset: [4, 2.8, 3.5, 10] },
    { value: 'gerador', label: 'Gerador', preset: [4.5, 2.6, 2.7, 8] },
    { value: 'cesta', label: 'Cesta offshore', preset: [4, 2.4, 2.5, 5] },
    { value: 'estrutura', label: 'Estrutura metálica', preset: [7, 3, 2.8, 9] }
];

const CONTAINER_LOAD_TYPES = new Set(['container_mae', 'container_20', 'container_40', 'container_10', 'container_baby']);

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
    badgeQtd: document.getElementById('badge_qtd_cargas')
};

const ctxSide = els.sideCanvas.getContext('2d');
const ctxRear = els.rearCanvas.getContext('2d');

let scene, camera, renderer, controls, trailerGroup, loadGroup;
let currentTrailer = bdVeiculos["prancha_reb_6_3"];
const GAP = 0.02; 
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
            : new Promise((resolve, reject) => {
                new THREE.GLTFLoader().load(model.url, gltf => resolve(gltf.scene), undefined, reject);
            });
        cabModelPromises.set(modelId, promise);
    }
    return cabModelPromises.get(modelId);
}

function loadTrailerChassis() {
    if (!trailerChassisPromise) {
        const loader = new THREE.GLTFLoader();
        trailerChassisPromise = new Promise((resolve, reject) => {
            loader.load('./chassi-para-carreta-14-15.glb', gltf => resolve(gltf.scene), undefined, reject);
        });
    }
    return trailerChassisPromise;
}

function getActiveTrailerId() {
    if (inputs.placa_prancha.value) return inputs.placa_prancha.value;
    if (inputs.placa_carreta.value) return inputs.placa_carreta.value;
    return "prancha_reb_6_3"; 
}

inputs.cavalinho.addEventListener('change', analyzeAndDraw);
inputs.placa_prancha.addEventListener('change', () => {
    if(inputs.placa_prancha.value) inputs.placa_carreta.value = "";
    updateTrailerInfo();
});
inputs.placa_carreta.addEventListener('change', () => {
    if(inputs.placa_carreta.value) inputs.placa_prancha.value = "";
    updateTrailerInfo();
});

// Calcula o espaço que o grid de um bloco de cargas vai ocupar (fileiras e colunas)
function getGridMetrics(tr, cComp, cLarg, cQtd, isCarreta) {
    const usesGates = isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
    const availableWidth = usesGates ? tr.w_util : tr.w;
    
    let maxCols = Math.floor((availableWidth + GAP) / (cLarg + GAP));
    if (maxCols < 1) maxCols = 1; 
    
    const rows = Math.ceil(cQtd / maxCols);
    const totalComp = rows * cComp + Math.max(0, rows - 1) * GAP;
    const maxItemsInRow = Math.min(cQtd, maxCols);
    const totalLarg = maxItemsInRow * cLarg + Math.max(0, maxItemsInRow - 1) * GAP;

    return { maxCols, rows, totalComp, totalLarg, availableWidth };
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
    const placa = getActiveTrailerId();
    if(bdVeiculos[placa]) {
        currentTrailer = bdVeiculos[placa];
        infos.largura.value = currentTrailer.w.toFixed(2);
        infos.altura.value = currentTrailer.h.toFixed(2);
        infos.mesa.value = currentTrailer.mesa.toFixed(2);
        
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

function analyzeAndDraw() {
    const tr = currentTrailer;
    const pos = inputs.posicao.value;
    const isCarreta = tr.tipo.includes('carreta') || tr.tipo === 'vanderleia' || tr.tipo === 'sider';
    const usesGates = isCarreta && inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
    const availableWidth = usesGates ? tr.w_util : tr.w;
    let espacoDisponivel = pos === 'mesa' || isCarreta ? tr.mesa : tr.pescoco;
    if (tr.tipo === 'reta') espacoDisponivel = tr.mesa; 

    // Consolida dados da composição considerando GRIDS de quantidade
    let pesoTotal = 0;
    let totalLargMax = 0;
    let maxAlt = 0;
    let compTotalUsado = 0;

    composicaoCargas.forEach((carga) => {
        // Analisa quanto de espaço este bloco de X cargas ocupará na carreta
        const grid = getGridMetrics(tr, carga.comp, carga.larg, carga.qtd, isCarreta);
        
        pesoTotal += (carga.peso * carga.qtd);
        if (grid.totalLarg > totalLargMax) totalLargMax = grid.totalLarg;
        if (carga.alt > maxAlt) maxAlt = carga.alt;
        compTotalUsado += grid.totalComp + GAP; // Adiciona um GAP entre os blocos
    });
    
    if(composicaoCargas.length > 0) compTotalUsado -= GAP; // Remove o GAP excedente no final

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
    const glass = mat(0x0a0a0a);
    const rubber = mat(0x111111);
    const rim = mat(0x475569);
    const frame = mat(0x0f172a);
    const steel = mat(0x1e293b);
    const wood = mat(0xd4a373);
    const siderMat = matTransp(0x1e293b, 0.88);
    
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

    function drawDeckDetails(width,length,centerZ,topY) {
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
        loadTrailerChassis().then(source => {
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

            if (drawRevision === draw3DRevision) trailerGroup.add(chassis);
        }).catch(error => console.error('Erro ao carregar o chassi da carreta:', error));
    }

    const cabModelId = inputs.cavalinho.value || 'semi_obj';
    loadCabModel(cabModelId).then(source => {
        if (drawRevision !== draw3DRevision) return;

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

        if (drawRevision === draw3DRevision) trailerGroup.add(object);
    }).catch(error => console.error(`Erro ao carregar o cavalinho ${cabModelId}:`, error));

    const deckMat=usesChassisModel ? white : frame;
    const woodMat=wood;

    if (isCarreta) {
        rearStart += shiftZ;
        const deckCenterZ=-mL/2+shiftZ;
        box(wT,.24*S,mL,deckMat,0,deckY-.12*S,deckCenterZ);
        box(wT*.94,.045*S,mL*.96,woodMat,0,deckY+.02*S,deckCenterZ);
        drawDeckDetails(wT,mL,deckCenterZ,deckY+0.045*S);
        const startAxleZ = rearStart + 1.2*S;
        
        if (usesChassisModel) {
            addChassisModel();
            
            if (tr.tipo === 'vanderleia') {
                const axleY = 0.49*S;
                const rW = 0.48*S;
                const axSpacing = 2.4*S;
                
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
            const axSpacing = tr.tipo === 'vanderleia' ? 2.4*S : 1.2*S;
            
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
            box(wT, siderH, mL, siderMat, 0, deckY + siderH/2, -mL/2 + shiftZ);
        } else if (tr.tipo === 'carreta_bau') {
            const bodyH = 2.5*S;
            box(wT * 0.98, bodyH, mL, carretaBauMat, 0, deckY + bodyH/2, -mL/2 + shiftZ);
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
    } else {
        const dropL = tr.tipo==='reta' ? 0 : 1.2*S;
        
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
    let currentZ = (pos === 'pescoco') ? -0.5*S + shiftZ : (isCarreta ? -0.5*S + shiftZ : -pL - (tr.tipo === 'reta' ? 0 : 1.0*S) - 0.5*S + shiftZ);

    composicaoCargas.forEach((carga, index) => {
        const cW = Math.max(.1, carga.larg) * S;
        const cH = Math.max(.1, carga.alt) * S;
        const cL = Math.max(.1, carga.comp) * S;
        
        // Puxamos a matemática do grid para agrupar cargas repetidas
        const grid = getGridMetrics(tr, carga.comp, carga.larg, carga.qtd, isCarreta);
        const loadY = (pos === 'pescoco' || tr.tipo === 'reta' ? pH : (isCarreta ? deckY : hT)) + cH/2;
        const loadZ_start = currentZ;
        
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
            const coilCount = carga.type.endsWith('_2') ? 2 : 1;
            const axis = carga.type.includes('_lado_') ? 'x' : 'z';
            const sectionLength = cL / coilCount;
            const radius = Math.max(0.06*S,Math.min(cH,axis === 'x' ? sectionLength : cW)*0.46);
            const supportThickness = cH*0.08;
            const flangeOuterRadius = radius*1.08+Math.max(0.045*S,radius*0.055);
            const coilCenterY = -cH/2+supportThickness+flangeOuterRadius;
            for(let i=0;i<coilCount;i++){
                const centerZ = -cL/2 + sectionLength*(i+0.5);
                const coilLength = axis === 'x' ? cW*0.78 : sectionLength*0.78;
                drawCoil(axis,radius,coilLength,0,coilCenterY,centerZ);
            }
            cargoBox(cW*0.84,supportThickness,cL*0.92,navy,0,-cH/2+supportThickness/2,0);
        } else if(CONTAINER_LOAD_TYPES.has(carga.type)){
            let contColor = 0x176b87; 
            let logoColor = "#000000";
            
            if (carga.armador === 'maersk') { contColor = 0xe0e5e8; } 
            else if (carga.armador === 'msc') { contColor = 0xd6c37f; logoColor = "#111111"; } 
            else if (carga.armador === 'hapag') { contColor = 0xea580c; logoColor = "#001b3a"; } 
            else if (carga.armador === 'evergreen') { contColor = 0x065f32; logoColor = "#ffffff"; } 
            else if (carga.armador === 'cma') { contColor = 0x0f2142; logoColor = "#ffffff"; }

            const contMat = mat(contColor);
            const ribD = 0.035 * S; 
            cargoBox(cW - 2*ribD, cH, cL, contMat, 0, 0, 0); 
            const ribs=Math.max(8,Math.min(64,Math.floor(cL/.22)));
            const ribMat = mat(contColor); 
            
            for(let i=0;i<=ribs;i++){
                const z=-cL/2+i*cL/ribs;
                [-1,1].forEach(side=>cargoBox(ribD, cH*.94, .035*S, ribMat, side*(cW/2 - ribD/2), 0, z));
            }
            cargoBox(cW*.98,.08*S,cL*.98,navy,0,cH/2,0);
            cargoBox(cW*.98,.08*S,cL*.98,navy,0,-cH/2,0);

            if (carga.armador !== 'generico') {
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
        } else if(carga.type==='container_mae_aberto'){
            buildCage(cageOrange,mat(0xf2a128),true);
            cargoBox(cW*0.78,cH*0.54,cL*0.76,equipmentBeige,0,-cH*0.02,0);
            cargoBox(cW*0.78,0.08*S,cL*0.76,mat(0xd6bd87),0,cH*0.27,0);
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
        for (let i = 0; i < carga.qtd; i++) {
            const r = Math.floor(i / grid.maxCols);
            const c = i % grid.maxCols;
            
            const rowItems = Math.min(grid.maxCols, carga.qtd - r * grid.maxCols);
            const rowW = rowItems * cW + Math.max(0, rowItems - 1) * GAP * S;
            
            const itemX = -rowW / 2 + cW / 2 + c * (cW + GAP * S);
            const itemZ = loadZ_start - cL / 2 - r * (cL + GAP * S);
            
            const inst = baseItem.clone();
            inst.position.set(itemX, loadY, itemZ);
            loadGroup.add(inst);
        }
        
        // Atualiza a posição inicial Z para o PRÓXIMO bloco da composição da lista 
        currentZ -= (grid.totalComp * S + (GAP * S));
    });
    
    // Ajusta a Câmera
    const totalLen = Math.max(10, 4.5*S+(isCarreta?mL:(tr.tipo==='reta'?pL+mL:pL+1.0*S+mL+bridgeL))+4.5*S);
    const compensacaoFrente = 0.5 * S;
    const centerZ = (isCarreta ? -mL/2 + shiftZ : -pL-mL/2 + shiftZ) + compensacaoFrente;
    
    camera.position.set(totalLen*.35, 7*S, centerZ - totalLen*.5);
    controls.target.set(0, 1.0*S, centerZ);
    camera.near=.1; camera.far=totalLen*8;
    camera.updateProjectionMatrix();
    controls.update();
}

function draw2D(tr, pos, isCarreta) {
    drawSide2D(ctxSide, els.sideCanvas, tr, pos, isCarreta);
    drawRear2D(ctxRear, els.rearCanvas, tr, pos, isCarreta);
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
    
    const wTotal = cTractor + (isCarreta ? tr.mesa : tr.pescoco + (tr.tipo === 'reta' ? 0 : 1.0) + tr.mesa + bridgeL) + 2; 
    const hTotal = Math.max(5.0, (tr.tipo === 'reta' || isCarreta ? 1.6 : Math.max(1.6, tr.h)) + maxCargaH + 2); 

    const scale = Math.min((canvas.width - 20) / wTotal, (canvas.height - 20) / hTotal);
    const groundY = canvas.height - 15;
    const startX = 20 + (cTractor * scale); 
    
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
        const axSpacing = tr.tipo === 'vanderleia' ? 2.4*scale : 1.2*scale;
        const startAxleX = startX - mL + 1.5*scale;
        for(let i=0; i<tr.eixos; i++) drawWheel(startAxleX + (i*axSpacing));
    } else {
        ctx.fillRect(startX - pL, groundY - pH, pL, 0.3*scale); 
        if(tr.tipo === 'reta') {
            ctx.fillRect(startX - pL - mL, groundY - pH, mL, 0.3*scale);
            for(let i=0; i<tr.eixos; i++) drawWheel(startX - pL - mL + 1*scale + (i*1.1*scale));
        } else {
            const dropL = 1.0 * scale;
            ctx.beginPath(); ctx.moveTo(startX - pL, groundY - pH); ctx.lineTo(startX - pL - dropL, groundY - hT);
            ctx.lineTo(startX - pL - dropL, groundY - hT + 0.3*scale); ctx.lineTo(startX - pL, groundY - pH + 0.3*scale); ctx.fill();
            ctx.fillRect(startX - pL - dropL - mL, groundY - hT, mL, 0.3*scale); 
            for(let i=0; i<tr.eixos; i++) drawWheel(startX - pL - dropL - mL - 0.5*scale - (i*1.2*scale));
        }
    }

    let cX_start;
    if(isCarreta) {
        cX_start = startX - 0.5*scale;
    } else if(pos === 'pescoco' || tr.tipo === 'reta') {
        cX_start = startX - 0.5*scale; 
    } else {
        cX_start = startX - pL - (1.0*scale) - 0.5*scale; 
    }

    if (tr.tipo === 'sider') ctx.globalAlpha = 0.5;
    
    let currentX = cX_start;
    composicaoCargas.forEach(carga => {
        const grid = getGridMetrics(tr, carga.comp, carga.larg, carga.qtd, isCarreta);
        const cL = carga.comp * scale;
        const cH = carga.alt * scale;
        const cY = (pos === 'pescoco' || tr.tipo === 'reta' || isCarreta ? groundY - pH - cH : groundY - hT - cH);
        
        for (let r = 0; r < grid.rows; r++) {
            const itemX = currentX - cL - r * (carga.comp + GAP) * scale;
            drawCargoRect(ctx, itemX, cY, cL, cH, carga);
        }
        
        currentX -= (grid.totalComp + GAP) * scale;
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
        const grid = getGridMetrics(tr, c.comp, c.larg, c.qtd, isCarreta);
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

    if (widestCarga) {
        const grid = getGridMetrics(tr, widestCarga.comp, widestCarga.larg, widestCarga.qtd, isCarreta);
        const cW = widestCarga.larg * scale;
        const cH = widestCarga.alt * scale;
        const cY = groundY - tH - cH;
        
        const firstRowItems = Math.min(grid.maxCols, widestCarga.qtd);
        const rowW_Scale = firstRowItems * cW + Math.max(0, firstRowItems - 1) * GAP * scale;
        const startX_row = centerX - rowW_Scale / 2;

        for (let c = 0; c < firstRowItems; c++) {
            const itemX = startX_row + c * (cW + GAP * scale);
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

LOAD_TYPES.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    tipoCargaSelect.appendChild(option);
});

tipoCargaSelect.addEventListener('change', () => {
    const val = tipoCargaSelect.value;
    if(CONTAINER_LOAD_TYPES.has(val)) {
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
    updateTrailerInfo();
});

window.addEventListener('load', () => {
    initThreeJS();
    updateTrailerInfo();
    renderListaCargas();
});