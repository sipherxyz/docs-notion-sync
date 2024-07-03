# db LOCAL
docker-compose -f ./docker/docker-compose.postgres.yml up -d
docker run --name myrediscache -p 5003:6379 -d redis

docker build --file=docker/Dockerfile.backend-grpc -t grpc-internal --build-arg NPM_TOKEN=npm_ .
docker run -p 3021:3021 --env-file packages/backend/.env.local --network host grpc-internal

