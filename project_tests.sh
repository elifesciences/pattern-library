#!/bin/bash
set -e

gulp test
bin/validate
