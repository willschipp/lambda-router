# Router

## Overview

NodeJS app that uses unirest to proxy requests to services inside the docker host.
Uses weave-dns to discover and relay requests and uses dockerode to remotely discover
and start containers if they're down, cleaning up afterwards

## Usage

- build into a docker image
- run with ```docker run --name router -p 80:80 -d router```
