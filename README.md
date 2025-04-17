This is the frontend repository for the GiftCard dApp demo, which interacts with the smart contract found at
https://github.com/tawangithub/DAppGiftCardContractDemo

## Prerequisites
Before getting started, make sure you’ve already cloned and deployed the smart contract from the repository above on your local network by following its README.md.
Once deployed, you’ll find the contract address in your terminal log:
```
GiftCardLogic (Proxy) deployed at: 0x####################
```

You’ll need this address in the next step.

## Getting Started (Local Development)

Note: This project requires Node.js version v20.11.1 or higher to run properly.

### 1. Configure environment variables

Copy the example environment file .env.example.local to a new `.env` file:

```bash
cp .env.example.local .env
```

Then, update the value of NEXT_PUBLIC_CONTRACT_ADDRESS in the .env file with the deployed contract address you retrieved earlier.

Note: For running in local, the NEXT_PUBLIC_CONTRACT_ADDRESS is only config you need to set.

### 2. Start the development server
Run the development server using your preferred package manager:


```bash
yarn install
yarn dev
# or
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. connect your browser to Metamask or your wallet choice via our rainbowKit UI