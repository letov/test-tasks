deploy:
    cd test-tasks-docker 
    docker-compose up
test:
    npm i 
    vitest
swagger:
    http://localhost:3001/docs
