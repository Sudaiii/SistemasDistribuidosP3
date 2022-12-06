# Deployment instructions

Everything can be scaled up, meaning that adding more nodes just requires changing the commands to suit the appropiate amount of nodes in use.

## Virtual machines

3 machines running

- Ubuntu 22.04 or equivalent linux OS
- Docker with the compose plugin and non sudo user
- 2GB ram, 10 GB disk

and configured with a static ip address.

recommended for docker swarm to have the Hostname set up properly:

- Manager machine: manager01
- Worker machines: worker01, worker02 ....

### Docker

install docker with digital ocean instruccions for the proper distribution of Ubuntu server, allow docker to be used without sudo.

install docker compose with:

    sudo apt-get install docker-compose-plugin

### Swarm

configure swarm with the manager01 machine as the manager node with:

    docker swarm init --advertise-addr <MANAGER-IP>

add the worker nodes executing the instructions given by the output of that command on EVERY worker node.

from now on, all instructions, files and commands only needs to be uploaded/executed on the Manager node

    docker node ls

will display all nodes joined to the swarm

## Local registry

a local image reistry is necesary to distribute built images to worker nodes, start one with

    docker service create --name registry --publish published=5000,target=5000 registry:2

then, the commands to look into a swarm are

    docker service ls

to check current services running and registry should be up

## Mongo

MongoDB will be deployed as follows:

- one mongoDB instance for ever virtual machine in the swarm
- port 27017
- configured as a replicaset called "amongo"

some manual steps needs to be done before the replica set is functional:

### Deploy the stack

go to the directory docker/mongo and deploy the stack with:

    docker stack deploy -c docker-compose-global.yml mongos

as usual, check if the services are up with:

    docker service ls

and you can get more info on the specific service with:

    docker service <service name> ps

now we need to access to the shell of any of the mongo containers to set up the replica set, well do it in the container runing on the manager node

    docker ps

y luego

    docker exec -it <container id> /bin/bash

note that th e id used is the one returned by `docker ps` and not the one fron any of the `docker service ...`

inside the shell execute

    mongosh

and wait for the prompt `test>`

change to the admin db with command

    use admin

initiate the replica set withe next command, replace the ip addresses for the proper ones

    rs.initiate(
    {
        _id: "amongo", members: [
            { _id: 0, host: "<manager01 IP>:27017" },
            { _id: 1, host: "<worker01 IP>:27017" },
            { _id: 2, host: "<worker02 IP>:27017" }
            ]
        }
    )

the command should return with no errors

then exit mongosh with the exit command, and exit the container shell with another exit command.

this will have a functional mongo replica set, the URI for maximun redundancy will be, dont forget to use the proper ip addresses.

    mongodb://<manager01 IP>:27017,<worker01 IP>:27018,<worker02 IP>:27019/?replicaSet=amongo
