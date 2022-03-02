const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('5a155adb5bec846ae83e', '6512531349e8baf09354810d5147e69f35bdbdb2b0a549c75e84cf7d7bb991fe');

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

const MyCustomName = "test33";
const body = {
    message: 'Pinatas are awesomeeeeeee'
};
const options = {
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue4',
            customKey2: 'customValueee2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinJSONToIPFS(body, options).then((result) => {
    //handle results here
    console.log(result.IpfsHash);
}).catch((err) => {
    //handle error here
    console.log(err);
});