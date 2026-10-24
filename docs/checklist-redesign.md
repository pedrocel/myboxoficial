# Checklist do redesign (referência: mybox.tokadigital.com.br)

## Base visual
- [x] Fontes Geist (texto) + Archivo largo (títulos)
- [x] Paleta oklch igual à do modelo, tema escuro padrão e tema claro no rodapé
- [x] Componentes `.btn`, `.display`, `.eyebrow`, `.lede`, `.chip`, `.input`, `.media` (src/styles/site.css)
- [x] Granulado, animação de entrada (data-reveal), hero animado, faixa de cidades, acordeão das modalidades
- [x] Fotos e logo do modelo em public/images e public/mybox-logo-white.png

## Layout global
- [x] Header transparente sobre a foto, com fundo ao rolar; menu mobile em tela cheia
- [x] Link "Pular para o conteúdo"
- [x] Rodapé em 3 colunas, redes sociais e alternador de tema

## Páginas
- [x] Home `/` (números, cidades e estados vêm das unidades do banco)
- [x] A Rede `/a-rede`
- [x] Treinos `/treinos`
- [x] Unidades `/unidades` (busca e filtro por UF na URL: `?q=` e `?uf=`)
- [x] Detalhe `/unidades/:slug` (mantém o botão de agendar aula experimental)
- [x] Franquia `/franquia` (formulário continua enviando para o endpoint de leads)
- [x] Contato `/contato`
- [x] 404 / Termos / Privacidade no novo layout
- [ ] Textos reais de Termos de Uso e Política de Privacidade
