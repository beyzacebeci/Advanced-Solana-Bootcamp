import * as fs from 'fs';
import { Keypair, Connection, Transaction, PublicKey, SystemProgram } from '@solana/web3.js';

// Endpoint for connecting to the Solana network
const solanaEndpoint = 'https://api.devnet.solana.com';

//To store the created wallet information and balance, you can use a JSON file.
const walletFile = 'wallet.json';

async function main() {
    const args = process.argv.slice(2); // Take command line arguments.

    // Komut kontrolü
    if (args.length === 0) {
        console.log('Usage: node wallet.ts <komut>');
        return;
    }

    const command = args[0];
    if (command === 'new') {
        await createWallet();
    } else if (command === 'airdrop') {
        const amount = args[1] ? parseInt(args[1]) : 1;
        await airdrop(amount);
    } else if (command === 'balance') {
        await checkBalance();
    } else if (command === 'transfer') {
        const recipient = args[1];
        const amount = parseInt(args[2]);
        await transfer(recipient, amount);
    } else {
        console.log('Invalid command.');
    }
}

// Create a new wallet
async function createWallet() {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();

    const walletData = {
        publicKey,
        privateKey: keypair.secretKey.toString(),
        balance: 0
    };

    fs.writeFileSync(walletFile, JSON.stringify(walletData));
    console.log('A new wallet has been created and it has been saved to', walletFile);
}

//airdrop
async function airdrop(amount: number) {
    const connection = new Connection(solanaEndpoint, 'confirmed');
    const walletData = JSON.parse(fs.readFileSync(walletFile, 'utf-8'));
    const publicKey = new PublicKey(walletData.publicKey);

    await connection.requestAirdrop(publicKey, amount * 1000000000); // Convert the amount to nanos in SOL currency.

    console.log(amount, 'SOL airdrop completed.');
}

//balance control
async function checkBalance() {
    const connection = new Connection(solanaEndpoint, 'confirmed');
    const walletData = JSON.parse(fs.readFileSync(walletFile, 'utf-8'));
    const publicKey = new PublicKey(walletData.publicKey);

    const balance = await connection.getBalance(publicKey);
    console.log('Wallet Balance:', balance / 1000000000, 'SOL');
}

//transfer
async function transfer(recipient: string, amount: number) {
    const connection = new Connection(solanaEndpoint, 'confirmed');
    const walletData = JSON.parse(fs.readFileSync(walletFile, 'utf-8'));
    const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(walletData.privateKey)));
    const senderPublicKey = senderKeypair.publicKey;
    const recipientPublicKey = new PublicKey(recipient);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderPublicKey,
            toPubkey: recipientPublicKey,
            lamports: amount * 1000000000
        })
    );

    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    console.log('Transfer successfully completed. Transaction signature:', signature);
}

main().catch(err => console.error(err));
