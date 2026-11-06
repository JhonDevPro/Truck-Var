# Calculadora de Cargas Especiais — Felka

## Instalar como aplicativo

O workflow **Publish PWA and build Android APK** publica a versão web no GitHub Pages e cria um APK de depuração em cada push para `main` ou execução manual. O APK abre a versão publicada do site; mudanças na interface e nas cargas chegam ao aplicativo após a publicação web, sem reinstalar o APK. O ícone do PWA, do iOS e do APK usa o logo em `assets/truck-var-logo.png`.

1. No GitHub, habilite **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Aguarde o workflow terminar. A URL do PWA aparece no resumo do job `publish-pwa`.
3. Android: abra essa URL no Chrome e escolha **Instalar app** ou **Adicionar à tela inicial**. Para instalar o APK, baixe `cargas-felka-android-apk` em **Actions → execução do workflow → Artifacts** e autorize a instalação dessa origem no Android.
4. iPhone/iPad: abra a URL no Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

O APK precisa de conexão à internet para abrir o site e receber as atualizações. Ações que alterem o código nativo ou os metadados do aplicativo ainda exigem gerar e distribuir um APK novo. O pacote Android não inclui os modelos 3D; eles são carregados pelo site publicado.

O PWA mantém os arquivos principais, as bibliotecas do Three.js e os modelos 3D otimizados da Scania e do chassi da carreta em cache após o primeiro carregamento online. Esses dois modelos são carregados em paralelo ao abrir o aplicativo para já estarem prontos ao selecionar uma carreta.

## Supabase e planejamentos na nuvem

O app usa o projeto Supabase Truck-Var para autenticação por e-mail e armazenamento privado dos planejamentos de cargas e tubos. A chave `sb_publishable_...` configurada no cliente é pública por definição; não coloque chaves `sb_secret_...` ou senhas do banco no código.

Para habilitar o banco em um projeto Supabase:

1. Abra **SQL Editor**, execute o conteúdo de [`supabase/migrations/20261105000000_create_saved_plans.sql`](./supabase/migrations/20261105000000_create_saved_plans.sql) e confirme que a tabela `public.saved_plans` foi criada.
2. Em **Authentication → Providers → Email**, habilite o provedor de e-mail. A criação de conta pode exigir confirmação do endereço.
3. Em **Authentication → URL Configuration**, configure o URL publicado do app como **Site URL** e permita-o em **Redirect URLs**. Para testes locais, adicione também o URL local usado pelo servidor de desenvolvimento.
4. No app, crie uma conta ou entre; use **Salvar planejamento** para armazenar, **Carregar** para recuperar e **Excluir** para remover seus próprios registros.

A tabela aplica Row Level Security (RLS): cada conta só pode consultar, alterar ou excluir seus próprios planejamentos. A interface funciona sem login, mas a sincronização exige a migração e uma conexão à internet.

## Planejamento de cargas e tubos

Na área de cargas, as abas **Cargas** e **Tubos** mantêm os planejamentos separados. Tubos são planejados somente para carretas de 14 m ou 15 m; o comprimento é definido automaticamente como 13 m ou 14 m, respectivamente. O cálculo usa o diâmetro externo efetivo, a largura útil e a altura informadas para estimar tubos por camada, camadas, capacidade, peso e viagens. A aba também mostra o arranjo na carroceria em 3D e o corte frontal, com opção para ilustrar quatro cintas e redes drapeadas e presas nas duas pontas; revise as dimensões, os dormentes e a amarração antes do transporte.
