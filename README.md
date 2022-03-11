## Steps:

Install NPM:

`npm install`

 ## .env 

MNEMONIC , SECRET_NFT_CONTRACT

Change the enviromemnt varaiables by adding :

`secretcli keys add <account_name>` (This will generate the memonic )


Now by using the 1.Deploy contract you will have a 
SECRET_NFT_CONTRACT 

.env is setup already in case you want to generate a 

new wallet or want to deploy a new contract 

otherwise using mint to mint a new token and then do query.


1.Deploy contract by using command :

`node scripts/deploy-contract.js`

2.Mint the token :

`node scripts/token_mint.js`

3.Query the token :

`node scripts/query_token.js`



