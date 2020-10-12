#!/usr/bin/env bash
CONTAINER_IMAGE_BUILT_UI=${1}
K8S_SECRET_NAME=${2}
DOMAIN_NAME=${3}
DEPLOY_NAMESPACE=${4}

for f in deploy/templates/*.yml; do
  sed -i -e "s~__CONTAINER_IMAGE_BUILT_UI__~$CONTAINER_IMAGE_BUILT_UI~" $f
  sed -i -e "s~__K8S_SECRET_NAME__~$K8S_SECRET_NAME~" $f
  sed -i -e "s~__DOMAIN_NAME__~$DOMAIN_NAME~" $f
  sed -i -e "s~__DEPLOY_NAMESPACE__~$DEPLOY_NAMESPACE~" $f
done

kubectl apply -f deploy/templates/ -n "$DEPLOY_NAMESPACE"