import { RenameWalletInput, CreateWalletInput, SignInput, VerifyInput, AddUserInput, AddKeyInput, ListKeysInput, ResetInput, RemoveKeyInput, EncryptOutput, DecryptOutput, SignOutput, VerifyOutput} from "./wallet/inputs/types";
import { Wallet } from "./wallet/wallet";
import { emit, revert } from "./klave/types";

/**
 * @transaction rename an Wallet in the wallet
 * @param oldName: string
 * @param newName: string
 */
export function renameWallet(input: RenameWalletInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    wallet.rename(input.newName);
    wallet.save();
}

/**
 * @transaction create an Wallet in the wallet
 * @param input containing the following fields:
 * - name: string
 * - hiddenOnUI: boolean
 * - customerRefId: string
 * - autoFuel: boolean
 */
export function createWallet(input: CreateWalletInput): void {
    let existingWallet = Wallet.load();
    if (existingWallet) {
        revert(`Wallet does already exists.`);        
        return;
    }
    let wallet = new Wallet();
    wallet.create(input.name);
    wallet.save();
}

/**
 * @transaction clears the wallet
 */
export function reset(input: ResetInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    wallet.reset(input.keys);
    wallet.save();
}

/**
 * @query
 * @param input containing the following fields:
 * - keyId: string
 * - payload: string
 */
export function sign(input: SignInput) : void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    let signature = wallet.sign(input.keyId, input.payload);
    if (signature == null) {
        revert("Failed to sign");
        return;
    }
    emit(signature);
}

/**
 * @query 
 * @param input containing the following fields:
 * - keyId: string
 * - payload: string
 * - signature: string
 */
export function verify(input: VerifyInput) : void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    let result = wallet.verify(input.keyId, input.payload, input.signature);
    if (!result) {
        revert(`Failed to verify`);
        return;
    }
    emit("verified");
}

/**
 * @transaction add a user to the wallet
 * @param userId: string
 */
export function addUser(input: AddUserInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    if (wallet.addUser(input.userId, input.role, false)) {
        wallet.save();
    }
}

/**
 * @transaction remove a user from the wallet
 * @param userId: string
 */
export function removeUser(userId: string): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    if (wallet.removeUser(userId)) {
        wallet.save();
    }
}

/**
 * @transaction add a key to the wallet
 * @param keyId: string
 */
export function addKey(input: AddKeyInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    if (wallet.addKey(input.description, input.type)) {
        wallet.save();
    }
}

/**
 * @transaction remove a key from the wallet
 * @param keyId: string
 */
export function removeKey(input: RemoveKeyInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    if (wallet.removeKey(input.keyId)) {
        wallet.save();
    }
}

/**
 * @query list all keys in the wallet
 */
export function listKeys(input: ListKeysInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    wallet.listKeys(input.user);
}

/**
 * @query 
 * @param keyId: string
 * @param message: string
 */
export function encrypt(input: SignInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    let encrypted = wallet.encrypt(input.keyId, input.payload);
    if (encrypted == null) {
        revert("Failed to encrypt");
        return;
    }
    emit(encrypted);    
}

/**
 * @query 
 * @param keyId: string
 * @param cypher: string
 */
export function decrypt(input: SignInput): void {
    let wallet = Wallet.load();
    if (!wallet) {
        return;
    }
    let decrypted = wallet.decrypt(input.keyId, input.payload);
    if (decrypted == null) {
        revert("Failed to decrypt");
        return;
    }
    emit(decrypted);
}