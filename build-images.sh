#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
services=(event-bus posts comments moderation query)

for service in "${services[@]}"; do
  service_dir="${root_dir}/${service}"
  dockerfile="${service_dir}/Dockerfile"

  if [[ ! -f "${dockerfile}" ]]; then
    echo "Skipping ${service}: Dockerfile not found." >&2
    continue
  fi

  image_name="blog/${service}"
  echo "Building ${image_name} from ${service_dir}..."
  docker build -t "${image_name}" "${service_dir}"
done

echo "All builds finished."
