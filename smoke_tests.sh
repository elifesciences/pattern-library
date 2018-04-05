#!/usr/bin/env bash
set -ex

hostname="${1:-localhost}"
scheme="${2:-https}"
[ $(curl --write-out %{http_code} --silent --output /dev/null "${scheme}://${hostname}") == 200 ]
