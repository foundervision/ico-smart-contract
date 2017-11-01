ifndef VERBOSE
.SILENT:
endif
pwd = $$(pwd)
rpcRunning = $$(docker inspect -f '{{.State.Running}}' testrpc)

# creates the docker network
network-create:
	docker network create --attachable icotoken

# builds the rpc image
rpc-docker-build:
	docker build -t ico/testrpc ./.docker/testrpc

# builds the truffle image
truffle-docker-build:
	docker build -t ico/truffle ./.docker/truffle

# runs the testrpc container
rpc-up:
	docker run -it --rm --network=icotoken -p 8545:8545 --name testrpc ico/testrpc

# stops the testrpc container
rpc-down:
	docker stop -t 2 testrpc

# runs the testrpc container detached
rpc-up-detached:
	docker run -d --rm --network=icotoken -p 8545:8545 --name testrpc ico/testrpc

# executes the provided truffle command
truffle-cmd:
	docker run -it --rm --network=icotoken -v $(pwd):/project -p 9229:9229 -p 8080:8080 -w /project --name truffle ico/truffle bash -c "([[ -d node_modules ]] || npm install) && $(CMD)"

# opens bash in the truffle container
truffle-bash:
	docker run -it --rm --network=icotoken -v $(pwd):/project -p 9229:9229 -p 8080:8080 -w /project --name truffle ico/truffle bash

truffle-console:
	make -i rpc-up-detached
	make truffle-cmd CMD="truffle console --network docker"

truffle-console-ropsten:
	make truffle-cmd CMD="truffle console --network ropsten"

truffle-networks:
	make truffle-cmd CMD="truffle networks"