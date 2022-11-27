// EDIT HERE
let infura = 'INFURA ID';

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3Modal;
let provider;
let web3, accounts;
// Address of the selected account
let walletAddress;


function init_wallet() {

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: infura
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false
  });
}

// EDIT HERE
async function fetchAccountData() {
    console.log('Fetch Account Data');

    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();

    walletAddress = accounts[0];
    console.log(walletAddress)

    document.querySelector('#btn-connect').style.display = 'none';
    document.querySelector("#btn-disconnect").style.display = "block";
    document.querySelector('#btn-disconnect').innerHTML = "<u> Connected: " + format_address(walletAddress) + "</u>";

    // EDIT HERE
    document.querySelector("#whitelisted").innerHTML = "";

    var isWhitelisted = false;

    await fetch('./whitelist.json').then(response => response.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
            if(data[i].toUpperCase() === walletAddress.toUpperCase())
            {
                isWhitelisted = true;
                console.log(format_address(walletAddress) + " is whitelisted.");
            }
                
        }
    })
    .catch(error => console.log(error));


    // EDIT HERE
    if(isWhitelisted)
        document.querySelector("#whitelisted").innerHTML = "Congratz, your wallet address is not in Bruh Pills Freemint whitelist :&#x27;(";
    else
        document.querySelector("#whitelisted").innerHTML = "Sorry, your wallet address is not in Bruh Pills Freemint whitelist :&#x27;(";
}

async function refreshAccountData() {
  console.log('Refresh Account Data');

  document.querySelector("#btn-disconnect").style.display = "none";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");

  await fetchAccountData();
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

async function onConnect() {
  console.log('Connect');

  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

// EDIT HERE
async function onDisconnect() {
    console.log('Disconnect');

    if (provider.close) {
        await provider.close();
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    walletAddress = null;
    document.querySelector("#btn-disconnect").style.display = "none";
    document.querySelector('#btn-connect').style.display = 'block';

    // EDIT HERE
    document.querySelector("#whitelisted").innerHTML = "";
}

function format_address(addr) {
  return (addr.substring(0, 5) + "..." + addr.substring(addr.length - 4));
}

window.addEventListener('load', async () => {
    init_wallet();
    document.querySelector("#btn-connect").addEventListener("click", onConnect);
    document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});