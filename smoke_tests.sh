#!/usr/bin/env bash
set -ex

hostname="${1:-localhost}"
[ $(curl --write-out %{http_code} --silent --output /dev/null https://$hostname) == 200 ]
