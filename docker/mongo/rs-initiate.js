// deploy the stack from the compose file with
docker stack deploy -c docker-compose-global.yml mongos

// listar contenedores del nodo
docker ps

// entrar a bash del container en este nodo
docker exec -it <container id> /bin/bash

// ejecutar mongosh (mongo cli)
mongosh

// usar db admin
use admin

// usar ips de los nodos (cuantos existan)
rs.initiate(
  {
    _id: "amongo", members: [
      { _id: 0, host: "192.168.18.221:27017" },
      { _id: 1, host: "192.168.18.222:27017" },
      { _id: 2, host: "192.168.18.223:27017" }
    ]
  }
)

exit // repetir hasta salir