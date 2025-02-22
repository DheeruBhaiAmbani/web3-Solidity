const contractAddress = "0xEeC035e1620514965Ce00fF70583a70f662D7F1C"; // Replace with deployed contract address
const contractABI = [
	{
		"inputs": [],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donations",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDonations",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let web3;
let contract;
let userAccount;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];

        contract = new web3.eth.Contract(contractABI, contractAddress);

        document.getElementById("contractAddress").innerText = contractAddress;
        updateDonations();
    } else {
        alert("Please install MetaMask!");
    }
}

async function updateDonations() {
    const totalDonations = await contract.methods.totalDonations().call();
    document.getElementById("totalDonations").innerText = web3.utils.fromWei(totalDonations, "ether") + " ETH";

    const userDonations = await contract.methods.donations(userAccount).call();
    document.getElementById("yourDonations").innerText = web3.utils.fromWei(userDonations, "ether") + " ETH";
}

async function donate() {
    try {
        const amount = web3.utils.toWei("0.1", "ether");
        await contract.methods.donate().send({ from: userAccount, value: amount });
        document.getElementById("statusMessage").innerText = "Donation successful!";
        updateDonations();
    } catch (error) {
        document.getElementById("statusMessage").innerText = "Transaction failed!";
        console.error(error);
    }
}

async function withdraw() {
  try {
      const owner = await contract.methods.owner().call();
      if (userAccount.toLowerCase() !== owner.toLowerCase()) {
          alert("Only the owner can withdraw funds.");
          return;
      }

      // Get contract balance before withdrawing
      const contractBalance = await web3.eth.getBalance(contractAddress);
      if (contractBalance === "0") {
          alert("No funds available to withdraw.");
          return;
      }

      // Call the withdraw function
      await contract.methods.withdraw().send({ from: userAccount });

      document.getElementById("statusMessage").innerText = "Withdrawal successful!";
      updateDonations();
  } catch (error) {
      document.getElementById("statusMessage").innerText = "Withdrawal failed!";
      console.error(error);
  }
}


window.onload = init;
