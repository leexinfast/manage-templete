#DEPLOY_SERVE_NAME=qa-server-192.168.1.185
#DEPLOY_SERVE_IP=192.168.1.185
DOCKER_IMAGE=registry.qncentury.com/qa/qnvip-capital-manage:latest
DOCKER_CONTAINER=capital-manage-web
#DOCKER_REGISTRY=registry.qncentury.com
#DOCKER_REGISTRY_USERNAME=docker
#DOCKER_REGISTRY_PASSWORD=RtDbvjn4OhrZy9wU


yarn install
npm run build


docker build . -t ${DOCKER_IMAGE}
#docker login ${DOCKER_REGISTRY} -u ${DOCKER_REGISTRY_USERNAME} -p ${DOCKER_REGISTRY_PASSWORD}
#docker push ${DOCKER_IMAGE}

#ssh -t -p 22 root@${DEPLOY_SERVE_IP} "docker pull ${DOCKER_IMAGE} && docker rm -f ${DOCKER_CONTAINER} && docker run -d --restart=always -p 8900:80 --name=${DOCKER_CONTAINER} ${DOCKER_IMAGE}"

docker rm -f ${DOCKER_CONTAINER} && docker run -d --restart=always -p 8903:80 --name=${DOCKER_CONTAINER} ${DOCKER_IMAGE}