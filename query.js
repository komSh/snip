const {
    EnigmaUtils,
    Secp256k1Pen,
    SigningCosmWasmClient,
    pubkeyToAddress,
    encodeSecp256k1Pubkey,
  } = require('secretjs');
  
  // Load environment variables
  require('dotenv').config();
  
  const customFees = {
    upload: {
      amount: [{ amount: '2000000', denom: 'uscrt' }],
      gas: '2000000',
    },
    init: {
      amount: [{ amount: '500000', denom: 'uscrt' }],
      gas: '500000',
    },
    exec: {
      amount: [{ amount: '500000', denom: 'uscrt' }],
      gas: '500000',
    },
    send: {
      amount: [{ amount: '80000', denom: 'uscrt' }],
      gas: '80000',
    },
  };
  
  const main = async () => {
      console.log( process.env.SECRET_REST_URL);
    const httpUrl = process.env.SECRET_REST_URL;
  
    // Use key created in tutorial #2
    const mnemonic = process.env.MNEMONIC;
  
    // A pen is the most basic tool you can think of for signing.
    // This wraps a single keypair and allows for signing.
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic).catch((err) => {
      throw new Error(`Could not get signing pen: ${err}`);
    });
  
    // Get the public key
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
  
    // get the wallet address
    const accAddress = pubkeyToAddress(pubkey, 'secret');
  
    // initialize client
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  
    const client = new SigningCosmWasmClient(
      httpUrl,
      accAddress,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      customFees
    );

    console.log(`\nWallet address: ${accAddress}\n`);
    
  
    // 1. Get a list of all tokens
    let queryMsg = {
        tokens: {
          owner: accAddress,
        },
      };
    
      let response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(`Token IDs: ${JSON.stringify(response.token_list.tokens, null, 2)} \n`);

      const token_id = response.token_list.tokens[1];
  
    if (response.token_list.tokens.length == 0) {
      console.log(
        'No token was found for your account, make sure that the minting step completed successfully.\n'
      );
        process.exit(); // Otherwise, the user would need to exit the process manually with ctrl+c
    }

  //  // 2. Approve the token 
      query_message = {
        "approve": {
          "spender": "secret1au3axsakvjuf69vntw5293759ennez3hj25zyh",
          "token_id": token_id,
        }
      }

      console.log(`Approve spender of token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, query_message)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      // console.log(`approve_response: ${JSON.stringify(response, null, 2)} \n`);
      console.log(`approve_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);

    
  // // 3. Add minter
   addMinters = {
      "set_minters": {
        "minters": [
          accAddress
        ], 
      }
    }

    console.log(`Query public addMinters data of token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, addMinters)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        // console.log(`set_minters_response: ${JSON.stringify(response)} \n`);
        console.log(`set_minters_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);

    
  //  // 4. Set global approval
    queryMsgApprove =  {
      "set_global_approval": {
        token_id: token_id,
        "view_owner": "approve_token" ,
        "view_private_metadata": "revoke_token" ,
      }
    }

    console.log(`Query public queryMsgApprove data of token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, queryMsgApprove)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        // console.log(`set_global_approval_response: ${JSON.stringify(response)} \n`);
        console.log(`set_global_approval_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);


  //  // 5. Register Receive NFT
      register_receive_nft = {
        "register_receive_nft": {
          "code_hash": process.env.SECRET_NFT_CONTRACT1,
          "also_implements_batch_receive_nft": true
    
        }
      }

      console.log(`Query public register_receive_nft data of token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, register_receive_nft)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        // console.log(`register_receive_nft_response: ${JSON.stringify(response)} \n`);
        console.log(`register_receive_nft_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);

    
  //     // 7. Set royalty info
      setRoyaltyInfo = {
        "set_royalty_info": {
          "token_id": token_id,
          "royalty_info": {
            "decimal_places_in_rates": 4,
            "royalties": [
              {
                "recipient": "secret1nex2x7yh3vvwqk5sfre70va5q8g5kr0m8c8l2k",
                "rate": 100,
              },
             
            ],
          },
        }
      }

      console.log(`set royalty for token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, setRoyaltyInfo)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        // console.log(`set_royalty_info_response: ${JSON.stringify(response)} \n`);
        console.log(`set_royalty_info_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);


  //   // 9. Query the token dossier
     queryMsg = {
        nft_dossier: {
          token_id: token_id,
        },
      };
    
      console.log(`Query dossier of token #${token_id}`);
      response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(`nft_dossier_response: ${JSON.stringify(response, null, 2)} \n`);
  
  //   // 10. Set our viewing key
    const private_key = process.env.SECRET_VIEWING_KEY;

    const handleMsg = {
        set_viewing_key: {
          key: private_key,
        },
      };
      console.log('Set viewing key');
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      // console.log(`set_viewing_key_response: ${JSON.stringify(response)} \n`);
      console.log(`set_viewing_key_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);

  
  //   // 11. Query the dossier again
    queryMsg = {
        nft_dossier: {
          token_id: token_id,
          viewer: {
            address: accAddress,
            viewing_key: process.env.SECRET_VIEWING_KEY,
          },
        },
      };
    
      console.log(`Query dossier of token #${token_id} with viewing key`);
      response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        console.log(`nft_dossier_with_viewing_key_response: ${JSON.stringify(response, null, 2)} \n`);

  //     // 8. Query royalty info 
      queryMsg = {
        royalty_info: {
            token_id,
            viewer: {
              address: accAddress,
              viewing_key: process.env.SECRET_VIEWING_KEY,
            },
          },
        };

      console.log(`Query royalty data of token #${token_id}`);
      response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(`query_royalty_info_response: ${JSON.stringify(response.royalty_info.royalty_info.royalties, null, 2)} \n`);

  //     // 6. Send NFT
      sendNFT = {
        "send_nft": {
          "contract": process.env.SECRET_NFT_CONTRACT1 ,
              // "receiver_info": {
              //   "also_implements_batch_receive_nft": true ,
              // },
          "token_id": token_id,
        }
      }

      console.log(`Query public data of sendNFT token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, sendNFT)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        console.log(`send_nft_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);
        console.log(token_id);

      // 6. Send NFT
      receiveNFT = {
        "batch_receive_nft": {
          "sender": process.env.SECRET_NFT_CONTRACT1,
          "from": process.env.SECRET_NFT_CONTRACT1,
          "token_ids": [ token_id ],
        }
      }

      console.log(`Query public data of receiveNFT token #${token_id}`);
      response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, receiveNFT)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
        console.log(`receve_nft_txHash: https://secretnodes.com/secret/chains/pulsar-2/transactions/${response.transactionHash} \n`);
   };
      
  main().catch((err) => {
    console.error(err);
  });


