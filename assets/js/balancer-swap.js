var provider;

if (window.ethereum != null) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
}

document.getElementById("buysell").querySelector(".left > button").onclick = function() { connect().then(() => { location.reload() }) };

const vault_address = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

const pool_1LETH_USDC = "0x6ee86e032173716a41818e6d6d320a752176d69700010000000000000000001c";
const oneLETH = "0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc".toLowerCase();
const usdc = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8".toLowerCase();

const token_data = {};
token_data[oneLETH] = { "symbol": "1L-ETH/USD", "decimals": "6", "limit": "0" };
token_data[usdc] = { "symbol": "USDC", "decimals": "6", "limit": "1" };

async function connect() {
  await ethereum.request({ method: 'eth_requestAccounts' });
  provider = new ethers.providers.Web3Provider(window.ethereum);
}

async function execute() {
  const signer = provider.getSigner();
  const vault_contract = new ethers.Contract(vault_address, abi, signer);
  const deadline = BigNumber(9999999);

  const swap = {
    "poolId": pool_1LETH_USDC,
    "assetIn": usdc,
    "assetOut": oneLETH,
    "amount": 1
  };
  const swap_type = 0; //given in

  const swap_struct = {
    poolId: swap["poolId"],
    kind: swap_type,
    assetIn: ethers.utils.getAddress(swap["assetIn"]),
    assetOut: ethers.utils.getAddress(swap["assetOut"]),
    amount: BigNumber(swap["amount"] * Math.pow(10, token_data[swap["assetIn"]]["decimals"])).toString(),
    userData: '0x'
  };

  const fund_struct = {
    sender: signer.getAddress(),
    fromInternalBalance: false,
    recipient: signer.getAddress(),
    toInternalBalance: false
  };

  const token_limit = BigNumber((token_data[swap["assetIn"]]["limit"]) * Math.pow(10, token_data[swap["assetIn"]]["decimals"])).toString();

  const single_swap_function = contract_vault.populateTransaction.swap(
    swap_struct,
    fund_struct,
    token_limit,
    deadline.toString()
  );
  buildAndSend(single_swap_function);
}

async function buildAndSend(single_swap_function) {
  var gas_estimate;
  try {
    gas_estimate = await single_swap_function.estimateGas();
  } catch(err) {
    gas_estimate = 200000;
    console.log("Failed to estimate gas, attempting to send with", gas_estimate, "gas limit...");
  }

  const tx_object = {
    'chainId':  42161,
    'gas':      ethers.utils.hexlify(gas_estimate),
    'data':     single_swap_function.encodeABI(),
    'to':       vault_address
  };

  signer.sendTransaction(single_swap_function);
}

function buy() {
  connect().then(() => {
    execute();
  })
}
