let web3;
let contract;

// 🔴 UPDATE THIS AFTER EVERY REDEPLOY (IMPORTANT)
const contractAddress = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47";

// 🔴 ABI
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_bloodGroup", "type": "string" },
            { "internalType": "uint256", "name": "_age", "type": "uint256" }
        ],
        "name": "registerDonor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_patientName", "type": "string" },
            { "internalType": "string", "name": "_bloodGroup", "type": "string" }
        ],
        "name": "requestBlood",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDonors",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "bloodGroup", "type": "string" },
                    { "internalType": "uint256", "name": "age", "type": "uint256" },
                    { "internalType": "address", "name": "donorAddress", "type": "address" }
                ],
                "internalType": "tuple[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequests",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "patientName", "type": "string" },
                    { "internalType": "string", "name": "bloodGroup", "type": "string" },
                    { "internalType": "address", "name": "requester", "type": "address" }
                ],
                "internalType": "tuple[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// ✅ CONNECT METAMASK
async function loadBlockchain() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);

            await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            contract = new web3.eth.Contract(abi, contractAddress);

            console.log("Connected to blockchain ✅");
        } catch (error) {
            console.error("Connection error:", error);
        }
    } else {
        alert("Install MetaMask!");
    }
}

// 🩸 ADD DONOR
async function addDonor() {
    try {
        const accounts = await web3.eth.getAccounts();

        const name = document.getElementById("name").value;
        const blood = document.getElementById("blood").value;

        if (!name || !blood) {
            alert("Fill all fields");
            return;
        }

        console.log("Adding donor...");

        await contract.methods
            .registerDonor(name, blood, 21)
            .send({ from: accounts[0] });

        alert("Donor added successfully ✅");

    } catch (error) {
        console.error("Add donor error:", error);
        alert("Transaction failed ❌");
    }
}

// 📋 GET DONORS (FINAL FIXED)
async function getDonors() {
    try {
        console.log("Fetching donors...");

        const donors = await contract.methods.getDonors().call();

        console.log("Donors data:", donors); // 🔥 DEBUG LINE

        let list = document.getElementById("list");
        list.innerHTML = "";

        if (donors.length === 0) {
            list.innerHTML = "<li>No donors found</li>";
            return;
        }

        donors.forEach(d => {
            let li = document.createElement("li");

            li.innerText =
                "Name: " + d.name +
                " | Blood: " + d.bloodGroup +
                " | Age: " + d.age +
                " | Wallet: " + d.donorAddress;

            list.appendChild(li);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Error fetching donors ❌");
    }
}

// 🩸 REQUEST BLOOD
async function requestBlood() {
    try {
        const accounts = await web3.eth.getAccounts();

        const patient = document.getElementById("patient").value;
        const blood = document.getElementById("reqBlood").value;

        if (!patient || !blood) {
            alert("Fill all fields");
            return;
        }

        await contract.methods
            .requestBlood(patient, blood)
            .send({ from: accounts[0] });

        alert("Blood request added ✅");

    } catch (error) {
        console.error("Request error:", error);
        alert("Request failed ❌");
    }
}

// 📋 GET REQUESTS
async function getRequests() {
    try {
        const requests = await contract.methods.getRequests().call();

        let list = document.getElementById("requestsList");
        list.innerHTML = "";

        if (requests.length === 0) {
            list.innerHTML = "<li>No requests found</li>";
            return;
        }

        requests.forEach(r => {
            let li = document.createElement("li");

            li.innerText =
                "Patient: " + r.patientName +
                " | Blood: " + r.bloodGroup +
                " | Wallet: " + r.requester;

            list.appendChild(li);
        });

    } catch (error) {
        console.error("Fetch requests error:", error);
        alert("Error fetching requests ❌");
    }
}

// 🔄 AUTO LOAD
window.onload = loadBlockchain;