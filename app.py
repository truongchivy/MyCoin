from flask import Flask, request, jsonify
from web3 import Web3
import json
import datetime

app = Flask(__name__)

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

# Mock storage for wallets and transactions
wallets = {}
transactions = []

@app.route('/create_wallet', methods=['POST'])
def create_wallet():
    account = w3.eth.account.create()
    private_key = account.key.hex()  # Get private key
    address = account.address
    wallets[address] = private_key
    return jsonify({'address': address, 'privateKey': private_key})

@app.route('/account_info/<address>', methods=['GET'])
def account_info(address):
    balance = w3.eth.get_balance(address)
    return jsonify({'balance': w3.fromWei(balance, 'ether')})

@app.route('/send_coins', methods=['POST'])
def send_coins():
    data = request.json
    from_address = data['from']
    to_address = data['to']
    amount = w3.toWei(float(data['amount']), 'ether')
    private_key = data['privateKey']
    
    transaction = {
        'to': to_address,
        'value': amount,
        'gas': 2000000,
        'gasPrice': w3.toWei('1', 'gwei'),
        'nonce': w3.eth.get_transaction_count(from_address),
    }
    
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    transaction_id = tx_hash.hex()

    # Store transaction
    transactions.append({
        'id': transaction_id,
        'to': to_address,
        'amount': float(data['amount']),
        'date': datetime.datetime.now().isoformat()
    })
    
    return jsonify({'transactionHash': transaction_id})

@app.route('/transaction_history/<address>', methods=['GET'])
def transaction_history(address):
    return jsonify([tx for tx in transactions if tx['to'] == address])

if __name__ == '__main__':
    app.run(debug=True)
