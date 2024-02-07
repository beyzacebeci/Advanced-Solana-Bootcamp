# Advanced Solana Bootcamp 1st Assignment - TypeScript - Web3.js

## Installation

1. Install TypeScript:

    ```bash
    npm i -g typescript
    ```

2. Initialize TypeScript configuration:

    ```bash
    tsc --init
    ```

3. Compile the wallet script:

    ```bash
    tsc wallet.ts
    ```

## Available Commands

### `new`

Create a new wallet and save its JSON file in the local directory.

```bash
node wallet.js new
```

### `balance`

Check the balance of the wallet, if it exists.

```bash
node wallet.js balance
```

### `airdrop [amount]`

Send the desired amount of SOL (such as 0.1 SOL) to the specified wallet.

```bash
node wallet.js airdrop [amount]
```

### `transfer [otherPublicKey] [amount]`

Transfer SOL from one wallet to another with the specified amount.

```bash
node wallet.js transfer [otherPublicKey] [amount]
```
