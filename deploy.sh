#!/bin/bash

# Wait Message Function
wait_message() {
    local message="$1"
    local wait_time="$2"
    echo -n "$message"
    for (( i=0; i<$wait_time; i++ )); do
        sleep 1
        echo -n "."
    done
    echo
}

# Execute Command and Error Handling Function
execute_command() {
    local command="$1"
    local description="$2"
    echo "Ejecutando: $description"
    if ! $command; then
        echo "Error: Fallo al ejecutar $description"
        exit 1
    fi
}

# Deploy Network Driver Tier
if ! docker network inspect exam1 &>/dev/null; then
    docker network create --driver bridge exam1
fi

# Deploy Storage Tier
execute_command "docker-compose -f ./docker/persistence.yml up --build -d" "Storage Tier"

# Wait for storage tier to be up
wait_message "Waiting for storage tier" 5

# Deploy Discovery Tier
execute_command "docker-compose -f ./docker/discovery-server.yml up --build -d" "Discovery"

# Wait for discovery tier to be up
wait_message "Waiting for config and sevice discovery" 5

# Deploy App Tier
execute_command "docker-compose -f ./docker/application.yml up --scale frontend=2 --scale backend=2 --build -d" "App Tier"

# Wait for app tier to be up
wait_message "Waiting for app tier" 5

# Deploy Network Tier
execute_command "docker-compose -f ./docker/network.yml up --build -d" "Network Tier"

# Wait for network tier to be up
wait_message "Waiting for network tier" 5

# Show Status
echo -e "\n\nProccess Status------------------------------------"
docker ps -a | awk '{print $2}'
