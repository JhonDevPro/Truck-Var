# Calculadora de Cargas Especiais — Felka

## Instalar como aplicativo

O workflow **Publish PWA and build Android APK** publica a versão web no GitHub Pages e cria um APK de depuração em cada push para `main` ou execução manual. O APK abre a versão publicada do site; mudanças na interface e nas cargas chegam ao aplicativo após a publicação web, sem reinstalar o APK. O ícone do PWA, do iOS e do APK usa o logo em `assets/truck-var-logo.png`.

1. No GitHub, habilite **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Aguarde o workflow terminar. A URL do PWA aparece no resumo do job `publish-pwa`.
3. Android: abra essa URL no Chrome e escolha **Instalar app** ou **Adicionar à tela inicial**. Para instalar o APK, baixe `cargas-felka-android-apk` em **Actions → execução do workflow → Artifacts** e autorize a instalação dessa origem no Android.
4. iPhone/iPad: abra a URL no Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

O APK precisa de conexão à internet para abrir o site e receber as atualizações. Ações que alterem o código nativo ou os metadados do aplicativo ainda exigem gerar e distribuir um APK novo. O pacote Android não inclui os modelos 3D; eles são carregados pelo site publicado.

O PWA mantém os arquivos principais e as bibliotecas do Three.js em cache depois de carregados online. Os modelos 3D são grandes e não são armazenados pelo service worker; eles precisam ser baixados quando usados.

## Planejamento de cargas e tubos

Na área de cargas, as abas **Cargas** e **Tubos** mantêm os planejamentos separados. Tubos são planejados somente para carretas de 14 m ou 15 m; o comprimento é definido automaticamente como 13 m ou 14 m, respectivamente. O cálculo usa o diâmetro externo efetivo, a largura útil e a altura informadas para estimar tubos por camada, camadas, capacidade, peso e viagens. A aba também mostra o arranjo na carroceria em 3D e o corte frontal, com opção para ilustrar quatro cintas e redes drapeadas e presas nas duas pontas; revise as dimensões, os dormentes e a amarração antes do transporte.
