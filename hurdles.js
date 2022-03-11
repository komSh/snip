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
    const token_id = response.token_list.tokens[5];
  
    if (response.token_list.tokens.length == 0)
      console.log(
        'No token was found for you account, make sure that the minting step completed successfully'
      );

 // register interface to receive 
      register_interface = {
        "register_receive_nft": {
          "code_hash": process.env.SECRET_NFT_CONTRACT,
          "also_implements_batch_receive_nft": true
    
        }
      }

      console.log(`Query public queryBatch data of token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, register_interface)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(response);

//receive nFT
      RECEIVEnft = {
        "receive_nft": {
          "sender": "secret14l70mptg3wy3k53ez3v62uckxx7l4jzx03t2f8" ,
          "token_id": token_id,
        
        }
      }
      console.log(`Query public data of  RECEIVEnft token #${token_id}`);
      response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, RECEIVEnft)
        .catch((err) => {
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log(response);


// 4.query royalty info 
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
    
  
    
  
  };
  
  main().catch((err) => {
    console.error(err);
  });