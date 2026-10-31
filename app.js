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
        offsetY: 1 // Empurra o camião para cima (ajuste se ficar a flutuar)
    },
    fortnite_semi_truck: { 
        format: 'gltf', 
        url: './fortnite_semi_truck.glb',
        scale: 1.2, 
        rotationY: Math.PI, // Mantém virado para a frente
        offsetY: 1 // Empurra o camião para cima
    },
    semi_truck_burnout_revenge: { 
        format: 'gltf', 
        url: './semi_truck_burnout_revenge.glb',
        scale: 1.0,
        rotationY: 0,
        offsetY: 0 // Zero se já estiver a tocar no chão
    }
};

const cabModelPromises = new Map();
const cabTexturePaletteCache = new WeakMap();

// Clareia texturas escuras dos cavalinhos sem apagar pixels pretos de pneus/vidros.
const cabBrightTextureCache = new WeakMap();

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

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;

            // Mantém pixels quase pretos para preservar contornos e detalhes.
            if (luminance < 9) continue;

            // Levanta sombras e meios-tons, mantendo a tonalidade original.
            const lift = value => Math.min(255, Math.round(
                255 * Math.pow(value / 255, 0.62)
            ));

            data[i] = lift(r);
            data[i + 1] = lift(g);
            data[i + 2] = lift(b);
        }

        ctx.putImageData(pixels, 0, 0);

        const brightTexture = texture.clone();
        brightTexture.image = canvas;
        brightTexture.needsUpdate = true;
        cabBrightTextureCache.set(texture, brightTexture);
        return brightTexture;
    } catch (error) {
        console.warn('Não foi possível clarear uma textura do cavalinho:', error);
        return texture;
    }
}

const CAB_REFERENCE_SIZE = [7.4757, 10.306, 25.3345];
const CAB_REFERENCE_CENTER = [0, 5.1179, 11.6600];

function recolorCabTexture(texture, preserveDarkBelow = 8) {
    if (!texture?.image) return texture;
    if (cabTexturePaletteCache.has(texture)) return cabTexturePaletteCache.get(texture);

    const image = texture.image;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const highestChannel = Math.max(red, green, blue);

        if (highestChannel < preserveDarkBelow) continue;

        if (luminance >= 170) {
            const shade = 0.82 + 0.18 * Math.min(1, luminance / 255);
            pixels[i] = Math.round(192 * shade);
            pixels[i + 1] = Math.round(192 * shade);
            pixels[i + 2] = Math.round(192 * shade);
        } else {
            const shade = 0.82 + 0.18 * Math.min(1, luminance / 180);
            pixels[i] = Math.round(13 * shade);
            pixels[i + 1] = Math.round(75 * shade);
            pixels[i + 2] = Math.round(112 * shade);
        }
    }
    context.putImageData(imageData, 0, 0);

    const recoloredTexture = new THREE.CanvasTexture(canvas);
    recoloredTexture.wrapS = texture.wrapS;
    recoloredTexture.wrapT = texture.wrapT;
    recoloredTexture.repeat.copy(texture.repeat);
    recoloredTexture.offset.copy(texture.offset);
    recoloredTexture.center.copy(texture.center);
    recoloredTexture.rotation = texture.rotation;
    recoloredTexture.flipY = texture.flipY;
    recoloredTexture.encoding = texture.encoding;
    recoloredTexture.needsUpdate = true;
    cabTexturePaletteCache.set(texture, recoloredTexture);
    return recoloredTexture;
}

const LOAD_TYPES = [
    { value: 'caixa', label: 'Caixa / carga industrial', preset: [6, 2.8, 2.5, 15] },
    { value: 'bobina_lado_1', label: '1 bobina — face para o lado', preset: [3, 3, 3, 12] },
    { value: 'bobina_lado_2', label: '2 bobinas — faces para o lado', preset: [5, 3, 3, 24] },
    { value: 'bobina_frente_1', label: '1 bobina — face para frente', preset: [3, 3, 3, 12] },
    { value: 'bobina_frente_2', label: '2 bobinas — faces para frente', preset: [6, 3, 3, 24] },
    { value: 'skid', label: 'Skid offshore com equipamento interno', preset: [6, 3, 3.8, 18] },
    { value: 'container_mae', label: 'Coração de Mãe — fechado (4 × 4 × 4 m)', preset: [4, 4, 4, 12] },
    { value: 'container_mae_aberto', label: 'Coração de Mãe — aberto (4 × 4 × 4 m)', preset: [4, 4, 4, 12] },
    { value: 'container_20', label: 'Container de 20 pés', preset: [6.06, 2.44, 2.59, 4] },
    { value: 'container_40', label: 'Container de 40 pés', preset: [12.19, 2.44, 2.59, 8] },
    { value: 'container_10', label: 'Container de 10 pés', preset: [3.05, 2.44, 2.59, 2] },
    { value: 'container_baby', label: 'Container baby (menor que 10 pés)', preset: [2.5, 2.2, 2.2, 1.5] },
    { value: 'tanque', label: 'Tanque em grade — 10 pés', preset: [3.05, 2.44, 2.59, 3.5] },
    { value: 'tubulacao', label: 'Tubulações / tubos', preset: [8, 2.4, 2, 8] },
    { value: 'vaso', label: 'Vaso de pressão / separador', preset: [4, 2.8, 3.5, 10] },
    { value: 'gerador', label: 'Gerador / unidade de potência', preset: [4.5, 2.6, 2.7, 8] },
    { value: 'cesta', label: 'Cesta offshore / basket', preset: [4, 2.4, 2.5, 5] },
    { value: 'estrutura', label: 'Estrutura metálica / peça naval', preset: [7, 3, 2.8, 9] }
];

const CONTAINER_LOAD_TYPES = new Set([
    'container_mae', 'container_20', 'container_40', 'container_10', 'container_baby'
]);

const inputs = {
    cavalinho: document.getElementById('input_cavalinho'),
    placa_prancha: document.getElementById('input_placa'),
    placa_carreta: document.getElementById('input_placa_carreta'),
    cComp: document.getElementById('input_carga_comp'),
    cLarg: document.getElementById('input_carga_largura'),
    cAlt: document.getElementById('input_carga_altura'),
    cPeso: document.getElementById('input_carga_peso'),
    cQtd: document.getElementById('input_carga_qtd'),
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
    sideCanvas: document.getElementById('sideCanvas'),
    rearCanvas: document.getElementById('rearCanvas'),
    btnReset: document.getElementById('btn_reset')
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

function analyzeAndDraw() {
    const tr = currentTrailer;
    const cComp = parseFloat(inputs.cComp.value) || 0.1;
    const cLarg = parseFloat(inputs.cLarg.value) || 0.1;
    const cAlt = parseFloat(inputs.cAlt.value) || 0.1;
    const cPesoUnitario = parseFloat(inputs.cPeso.value) || 0;
    let cQtd = parseInt(inputs.cQtd.value) || 1;
    if (cQtd < 1) cQtd = 1;

    const pesoTotal = cPesoUnitario * cQtd;

    const pos = inputs.posicao.value;
    const isCarreta = tr.tipo.includes('carreta') || tr.tipo === 'vanderleia' || tr.tipo === 'sider';

    const grid = getGridMetrics(tr, cComp, cLarg, cQtd, isCarreta);

    let reqAET = false;
    let aetMotivo = "";
    let alertClass = "bg-green-50 border-green-200 text-green-800";
    let iconColor = "text-green-600";
    
    if (grid.totalLarg > tr.w) { 
        reqAET = true;
        aetMotivo = `A largura do bloco de carga (${grid.totalLarg.toFixed(2)}m) excede a largura do veículo (${tr.w.toFixed(2)}m). `;
        if(grid.totalLarg > 3.20) aetMotivo += `(Excede limite legal de 3.20m).`;
    } else if (isCarreta && grid.totalLarg > grid.availableWidth) {
        const usesGates = inputs.tampas.value === 'com' && tr.tipo !== 'sider' && tr.tipo !== 'carreta_bau';
        if(usesGates) {
            aetMotivo = `Atenção: O bloco de carga (${grid.totalLarg.toFixed(2)}m) excede a área útil entre as tampas (${grid.availableWidth.toFixed(2)}m). Mude para "Sem tampas laterais" ou reduza as fileiras. `;
            alertClass = "bg-amber-50 border-amber-200 text-amber-800";
            iconColor = "text-amber-600";
        }
    }

    if (pesoTotal > tr.cap) {
        reqAET = true; 
        aetMotivo += aetMotivo ? " E " : "ALERTA: ";
        aetMotivo += `O peso total da carga (${pesoTotal.toFixed(2)}t) excede a capacidade do veículo (${tr.cap.toFixed(2)}t).`;
    }

    const pH = 1.60; 
    let baseH = tr.h; 
    if (tr.tipo === 'reta' || (!isCarreta && pos === 'pescoco')) {
        baseH = pH;
    }
    
    const altTotal = baseH + cAlt; 
    els.resAltTotal.textContent = altTotal.toFixed(2);
    
    if (altTotal > 4.40) {
        reqAET = true;
        aetMotivo += aetMotivo ? " E a " : "A ";
        aetMotivo += `altura total (${altTotal.toFixed(2)}m) excede 4.40m.`;
        els.avisoAlt.textContent = "Excesso de Altura!";
        els.avisoAlt.className = "text-[10px] mt-1 font-bold text-red-600";
    } else {
        els.avisoAlt.textContent = "Dentro do gabarito (4.40m)";
        els.avisoAlt.className = "text-[10px] mt-1 font-semibold text-green-600";
    }

    if (reqAET) {
        alertClass = "bg-red-50 border-red-200 text-red-800"; iconColor = "text-red-600";
        els.titleAet.textContent = "AET OBRIGATÓRIA"; 
        els.descAet.textContent = aetMotivo;
    } else if (!reqAET && aetMotivo !== "") {
        els.titleAet.textContent = "ATENÇÃO OPERACIONAL"; 
        els.descAet.textContent = aetMotivo;
    } else {
        els.titleAet.textContent = "CARGA NORMAL"; 
        els.descAet.textContent = "Dimensões e fileiras dentro dos limites.";
    }
    els.alertAet.className = `rounded-md p-4 shadow-sm border transition-colors duration-300 ${alertClass}`;
    els.iconAet.className = `w-5 h-5 ${iconColor}`;

    let excesso = (grid.totalLarg - tr.w) / 2;
    if (excesso <= 0) {
        els.resExcLat.textContent = "0.00";
        document.getElementById('icon_excesso_lat').classList.replace('bg-red-100', 'bg-slate-100');
        document.getElementById('icon_excesso_lat').classList.replace('text-red-600', 'text-slate-400');
    } else {
        els.resExcLat.textContent = excesso.toFixed(2);
        document.getElementById('icon_excesso_lat').classList.replace('bg-slate-100', 'bg-red-100');
        document.getElementById('icon_excesso_lat').classList.replace('text-slate-400', 'text-red-600');
    }

    let espacoDisponivel = pos === 'mesa' || isCarreta ? tr.mesa : tr.pescoco;
    if (tr.tipo === 'reta') espacoDisponivel = tr.mesa; 

    let pctUso = (grid.totalComp / espacoDisponivel) * 100;
    els.resCompTotal.textContent = `de ${espacoDisponivel.toFixed(2)}m (${isCarreta ? 'carroceria' : pos})`;
    els.resCompUso.textContent = `${grid.totalComp.toFixed(2)}m usados`;
    
    if (pctUso > 100) {
        els.barComp.style.width = '100%'; els.barComp.className = "h-full bg-red-500 transition-all duration-500";
        els.resCompUso.className = "text-[10px] font-bold text-red-600";
        els.resCompUso.textContent = `${grid.totalComp.toFixed(2)}m (EXCESSO TRAS.)`;
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

    draw3D(tr, cComp, cLarg, cAlt, cQtd, grid, pos, isCarreta);
    draw2D(tr, cComp, cLarg, cAlt, cQtd, grid, pos, isCarreta);
}

// --- Desenho 3D ---
function draw3D(tr, cComp, cLarg, cAlt, cQtd, grid, pos, isCarreta) {
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
    
    // Textura procedural para as tampas (linhas horizontais simulando metal corrugado)
    const createCorrugatedTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f172a'; // Cor base da carroceria
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = '#1e293b'; // Linha clara (relevo)
        for(let i=0; i<128; i+=16) {
            ctx.fillRect(0, i, 128, 12);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 4); // Repetir a textura para não ficar esticada
        return tex;
    };
    
    const corrugatedMat = new THREE.MeshStandardMaterial({
        color: 0x475569, // Cinza ardósia realista
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
    
    // Agora a Vanderleia E a Carreta Baú utilizam o chassi 3D
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

                    // Se for vanderleia, escondemos as rodas e componentes suspensos originais do modelo 3D
                    // para podermos desenhar as rodas procedurais espaçadas
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
                        // Mantemos o chassi com a cor branca original de acordo com a sua preferência
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

            // Cores originais mantidas de acordo com a sua última configuração
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
                    } else if (material.name === 'lambert3SG') { // Pneus
                        newMat.metalness = 0.0;
                        newMat.roughness = 0.9;
                    } else { // Pintura principal
                        newMat.metalness = 0.3;
                        newMat.roughness = 0.4;
                    }
                    return newMat;
                });
                node.material = Array.isArray(node.material) ? updatedMaterials : updatedMaterials[0];
            });
        } else {
            // --- CAVALINHOS GLTF/GLB ---
            const cabConfig = CAB_MODELS[cabModelId] || {};
            const baseRotY = cabConfig.rotationY !== undefined ? cabConfig.rotationY : 0;
            
            object.rotation.set(0, baseRotY, 0);
            object.updateMatrixWorld(true);
            
            const bounds = new THREE.Box3().setFromObject(object);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());
            
            const customScale = cabConfig.scale || 1.0;
            const scaleX = (CAB_REFERENCE_SIZE[0] / size.x) * customScale;
            const scaleY = (CAB_REFERENCE_SIZE[1] / size.y) * customScale;
            const scaleZ = (CAB_REFERENCE_SIZE[2] / size.z) * customScale;
            const customOffsetY = cabConfig.offsetY || 0;
            
            object.scale.set(scaleX, scaleY, scaleZ);
            object.position.set(
                CAB_REFERENCE_CENTER[0] - center.x * scaleX,
                CAB_REFERENCE_CENTER[1] - center.y * scaleY + customOffsetY, 
                CAB_REFERENCE_CENTER[2] - center.z * scaleZ
            );
            
            // --- CLAREAMENTO REAL DA LATARIA DOS CAVALINHOS GLB ---
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

                    // Componentes que devem continuar escuros.
                    const isDarkDetail = /glass|window|windshield|tire|tyre|rubber|wheel|pneu|vidro|grill|grille|lamp|headlight|tail.?light/.test(materialName);

                    if (!isDarkDetail) {
                        if (material.map) {
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
        box(wT,.24*S,mL,deckMat,0,deckY-.12*S,-mL/2 + shiftZ);
        box(wT*.94,.045*S,mL*.96,woodMat,0,deckY+.02*S,-mL/2 + shiftZ);
        const startAxleZ = rearStart + 1.2*S;
        
        if (usesChassisModel) {
            addChassisModel();
            
            // AQUI OCORRE A TRANSFORMAÇÃO PARA VANDERLEIA COM CHASSI 3D
            // Desenha as rodas procedurais espaçadas após esconder as originais
            if (tr.tipo === 'vanderleia') {
                const axleY = 0.49*S;
                const rW = 0.48*S;
                const axSpacing = 2.4*S; // Espaçamento maior obrigatório para Vanderleia
                
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
        
        // Para-choque Traseiro e Protetores Laterais (Ciclistas)
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
            
            box(wT, tampH*1.5, tampT, corrugatedMat, 0, deckY + (tampH*1.5)/2, shiftZ -tampT/2);
            box(wT, tampH, tampT, corrugatedMat, 0, deckY + tampH/2, -mL + shiftZ + tampT/2);
            
            if (inputs.tampas.value === 'com') {
                [-1,1].forEach(side => {
                    box(tampT, tampH, mL - 2*tampT, corrugatedMat, side*(wT/2 - tampT/2), deckY + tampH/2, -mL/2 + shiftZ);
                });
            }
        }
    } else {
        const dropL = tr.tipo==='reta' ? 0 : 1.2*S;
        
        box(0.15*S, 0.3*S, pL, frame, -0.4*S, pH-0.15*S, -pL/2 + shiftZ);
        box(0.15*S, 0.3*S, pL, frame, 0.4*S, pH-0.15*S, -pL/2 + shiftZ);
        box(wT, 0.1*S, pL, deckMat, 0, pH-0.05*S, -pL/2 + shiftZ);
        box(wT*.9, 0.04*S, pL*.96, woodMat, 0, pH+0.02*S, -pL/2 + shiftZ); 
        
        mesh(new THREE.CylinderGeometry(0.08*S, 0.08*S, 0.3*S, 16), steel, 0, pH-0.35*S, -0.5*S + shiftZ); 

        if(tr.tipo==='reta'){
            box(wT, 0.24*S, mL, deckMat, 0, pH-0.12*S, -pL-mL/2 + shiftZ);
            box(wT*.9, 0.045*S, mL*.96, woodMat, 0, pH+0.02*S, -pL-mL/2 + shiftZ);
        } else {
            const dy = pH - hT;
            const rampL = Math.hypot(dropL, dy);
            const ramp = box(wT, 0.24*S, rampL, deckMat, 0, (pH+hT)/2 - 0.12*S, -pL - dropL/2 + shiftZ);
            ramp.rotation.x = -Math.atan2(dy, dropL);
            
            box(wT, 0.24*S, mL, deckMat, 0, hT - 0.12*S, -pL - dropL - mL/2 + shiftZ);
            box(wT*.9, 0.045*S, mL*.96, woodMat, 0, hT + 0.02*S, -pL - dropL - mL/2 + shiftZ); 
            
            const rearDrop = 0.8*S;
            const rearDy = 0.2*S; 
            const back = box(wT, 0.24*S, Math.hypot(rearDrop, rearDy), deckMat, 0, hT + rearDy/2 - 0.12*S, -pL - dropL - mL - rearDrop/2 + shiftZ);
            back.rotation.x = -Math.atan2(rearDy, rearDrop);
            
            box(wT, 0.24*S, bridgeL, deckMat, 0, hT + rearDy - 0.12*S, rearEnd + shiftZ + bridgeL/2);
        }
        const axleY=.49*S;
        for(let i=0;i<tr.eixos;i++){
            const z = rearEnd + shiftZ + .55*S + i*(Math.min(1.18*S,bridgeL/Math.max(1,tr.eixos)));
            [-1,1].forEach(side=>{
                const x=side*(wT/2-.35*S);
                wheel(x-side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, side > 0);
                wheel(x+side*.15*S,axleY,z,.48*S,.28*S, trailerGroup, false);
            });
        }
    }

    const loadType = document.getElementById('input_tipo_carga')?.value || 'caixa';
    const loadW = Math.max(.1, cLarg) * S;
    const loadH = Math.max(.1, cAlt) * S;
    const loadL = Math.max(.1, cComp) * S;

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
    function buildCage(frameMaterial, accentMaterial, withDiagonals=true){
        const halfW = loadW/2;
        const halfH = loadH/2;
        const halfL = loadL/2;
        const tube = Math.max(0.06*S, Math.min(loadW,loadH,loadL)*0.025);
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
        const coilMaterial = mat(0x9ca3af,0.32,0.78);
        const coreMaterial = mat(0x273443,0.48,0.55);
        const endPositions = axis === 'x'
            ? [-1,1].map(side => [x + side*length/2,y,z])
            : [-1,1].map(side => [x,y,z + side*length/2]);

        if(axis === 'x'){
            cylinderAlongX(radius,length,coilMaterial,x,y,z);
            cylinderAlongX(radius*0.24,length*1.03,coreMaterial,x,y,z);
        } else {
            cylinderAlongZ(radius,length,coilMaterial,x,y,z);
            cylinderAlongZ(radius*0.24,length*1.03,coreMaterial,x,y,z);
        }

        endPositions.forEach(position => {
            const ring = mesh(new THREE.TorusGeometry(radius*0.9,Math.max(0.04*S,radius*0.055),10,32),coilMaterial,...position,baseItem);
            if(axis === 'x') ring.rotation.y = Math.PI/2;
            const hub = axis === 'x'
                ? cylinderAlongX(radius*0.24,0.04*S,coreMaterial,...position)
                : cylinderAlongZ(radius*0.24,0.04*S,coreMaterial,...position);
            hub.castShadow = true;
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

    if(loadType.startsWith('bobina_')){
        const coilCount = loadType.endsWith('_2') ? 2 : 1;
        const axis = loadType.includes('_lado_') ? 'x' : 'z';
        const sectionLength = loadL / coilCount;
        const radius = Math.max(0.12*S,Math.min(loadW,loadH,sectionLength*1.6)*0.43);
        for(let i=0;i<coilCount;i++){
            const centerZ = -loadL/2 + sectionLength*(i+0.5);
            const coilLength = axis === 'x' ? loadW*0.78 : sectionLength*0.78;
            drawCoil(axis,radius,coilLength,0,0,centerZ);
        }
        cargoBox(loadW*0.9,0.12*S,loadL*0.96,navy,0,-loadH/2-0.06*S,0);
    } else if(CONTAINER_LOAD_TYPES.has(loadType)){
        const armador = document.getElementById('input_armador').value;
        let contColor = 0x176b87; 
        let logoText = "";
        let logoColor = "#000000";
        
        if (armador === 'maersk') {
            contColor = 0xe0e5e8;
        } else if (armador === 'msc') {
            contColor = 0xd6c37f;
            logoColor = "#111111";
        } else if (armador === 'hapag') {
            contColor = 0xea580c; 
            logoColor = "#001b3a";
        } else if (armador === 'evergreen') {
            contColor = 0x065f32;
            logoColor = "#ffffff";
        } else if (armador === 'cma') {
            contColor = 0x0f2142;
            logoColor = "#ffffff";
        }

        const contMat = mat(contColor);
        const ribD = 0.035 * S; 
        cargoBox(loadW - 2*ribD, loadH, loadL, contMat, 0, 0, 0); 
        const ribs=Math.max(8,Math.min(64,Math.floor(loadL/.22)));
        const ribMat = mat(contColor); 
        
        for(let i=0;i<=ribs;i++){
            const z=-loadL/2+i*loadL/ribs;
            [-1,1].forEach(side=>cargoBox(ribD, loadH*.94, .035*S, ribMat, side*(loadW/2 - ribD/2), 0, z));
        }
        cargoBox(loadW*.98,.08*S,loadL*.98,navy,0,loadH/2,0);
        cargoBox(loadW*.98,.08*S,loadL*.98,navy,0,-loadH/2,0);

        if (armador !== 'generico') {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = logoColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (armador === 'maersk') {
                ctx.font = 'bold 120px "Arial Black", sans-serif';
                ctx.fillText('MAERSK', 512 + 100, 128);
                ctx.fillStyle = '#4099d4';
                ctx.fillRect(80, 40, 160, 160);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                const cx = 160, cy = 120, outer = 70, inner = 32, p = 7;
                for(let i = 0; i < p * 2; i++) {
                    const a = (i * Math.PI / p) - Math.PI/2;
                    const r = (i % 2 === 0) ? outer : inner;
                    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
                }
                ctx.closePath();
                ctx.fill();
            } else if (armador === 'msc') {
                ctx.font = 'bold 180px "Impact", sans-serif';
                ctx.fillText('msc', 512, 128);
            } else if (armador === 'hapag') {
                ctx.font = 'bold 120px "Arial", sans-serif';
                ctx.fillText('Hapag-Lloyd', 512 + 100, 128);
                ctx.fillStyle = '#00539c';
                ctx.fillRect(80, 50, 120, 156);
            } else if (armador === 'evergreen') {
                ctx.font = 'bold 120px "Arial Black", sans-serif';
                ctx.fillText('EVERGREEN', 512, 128);
            } else if (armador === 'cma') {
                ctx.font = 'bold 120px "Arial Black", sans-serif';
                ctx.fillText('CMA CGM', 512, 128);
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            const logoMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
            
            const logoW = loadL * 0.8;
            const logoH = logoW * (256/1024);
            const planeGeom = new THREE.PlaneGeometry(logoW, logoH);
            
            const p1 = new THREE.Mesh(planeGeom, logoMat);
            p1.position.set(loadW/2 + 0.05, 0, 0); 
            p1.rotation.y = Math.PI / 2;
            baseItem.add(p1);

            const p2 = new THREE.Mesh(planeGeom, logoMat);
            p2.position.set(-loadW/2 - 0.05, 0, 0);
            p2.rotation.y = -Math.PI / 2;
            baseItem.add(p2);
        }
    } else if(loadType==='tubulacao'){
        const radius=Math.min(loadH*.22,loadW*.13,.35*S);
        const rowsL=Math.max(1,Math.floor(loadH/(radius*2.1)));
        const colsL=Math.max(1,Math.floor(loadW/(radius*2.1)));
        let n=0;
        for(let row=0;row<rowsL && n<28;row++){
            for(let col=0;col<colsL && n<28;col++,n++){
                const cx=(col-(Math.min(colsL,28)-1)/2)*radius*2.1;
                const cy=-loadH/2+radius+(row*radius*2.1);
                cylinderAlongZ(radius,loadL*.96, n%3===0?steelLight:mat(0x647585),cx,cy,0,20);
            }
        }
        cargoBox(loadW*1.02,.12*S,loadL*.98,navy,0,-loadH/2-.08*S,0);
    } else if(loadType==='container_mae_aberto'){
        buildCage(cageOrange,mat(0xf2a128),true);
        cargoBox(loadW*0.78,loadH*0.54,loadL*0.76,equipmentBeige,0,-loadH*0.02,0);
        cargoBox(loadW*0.78,0.08*S,loadL*0.76,mat(0xd6bd87),0,loadH*0.27,0);
    } else if(loadType==='tanque'){
        buildCage(cageSteel,cageAccent,true);
        const tankRadius = Math.min(loadW,loadH)*0.34;
        cylinderAlongZ(tankRadius,loadL*0.72,equipmentSteel,0,-loadH*0.02,0,40);
        [-1,1].forEach(side => {
            const end = mesh(new THREE.SphereGeometry(tankRadius,24,16),equipmentSteel,0,-loadH*0.02,side*loadL*0.36,baseItem);
            end.scale.set(1,1,0.28);
        });
    } else if(loadType==='skid'){
        buildCage(cageSteel,cageAccent,true);
        cargoBox(loadW*0.68,loadH*0.42,loadL*0.62,equipmentBeige,0,-loadH*0.02,0);
        cargoBox(loadW*0.72,0.12*S,loadL*0.68,navy,0,-loadH*0.34,0);
        [-1,1].forEach(side => {
            cargoBox(0.12*S,loadH*0.28,loadL*0.56,equipmentSteel,side*loadW*0.31,0,0);
        });
    } else if(loadType==='estrutura' || loadType==='cesta'){
        buildCage(loadType==='cesta' ? equipmentSteel : cageSteel,cageAccent,true);
    } else if(loadType==='vaso'){
        const vesselRadius = Math.min(loadW,loadH)*0.39;
        const vesselLength = loadL*0.78;
        cylinderAlongZ(vesselRadius,vesselLength,equipmentSteel,0,0,0,40);
        [-1,1].forEach(side => {
            const head = mesh(new THREE.SphereGeometry(vesselRadius,28,20),equipmentSteel,0,0,side*vesselLength*0.46,baseItem);
            head.scale.set(1,1,0.3);
            cargoBox(loadW*0.26,loadH*0.18,0.25*S,navy,0,-vesselRadius*0.8,side*loadL*0.2);
        });
        cargoBox(loadW*0.84,0.12*S,loadL*0.84,navy,0,-loadH/2-0.06*S,0);
    } else if(loadType==='gerador'){
        const baseY = -loadH/2 + 0.08*S;
        cargoBox(loadW*0.9,0.16*S,loadL*0.9,navy,0,baseY,0);
        cargoBox(loadW*0.82,loadH*0.64,loadL*0.76,equipmentSteel,0,loadH*0.02,0);
        cargoBox(loadW*0.84,0.12*S,loadL*0.78,frame,0,loadH*0.34,0);
        cargoBox(0.05*S,loadH*0.38,loadL*0.42,navy,loadW*0.43,0,0);
        for(let i=0;i<6;i++){
            cargoBox(0.025*S,loadH*0.42,0.035*S,steelLight,-loadW*0.43+i*0.12*S,0,loadL*0.2);
        }
        cargoBox(0.05*S,loadH*0.2,loadL*0.22,orange,loadW*0.44,loadH*0.1,0);
    } else {
        cargoBox(loadW,loadH,loadL,orange, 0, 0, 0);
        cargoBox(loadW*1.01,.07*S,loadL*1.01,darkOrange,0,loadH/2,0);
        cargoBox(loadW*1.01,.07*S,loadL*1.01,darkOrange,0,-loadH/2,0);
    }

    let loadY, loadZ_start;
    if (isCarreta) {
        loadY = deckY + loadH/2;
        loadZ_start = -0.5 * S + shiftZ;
    } else {
        loadY = (pos === 'pescoco' || tr.tipo === 'reta' ? pH : hT) + loadH/2;
        const dropL = tr.tipo === 'reta' ? 0 : 1.0 * S;
        loadZ_start = (pos === 'pescoco') ? -0.5*S + shiftZ : -pL - dropL - 0.5*S + shiftZ;
    }

    const { maxCols, rows } = grid;
    
    for (let i = 0; i < cQtd; i++) {
        const r = Math.floor(i / maxCols);
        const c = i % maxCols;
        
        const rowItems = Math.min(maxCols, cQtd - r * maxCols);
        const rowW = rowItems * loadW + Math.max(0, rowItems - 1) * GAP * S;
        
        const itemX = -rowW / 2 + loadW / 2 + c * (loadW + GAP * S);
        const itemZ = loadZ_start - loadL / 2 - r * (loadL + GAP * S);
        
        const inst = baseItem.clone();
        inst.position.set(itemX, loadY, itemZ);
        loadGroup.add(inst);
    }
    
    const totalLen = Math.max(10, 4.5*S+(isCarreta?mL:(tr.tipo==='reta'?pL+mL:pL+1.0*S+mL+bridgeL))+grid.totalComp*S);
    
    // Adicionamos um compensador para puxar o foco da câmera em direção ao cavalo mecânico
    const compensacaoFrente = 2.5 * S; 
    const centerZ = (isCarreta ? -mL/2 + shiftZ : -pL-mL/2 + shiftZ) + compensacaoFrente;
    
    camera.position.set(totalLen*.45, Math.max(7*S,loadY+loadH*1.5), centerZ - totalLen*.3);
    controls.target.set(0, Math.max(1.0*S,loadY*.5), centerZ);
    
    camera.near=.1; camera.far=totalLen*8;
    camera.updateProjectionMatrix();
    controls.update();
}

function draw2D(tr, cComp, cLarg, cAlt, cQtd, grid, pos, isCarreta) {
    const loadType = document.getElementById('input_tipo_carga')?.value || 'caixa';
    drawSide2D(ctxSide, els.sideCanvas, tr, cComp, cLarg, cAlt, cQtd, grid, pos, loadType, isCarreta);
    drawRear2D(ctxRear, els.rearCanvas, tr, cComp, cLarg, cAlt, cQtd, grid, pos, loadType, isCarreta);
}

function drawCargoRect(ctx, x, y, w, h, isContainer=false) {
    if(isContainer) {
        const armador = document.getElementById('input_armador').value;
        let color = 'rgba(23,107,135,0.7)'; 
        if(armador === 'maersk') color = 'rgba(224,229,232,0.9)';
        if(armador === 'msc') color = 'rgba(214,195,127,0.9)';
        if(armador === 'hapag') color = 'rgba(234,88,12,0.9)';
        if(armador === 'evergreen') color = 'rgba(6,95,50,0.8)';
        if(armador === 'cma') color = 'rgba(15,33,66,0.8)';

        ctx.fillStyle = color;
        ctx.strokeStyle = '#1e293b';
    } else {
        ctx.fillStyle='rgba(245,158,11,.7)';
        ctx.strokeStyle='#b45309';
    }
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
}

function drawSide2D(ctx, canvas, tr, cComp, cLarg, cAlt, cQtd, grid, pos, loadType, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cTractor = 4.5;
    const bridgeL = 3.5;
    const wTotal = cTractor + (isCarreta ? tr.mesa : tr.pescoco + (tr.tipo === 'reta' ? 0 : 1.0) + tr.mesa + bridgeL) + 2; 
    const hTotal = Math.max(5.0, (tr.tipo === 'reta' || isCarreta ? 1.6 : Math.max(1.6, tr.h)) + cAlt + 2); 

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

    const cL = cComp * scale;
    const cH = cAlt * scale;
    let cX_start, cY;
    
    if(isCarreta) {
        cX_start = startX - 0.5*scale;
        cY = groundY - pH - cH;
    } else if(pos === 'pescoco' || tr.tipo === 'reta') {
        cX_start = startX - 0.5*scale; 
        cY = groundY - pH - cH;
    } else {
        cX_start = startX - pL - (1.0*scale) - 0.5*scale; 
        cY = groundY - hT - cH;
    }

    if (tr.tipo === 'sider') ctx.globalAlpha = 0.5;
    
    const isCont = CONTAINER_LOAD_TYPES.has(loadType);
    for (let r = 0; r < grid.rows; r++) {
        const itemX = cX_start - cL - r * (cComp + GAP) * scale;
        drawCargoRect(ctx, itemX, cY, cL, cH, isCont);
    }
    ctx.globalAlpha = 1.0;

    const limitH = 4.40 * scale;
    ctx.setLineDash([5, 5]); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, groundY - limitH); ctx.lineTo(canvas.width, groundY - limitH); ctx.stroke();
    ctx.setLineDash([]);
}

function drawRear2D(ctx, canvas, tr, cComp, cLarg, cAlt, cQtd, grid, pos, loadType, isCarreta) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const wTotal = Math.max(tr.w, grid.totalLarg) + 2; 
    const hTotal = Math.max(4.5, (tr.tipo === 'reta' || pos === 'pescoco' || isCarreta ? 1.6 : tr.h) + (tr.tipo==='sider'?2.8:cAlt) + 1);
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

    const cW = cLarg * scale;
    const cH = cAlt * scale;
    const cY = groundY - tH - cH;
    
    const firstRowItems = Math.min(grid.maxCols, cQtd);
    const rowW_Scale = firstRowItems * cW + Math.max(0, firstRowItems - 1) * GAP * scale;
    const startX_row = centerX - rowW_Scale / 2;

    const isCont = CONTAINER_LOAD_TYPES.has(loadType);
    for (let c = 0; c < firstRowItems; c++) {
        const itemX = startX_row + c * (cW + GAP * scale);
        drawCargoRect(ctx, itemX, cY, cW, cH, isCont);
    }

    const limitW = grid.availableWidth;
    if (grid.totalLarg > limitW) {
        const excW = limitW * scale;
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px Arial';
        ctx.beginPath(); ctx.moveTo(centerX - rowW_Scale/2, cY - 10); ctx.lineTo(centerX - excW/2, cY - 10); ctx.stroke();
        ctx.fillText('Exc', centerX - rowW_Scale/2 + 2, cY - 15);
        ctx.beginPath(); ctx.moveTo(centerX + excW/2, cY - 10); ctx.lineTo(centerX + rowW_Scale/2, cY - 10); ctx.stroke();
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
        inputs.cQtd.value = "1";
    }
    analyzeAndDraw();
});

inputArmador.addEventListener('change', analyzeAndDraw);
if(inputs.tampas) inputs.tampas.addEventListener('change', analyzeAndDraw);
Object.values(inputs).forEach(el => {
    if(el) el.addEventListener('input', analyzeAndDraw);
});

els.btnReset.addEventListener('click', () => {
    const caixaPreset = LOAD_TYPES.find(type => type.value === 'caixa').preset;
    [inputs.cComp, inputs.cLarg, inputs.cAlt, inputs.cPeso].forEach((el,i) => el.value = caixaPreset[i]);
    inputs.cQtd.value = "1"; inputs.posicao.value = "mesa";
    inputs.placa_carreta.value = ""; inputs.placa_prancha.value = "prancha_reb_6_3";
    if (tipoCargaSelect) {
        tipoCargaSelect.value = "caixa";
        divArmador.classList.add('hidden');
        inputArmador.value = 'generico';
    }
    updateTrailerInfo();
});

window.addEventListener('load', () => {
    initThreeJS();
    updateTrailerInfo();
});