#!/bin/sh
set -eu

cd /opt/trajectoire

if [ ! -f .env ]; then
  umask 077
  password="$(openssl rand -hex 24)"
  printf 'TRAJECTOIRE_USERNAME=mohamed\nTRAJECTOIRE_PASSWORD=%s\n' "$password" > .env
fi
chmod 600 .env

chown -R 1000:1000 runtime-data
chmod -R go-rwx runtime-data

docker compose config --quiet
docker compose up -d --build
