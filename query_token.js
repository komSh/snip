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
    console.log(`Wallet address=${accAddress}`);
  
    // 1. Get a list of all tokens

    let queryMsg = {
        tokens: {
          owner: accAddress,
        },
      };
    
      console.log("Reading all tokens");
      let response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log("response: ", response);
    const token_id = response.token_list.tokens[6];
  
    if (response.token_list.tokens.length == 0)
      console.log(
        'No token was found for you account, make sure that the minting step completed successfully'
      );

   
      query_message = {
        "approve": {
          "spender": "secret1dmuv6cvquvkejelhneuvfxzdck4uk48cqnzc4h",
          token_id: token_id,
          
        }
      }

      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, query_message)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(response);
    
    // 2. Query the public metadata
   addMinters =  {
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
      console.log(response);

    
    
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
      console.log(response);


      queryMsg = {
        royalty_info: {
            token_id: token_id,
          },
        };
        
    
      console.log(`Query public data of token #${token_id}`);
      response = await client
        .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(response.royalty_info.royalty_info.royalties);
     // return;
  
    // 3. Query the token dossier
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
      console.log("response: ", response);
     const view_key = process.env.SECRET_VIEWING_KEY;
  
    // 4. Set our viewing key
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
      console.log('response: ', response);
  
    // 5. Query the dossier again
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
      console.log('response: ', response);
  
  };
  
  main().catch((err) => {
    console.error(err);
  });