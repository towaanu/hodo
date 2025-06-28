#!/bin/sh
podman run \
  --name hodo_dev \
  -p 5999:5432 \
  -e POSTGRES_DB=hodo \
  -e POSTGRES_USER=hodo \
  -e POSTGRES_PASSWORD=secret \
  -d postgres

