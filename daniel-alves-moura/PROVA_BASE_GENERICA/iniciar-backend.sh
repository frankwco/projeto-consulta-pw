#!/usr/bin/env sh
cd "$(dirname "$0")/backend" || exit 1
mvn spring-boot:run
