const {
    EnigmaUtils,
    Secp256k1Pen,
    SigningCosmWasmClient,
    pubkeyToAddress,
    encodeSecp256k1Pubkey,
  } = require("secretjs");
  
  // Requiring the dotenv package in this way
  // lets us use environment variables defined in .env
  require("dotenv").config();
  
  const customFees = {
    upload: {
      amount: [{ amount: "2000000", denom: "uscrt" }],
      gas: "2000000",
    },
    init: {
      amount: [{ amount: "500000", denom: "uscrt" }],
      gas: "500000",
    },
    exec: {
      amount: [{ amount: "500000", denom: "uscrt" }],
      gas: "500000",
    },
    send: {
      amount: [{ amount: "80000", denom: "uscrt" }],
      gas: "80000",
    },
  };
  
  const main = async () => {
    const httpUrl = process.env.SECRET_REST_URL;
  
    // Use the mnemonic created in step #2 of the Secret Pathway
    const mnemonic = process.env.MNEMONIC;
  
    // A pen is the most basic tool you can think of for signing.
    // This wraps a single keypair and allows for signing.
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic).catch((err) => {
      throw new Error(`Could not get signing pen: ${err}`);
    });
  
    // Get the public key
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
  
    // get the wallet address
    const accAddress = pubkeyToAddress(pubkey, "secret");
  
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
    var ipfs ="";
    const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('5a155adb5bec846ae83e', '6512531349e8baf09354810d5147e69f35bdbdb2b0a549c75e84cf7d7bb991fe');

  pinata.testAuthentication().then((result) => {
      //handle successful authentication here
      console.log(result);
  }).catch((err) => {
      //handle error here
      console.log(err);
  });

  const myPublicToken = "secret public token rep";
  const body = {
      message: 'secret public token'
  };
  const options = {
      pinataMetadata: {
          name: myPublicToken,
          keyvalues: {
              customKey: 'customValue4',
            
          }
      },
      pinataOptions: {
          cidVersion: 0
      }
  };

 
  const respons_ipfs_public = await pinata.pinJSONToIPFS(body, options).catch((err) => {
      //handle error here
      console.log(err);
  });

  const myPrivateToken = "secret private token rep";
  const private_body = {
      message: 'secret token 2 rep'
  };
  const private_options = {
      pinataMetadata: {
          name: myPrivateToken,
          keyvalues: {
              customKey: 'customValue4',
            
          }
      },
      pinataOptions: {
          cidVersion: 0
      }
  };

 
  const respons_ipfs_private = await pinata.pinJSONToIPFS(private_body, private_options).catch((err) => {
      //handle error here
      console.log(err);
  });
  console.log(respons_ipfs_private);
  
    // 1. Define your metadata
      // const derivedMetadata = "additional payload";
      // const derivedMetadata2 = "additional payload22";
      // const publicMetadata = `<public metadata> ${derivedMetadata}`;
      // const privateMetadata = `<private metadata> ${derivedMetadata2}`;
  
    // 2. Mint a new token to yourself
    const handleMsg = {
        mint_nft: {
          owner: accAddress,
          public_metadata: {
            token_uri: "https://ipfs.io/ipfs/"+respons_ipfs_public.IpfsHash
          },
          private_metadata: {
            token_uri: "https://ipfs.io/ipfs/"+respons_ipfs_private.IpfsHash
          },
          
        },
      };
    
      console.log("Minting yourself a nft");
      const response = await client
        .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
        .catch((err) => {
            console.log(err);
          throw new Error(`Could not execute contract: ${err}`);
        });
      console.log("response: ", response);
  
  };
  
  main().catch((err) => {
    console.error(err);
  });