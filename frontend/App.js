import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [wallet, setWallet] = useState(null);
  const [accountInfo, setAccountInfo] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [sendDetails, setSendDetails] = useState({ from: '', to: '', amount: '', privateKey: '' });
  const [stakeDetails, setStakeDetails] = useState({ address: '', amount: '' });

  // Create a new wallet
  const createWallet = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create_wallet');
      setWallet(response.data);
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  // View account statistics
  const getAccountInfo = async (address) => {
    try {
      const response = await axios.get(`http://localhost:3000/account_info/${address}`);
      setAccountInfo(response.data);
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  };

  // View transaction history
  const getTransactionHistory = async (address) => {
    try {
      const response = await axios.get(`http://localhost:3000/transaction_history/${address}`);
      setTransactionHistory(response.data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  // Send coins to another address
  const sendCoins = async () => {
    try {
      const response = await axios.post('http://localhost:3000/send_coins', sendDetails);
      alert('Transaction successful: ' + response.data.transactionHash);
    } catch (error) {
      console.error('Error sending coins:', error);
    }
  };

  // Stake coins
  const stakeCoins = async () => {
    try {
      const response = await axios.post('http://localhost:3000/stake', stakeDetails);
      alert('Stake successful: ' + response.data.stakeId);
    } catch (error) {
      console.error('Error staking coins:', error);
    }
  };

  return (
    <div>
      <h1>MyCoin Wallet</h1>
      
      {/* Wallet Creation Section */}
      <div>
        <h2>Create New Wallet</h2>
        <button onClick={createWallet}>Create Wallet</button>
        {wallet && (
          <div>
            <p>Address: {wallet.address}</p>
            <p>Private Key: {wallet.privateKey}</p>
          </div>
        )}
      </div>

      {/* Account Statistics Section */}
      <div>
        <h2>View Account Statistics</h2>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          onChange={(e) => getAccountInfo(e.target.value)}
        />
        {accountInfo && (
          <div>
            <p>Balance: {accountInfo.balance}</p>
            <button onClick={() => getTransactionHistory(accountInfo.address)}>View Transaction History</button>
          </div>
        )}
      </div>

      {/* Transaction Section */}
      <div>
        <h2>Send Coins</h2>
        <input
          type="text"
          placeholder="From Address"
          onChange={(e) => setSendDetails({ ...sendDetails, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To Address"
          onChange={(e) => setSendDetails({ ...sendDetails, to: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setSendDetails({ ...sendDetails, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Private Key"
          onChange={(e) => setSendDetails({ ...sendDetails, privateKey: e.target.value })}
        />
        <button onClick={sendCoins}>Send Coins</button>
      </div>

      {/* Stake Coins Section */}
      <div>
        <h2>Stake Coins</h2>
        <input
          type="text"
          placeholder="Wallet Address"
          onChange={(e) => setStakeDetails({ ...stakeDetails, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount to Stake"
          onChange={(e) => setStakeDetails({ ...stakeDetails, amount: e.target.value })}
        />
        <button onClick={stakeCoins}>Stake</button>
      </div>

      {/* Transaction History Section */}
      {transactionHistory.length > 0 && (
        <div>
          <h2>Transaction History</h2>
          <ul>
            {transactionHistory.map((tx, index) => (
              <li key={index}>
                ID: {tx.id}, To: {tx.to}, Amount: {tx.amount}, Date: {tx.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
