# Calculadora de Cargas Especiais — Felka

## Instalar como aplicativo

O workflow **Publish PWA and build Android APK** publica a versão web no GitHub Pages e cria um APK de depuração em cada push para `main` ou execução manual. O APK abre a versão publicada do site; mudanças na interface e nas cargas chegam ao aplicativo após a publicação web, sem reinstalar o APK. O ícone do PWA, do iOS e do APK usa o logo em `assets/truck-var-logo.png`.

1. No GitHub, habilite **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Aguarde o workflow terminar. A URL do PWA aparece no resumo do job `publish-pwa`.
3. Android: abra essa URL no Chrome e escolha **Instalar app** ou **Adicionar à tela inicial**. Para instalar o APK, baixe `cargas-felka-android-apk` em **Actions → execução do workflow → Artifacts** e autorize a instalação dessa origem no Android.
4. iPhone/iPad: abra a URL no Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

O APK precisa de conexão à internet para abrir o site e receber as atualizações. Ações que alterem o código nativo ou os metadados do aplicativo ainda exigem gerar e distribuir um APK novo. O pacote Android não inclui os modelos 3D; eles são carregados pelo site publicado.

O PWA mantém os arquivos principais, as bibliotecas do Three.js e os modelos 3D compactados em cache após o primeiro carregamento online. Ao abrir o sistema, a composição inicial é o Scania S-730 com a carreta padrão de 14 m. Os modelos selecionados são baixados sob demanda; Scania e chassi da carreta são pré-carregados para agilizar a composição e a animação da frota. A publicação compacta os GLBs de cargas gerais durante o build.

## Supabase e planejamentos na nuvem

O app usa o projeto Supabase Truck-Var para autenticação por e-mail e armazenamento privado dos planejamentos de cargas e tubos. A chave `sb_publishable_...` configurada no cliente é pública por definição; não coloque chaves `sb_secret_...` ou senhas do banco no código.

Para habilitar o banco em um projeto Supabase:

1. Abra **SQL Editor**, execute o conteúdo de [`supabase/migrations/20261105000000_create_saved_plans.sql`](./supabase/migrations/20261105000000_create_saved_plans.sql) e confirme que a tabela `public.saved_plans` foi criada.
2. Em **Authentication → Providers → Email**, habilite o provedor de e-mail. A criação de conta pode exigir confirmação do endereço.
3. Em **Authentication → URL Configuration**, configure o URL publicado do app como **Site URL** e permita-o em **Redirect URLs**. Para testes locais, adicione também o URL local usado pelo servidor de desenvolvimento.
4. No app, crie uma conta ou entre; use **Salvar planejamento** para armazenar, **Carregar** para recuperar e **Excluir** para remover seus próprios registros.

A tabela aplica Row Level Security (RLS): cada conta só pode consultar, alterar ou excluir seus próprios planejamentos. A interface funciona sem login, mas a sincronização exige a migração e uma conexão à internet.

## Interface e tema

Use **Escuro/Claro** na barra superior para alternar o tema; a preferência fica salva neste navegador. Em telas a partir de 600 pixels de largura, incluindo tablets, o cockpit mantém a visualização 3D visível e oferece rolagem independente nas colunas de configuração e análise. Em telas menores, o conteúdo é organizado em uma coluna com rolagem.

## Planejamento de cargas e tubos

Na área de cargas, as abas **Cargas** e **Tubos** mantêm os planejamentos separados. Tubos são planejados somente para carretas de 14 m ou 15 m; o comprimento é definido automaticamente como 13 m ou 14 m, respectivamente. O cálculo usa o diâmetro externo efetivo, a largura útil e a altura informadas para estimar tubos por camada, camadas, capacidade, peso e viagens. A aba também mostra o arranjo na carroceria em 3D e o corte frontal, com opção para ilustrar quatro cintas e redes drapeadas e presas nas duas pontas; revise as dimensões, os dormentes e a amarração antes do transporte.

Nas pranchas, quando a primeira carga cabe na mesa ou no pescoço apenas reduzindo a folga inicial, a prévia mostra a carga e avisa para conferir apoios, obstáculos e fixação. Uma carga de 4 m, por exemplo, pode ocupar toda a mesa de 4 m; a representação não garante que o transporte seja viável. O Coração de Mãe fechado e o equipamento no modelo aberto são ilustrações; as inscrições do container são fictícias e não substituem a identificação ou os dados reais.

Em **Adicionar Amarração**, selecione um item da composição e salve os dados por peça. O cálculo por cima é uma simulação de deslizamento baseada nos valores informados; capacidade de bloqueio é apenas declarada, e o momento de tombamento não inclui o efeito das amarras. Para amarração direta, cargas empilhadas e conjuntos de bobinas, a contenção e a quantidade necessária permanecem indeterminadas. As capacidades e o atrito sugeridos não certificam equipamentos ou superfícies, e o desenho é esquemático: não garante contato, ângulos, pontos de ancoragem ou ausência de interseções, especialmente em modelos GLB, cargas agrupadas e empilhadas. As amarras aparecem também em **Animar Transporte**, cuja cena atual não simula curvas, articulação ou frenagem. A amarração de tubos na aba própria continua apenas ilustrativa e separada deste cálculo. Um profissional habilitado deve validar o plano real e os requisitos legais aplicáveis.

A aba **Cargas Gerais** lista os modelos GLB em `cargas/` e permite adicioná-los à mesma composição das cargas existentes. Modelos com “container” no nome recebem as medidas de referência dos containers Dry de 10, 20 ou 40 pés; sem tamanho no nome, usa-se 20 pés. Modelos com “palet” ou “pallet” no nome recebem 1,20 × 1,20 × 1,40 m e 100 kg. Os pesos dos containers devem ser informados. Confira e ajuste esses valores para a carga real antes do transporte. O peso das cargas pode ser informado em kg (padrão) ou toneladas. Os modelos são redimensionados para as medidas informadas, com sua dimensão horizontal mais longa orientada no comprimento do veículo; os arquivos que trazem rotação horizontal recebem correções específicas antes do redimensionamento. Os modelos identificados como escuros recebem ajuste de materiais na visualização, sem alterar os arquivos GLB ou os modelos já claros. São baixados sob demanda e a publicação web inclui a pasta de cargas.
Nas carretas, os modelos de cargas gerais com “container” ou “cesta” no nome usam a mesma distância mínima de 1,40 m do malhal aplicada às cargas tradicionais desses tipos. A posição é uma referência visual; confira a compatibilidade com os locks do veículo real.
Para incluir novos arquivos, adicione também os nomes à lista `GENERAL_CARGO_FILES` em `app.js`. O build web gera automaticamente os arquivos `.glb.gz` correspondentes.

## Caminhões

A opção **Comparar Frota (3D)** abre o Pátio da Frota sem alterar o planejamento. A cena reúne sete veículos, incluindo as pranchas reta e rebaixada com mesa de 7 m, com o cavalinho selecionado nas composições, grade de 1 metro, controles de órbita e repetição da animação. As dimensões dos modelos são aproximadas: o cadastro não informa o comprimento total dos caminhões ou das composições com cavalinho. Confira as medidas reais antes de utilizá-las no planejamento.

**Animar Transporte** mostra o veículo e as cargas da visualização atual em uma estrada cercada por grama e montanhas, sob céu azul, com movimento contínuo e giro das rodas dos cavalinhos, caminhões e utilitários. A câmera gira lentamente e também pode ser controlada arrastando ou usando a roda do mouse; fechar a animação não altera o planejamento.

A aba **Caminhões** do seletor de veículos usa caminhões com carroceria própria, sem cavalinho. As medidas informadas são internas; a largura externa soma 3 cm de cada lado e o piso real é 20 cm mais longo que o informado, para dar folga às cargas:

| Veículo | Carroceria útil (C × L interna) | Piso real (C × L externa) | Altura do solo ao piso | Capacidade |
| --- | --- | --- | --- | --- |
| Truck | 8 m × 2,44 m | 8,20 m × 2,50 m | 1,50 m | 12 t |
| Toco | 6 m × 2,44 m | 6,20 m × 2,50 m | 1,50 m | 8 t |
| VUC / F350 (Chevrolet, Honda ou Mercedes-Benz) | 4 m × 2 m | 4,20 m × 2,06 m | 1,10 m | 1 t |
| Utilitário Saveiro | 1,6 m × 1 m | 1,80 m × 1,06 m | 0,80 m | 400 kg |

No Truck e no Toco, **Com tampas laterais** limita a carga a 2,44 m e **Sem tampas laterais** libera os 2,50 m; o malhal (frente) e a tampa traseira sempre aparecem, assim como a sinalização vermelha e branca colada na lateral, na linha do assoalho. No Truck, containers ficam a 1 m do malhal para deixar livre a área dos locks. As paredes dos VUC e do Saveiro fazem parte do modelo 3D e sempre limitam a carga à largura interna.

O sobrepeso é indicado como atenção operacional e, sozinho, não marca a operação como AET obrigatória.

Os modelos 3D ficam em `caminhões/`. Ao carregar, cada modelo é remodelado para que a carroceria tenha exatamente as medidas acima (veja `RIGID_VEHICLE_MODELS` em `app.js`), recebe a cor padrão branca com detalhes em cinza escuro e uma luz interna na cabine. O Truck e o Toco usam a logo Iveco em `assets/iveco-logo.png`, inclusive no Pátio da Frota 3D. Para trocar um modelo ou ajustar as medidas, edite as entradas `caminhao_*` de `bdVeiculos` e a configuração do modelo correspondente. O comando `npm run build:web` publica cada modelo compactado em `modelos/*.glb.gz`; o site baixa somente as versões compactadas e só carrega o modelo do veículo escolhido.