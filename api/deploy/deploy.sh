#!/usr/bin/env bash
# =========================================================================
# Publica a API da My Box na VPS compartilhada (mesmo padrao do iapi).
# Uso, a partir da raiz do site:  npm run api:deploy
#
# - Envia api/ para /opt/mybox-api (sem .env, data e node_modules).
# - Na primeira vez cria o .env com um LEAD_API_TOKEN aleatorio e carrega as unidades.
# - Sobe o container na rede "edge" e publica api.myboxoficial.com.br pelo Caddy do PoseMe,
#   validando a configuracao antes de recarregar (nao derruba os outros sites).
# =========================================================================
set -euo pipefail

SSH_TARGET="${SSH_TARGET:-root@200.141.24.144}"
REMOTE_DIR="${REMOTE_DIR:-/opt/mybox-api}"
CADDY="${CADDY:-poseme-api-caddy-1}"
DOMAIN="${DOMAIN:-api.myboxoficial.com.br}"
API_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Testes da API"
(cd "$API_DIR" && npm test >/dev/null) || { echo "x Testes falhando. Deploy cancelado."; exit 1; }

echo "==> Enviando codigo para ${SSH_TARGET}:${REMOTE_DIR}"
ssh "$SSH_TARGET" "mkdir -p ${REMOTE_DIR}"
rsync -az --delete \
  --exclude node_modules --exclude data --exclude .env --exclude .DS_Store \
  "$API_DIR/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "==> .env do servidor"
ssh "$SSH_TARGET" "test -f ${REMOTE_DIR}/.env || (umask 077; cat > ${REMOTE_DIR}/.env <<ENV
NODE_ENV=production
PUBLIC_BASE_URL=https://${DOMAIN}
ALLOWED_ORIGINS=https://myboxoficial.com.br,https://www.myboxoficial.com.br,https://myboxoficial.pages.dev,http://localhost:5183
LEAD_API_TOKEN=\$(openssl rand -hex 32)
ENV
echo '   .env criado (LEAD_API_TOKEN novo).')"

echo "==> Subindo o container"
ssh "$SSH_TARGET" "cd ${REMOTE_DIR}/deploy && docker compose up -d --build 2>&1 | tail -3"

echo "==> Aguardando /health"
for _ in $(seq 1 20); do
  ssh "$SSH_TARGET" "curl -sf -m 3 http://127.0.0.1:3020/health" >/dev/null && break
  sleep 3
done
ssh "$SSH_TARGET" "curl -sf -m 3 http://127.0.0.1:3020/health" >/dev/null || { echo "x API nao respondeu"; exit 1; }

echo "==> Unidades (so carrega se o banco estiver vazio)"
ssh "$SSH_TARGET" "n=\$(curl -s http://127.0.0.1:3020/units | grep -o '\"slug\"' | wc -l); \
  if [ \"\$n\" = 0 ]; then docker exec mybox-api node scripts/admin.ts seed-units seed/units.json; else echo \"   \$n unidades ja no banco\"; fi"

echo "==> Publicando ${DOMAIN} no Caddy"
scp -q "$API_DIR/deploy/mybox-api.caddy" "${SSH_TARGET}:/opt/edge/sites/mybox-api.caddy"
ssh "$SSH_TARGET" "docker exec ${CADDY} caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1 \
  && docker exec ${CADDY} caddy reload --config /etc/caddy/Caddyfile \
  || { rm -f /opt/edge/sites/mybox-api.caddy; echo 'x Caddyfile invalido, site removido'; exit 1; }"

echo ""
echo "OK. Teste:  curl https://${DOMAIN}/health"
echo "Admin:      ssh ${SSH_TARGET} 'docker exec mybox-api node scripts/admin.ts create-admin voce@email.com Nome'"
