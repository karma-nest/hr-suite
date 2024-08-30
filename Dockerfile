# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build hrx-sync`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t hrx-sync`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system hrx-sync && \
          adduser --system -G hrx-sync hrx-sync

COPY dist/hrx-sync hrx-sync/
RUN chown -R hrx-sync:hrx-sync .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix hrx-sync --omit=dev -f install

CMD [ "node", "hrx-sync" ]
