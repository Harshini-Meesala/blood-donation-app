from flask import Flask, request, jsonify, render_template
from web3 import Web3
import json

app = Flask(__name__)

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# 🔴 PASTE YOUR DETAILS HERE
contract_address = "0xd9145CCE52D386f254917e481eB44e9943F39138"

abi = [
    {
        "inputs": [
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "string", "name": "_bloodGroup", "type": "string"},
            {"internalType": "string", "name": "_location", "type": "string"}
        ],
        "name": "addDonor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "name": "donors",
        "outputs": [
            {"internalType": "string","name": "name","type": "string"},
            {"internalType": "string","name": "bloodGroup","type": "string"},
            {"internalType": "string","name": "location","type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCount",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256","name": "index","type": "uint256"}],
        "name": "getDonor",
        "outputs": [
            {"internalType": "string","name": "","type": "string"},
            {"internalType": "string","name": "","type": "string"},
            {"internalType": "string","name": "","type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
contract = web3.eth.contract(address=contract_address, abi=abi)
account = web3.eth.accounts[0]

@app.route('/add_donor')
def home():
    return render_template('index.html')

@app.route('/add_donor', methods=['POST'])
def add_donor():
    data = request.json

    tx_hash = contract.functions.addDonor(
        data['name'], data['blood'], data['location']
    ).transact({'from': account})

    web3.eth.wait_for_transaction_receipt(tx_hash)

    return jsonify({"message": "Donor Added Successfully"})

@app.route('/get_donors')
def get_donors():
    count = contract.functions.getCount().call()
    donors = []

    for i in range(count):
        d = contract.functions.getDonor(i).call()
        donors.append({
            "name": d[0],
            "blood": d[1],
            "location": d[2]
        })

    return jsonify(donors)

if __name__ == '__main__':
    app.run(debug=True)