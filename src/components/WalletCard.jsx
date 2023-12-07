
import React, {useState} from 'react'
import {ethers} from 'ethers'
import '../App.css';


const WalletCard = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [signResult, setSignResult] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	const signMessageHandler = async () => {
		const exampleMessage = 'Example `personal_sign` message.';
		try {
		  const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
		  const sign = await window.ethereum.request({
			method: 'personal_sign',
			params: [msg, defaultAccount],
		  });
		  setSignResult(sign);
		} catch (err) {
		  console.error(err);
		  setSignResult(`Error: ${err.message}`);
		}
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
	
	return (
		<div className='container'>
			<div >
				{!defaultAccount ? <button onClick={connectWalletHandler}>
				<p>{connButtonText}</p></button> :  defaultAccount.slice(0, 6) + '...' + defaultAccount.slice(-4)}

			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
			{errorMessage}

			<button onClick={signMessageHandler} className='btn'>Sign Message</button>
			<div className='signDisplay'>
				<h3>Signature: {signResult}</h3>
				</div>
		</div>
	);
}

export default WalletCard;