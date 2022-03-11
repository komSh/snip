const axios = require("axios");
const {
  EnigmaUtils,
  Secp256k1Pen,
  SigningCosmWasmClient,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} = require("secretjs");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

const customFees = {
  upload: {
    amount: [{ amount: "5000000", denom: "uscrt" }],
    gas: "5000000",
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

  // Use key created in tutorial #2
  const mnemonic = process.env.MNEMONIC;

  // A pen is the most basic tool you can think of for signing.
  // This wraps a single keypair and allows for signing.
  
 // axios.post("https://faucet.cliffnet.cosmwasm.com/credit", { denom: "COSM", address: 'cosmos1vtgjjfktpc22snd8llkayaxk632q3frntmujql'})

  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
  console.log(signingPen);
  const address = pubkeyToAddress(
    encodeSecp256k1Pubkey(signingPen.pubkey),
    "secret"
  );
  console.log("acc add "+ address);
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  const client = new SigningCosmWasmClient(
    httpUrl,
    address,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed, customFees
  );
  //console.log(client.getAccount());
  
  const client_account = await client.getAccount().catch((err) => { console.log(err);
    throw new Error(`client error : ${err}`); });;
  
    //console.log(`client account=${client_account}`);

  // 2. Upload the contract wasm

  const wasm = fs.readFileSync('contract.wasm');
  console.log('Uploading contract');
  const uploadReceipt = await client.upload(wasm, {})
    .catch((err) => { console.log(err);
      throw new Error(`Could not upload contract: ${err}`); });
      

  // Get the code ID from the receipt
  const { codeId } = uploadReceipt;

  // 3. Create an instance of the NFT contract init msg

  const initMsg = {
    /// name of token contract
    name: 'secretagency',
    /// token contract symbol
    symbol: 'secret',
    /// entropy used for prng seed
    entropy: 'affagahhasbhssgyussjjns',
    /// optional privacy configuration for the contract
    config: {
        public_owner: true
    },
  }
  const contract = await client
    .instantiate(
      codeId,
      initMsg,
      `My Snip721${Math.ceil(Math.random() * 10000)}`
    )
    .catch((err) => {
      throw new Error(`Could not instantiate contract: ${err}`);
    });
  const { contractAddress } = contract;
  console.log("contract: ", contract, "address:", contractAddress);
};

main().catch((err) => {
  console.error(err);
});