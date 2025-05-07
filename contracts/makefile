-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil 

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
BASE_RPC_URL := "https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL := "https://sepolia.base.org"

deploySepolia:
		@forge script DeployRaffle --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvvv

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""
	@echo ""
	@echo "  make fund [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2 --no-commit && forge install smartcontractkit/chainlink-brownie-contracts@1.1.1 --no-commit && forge install foundry-rs/forge-std@v1.8.2 --no-commit && forge install transmissions11/solmate@v6 --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test 

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

NETWORK_ARGS_BASE_WITH_VERIFICATION := --rpc-url $(BASE_SEPOLIA_RPC_URL) --account deployer --broadcast --verify --etherscan-api-key BAEBQPS59UMDXSF9HEKERTW1TTJGP1GWN9 -vvvv

NETWORK_ARGS_BASE := --rpc-url $(BASE_SEPOLIA_RPC_URL) --account deployer --broadcast -vvvv

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key Y6CDIEBAJ1UH3G3RQ4TF1KKF7SPQEIBSCX -vvvv
endif

# deploy:
# 	@forge script script/DeployRaffle.s.sol:DeployRaffle --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

deploy: 
	@forge script script/LocationVaultScript.s.sol:LocationVaultScript $(NETWORK_ARGS)

deployBase: 
	@forge script script/LocationVaultScript.s.sol:LocationVaultScript $(NETWORK_ARGS_BASE_WITH_VERIFICATION)


createSubscription:
	@forge script script/Interactions.s.sol:CreateSubscription $(NETWORK_ARGS)

addConsumer:
	@forge script script/Interactions.s.sol:AddConsumer $(NETWORK_ARGS)

fundSubscription:
	@forge script script/Interactions.s.sol:FundSubscription $(NETWORK_ARGS)

deployRaffleFactory:
	@forge script script/DeployRaffleFactory.s.sol:DeployRaffleFactory $(NETWORK_ARGS)

deployAll:
	@forge script script/DeployRaffle.s.sol:DeployRaffle --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
	@forge script script/Interactions.s.sol:CreateSubscription $(NETWORK_ARGS)
	@forge script script/Interactions.s.sol:AddConsumer $(NETWORK_ARGS)
	@forge script script/Interactions.s.sol:FundSubscription $(NETWORK_ARGS)
	@forge script script/DeployRaffleFactory.s.sol:DeployRaffleFactory $(NETWORK_ARGS)

deploy-sepolia:
	@forge script script/DeployRaffle.s.sol:DeployRaffle \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

deploy-zk:
    @forge create src/Raffle.sol:Raffle --rpc-url $(ETH_RPC_URL) --private-key $(PRIVATE_KEY) --zksync


deployDsc: 
	@forge script script/DeployDSC.s.sol:DeployDSC $(NETWORK_ARGS)