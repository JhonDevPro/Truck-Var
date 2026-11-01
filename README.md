# Calculadora de Cargas Especiais — Felka

## Instalar como aplicativo

O workflow **Publish PWA and build Android APK** publica a versão web no GitHub Pages e cria um APK de depuração em cada push para `main` ou execução manual. O ícone do PWA, do iOS e do APK usa o logo em `assets/truck-var-logo.png`.

1. No GitHub, habilite **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Aguarde o workflow terminar. A URL do PWA aparece no resumo do job `publish-pwa`.
3. Android: abra essa URL no Chrome e escolha **Instalar app** ou **Adicionar à tela inicial**. Para instalar o APK, baixe `cargas-felka-android-apk` em **Actions → execução do workflow → Artifacts** e autorize a instalação dessa origem no Android.
4. iPhone/iPad: abra a URL no Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

O PWA mantém os arquivos principais e as bibliotecas do Three.js em cache depois de carregados online. Os modelos 3D são grandes e não são armazenados pelo service worker; eles precisam ser baixados quando usados. O APK inclui os modelos no pacote.
