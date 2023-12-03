import { ethers } from "ethers";
import abiFile from "./abi/contracts/dataFeed/AggregatorV3Interface.sol/AggregatorV3Interface.json";

export default async function getPriceData() {
  try {
    // POLYGON MAINNET
    const avaxAddress = "0xe01ea2fbd8d76ee323fbed03eb9a8625ec981a10";
    const maticAddress = "0xab594600376ec9fd91f8e885dadf0ce036862de0";
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      const signer = await provider.getSigner(account);
      const avaxContract = new ethers.Contract(
        avaxAddress,
        abiFile.abi,
        signer
      );
      const maticContract = new ethers.Contract(
        maticAddress,
        abiFile.abi,
        signer
      );
      return {
        err: undefined,
        data: { avaxContract: avaxContract, maticContract: maticContract },
      };
    }
  } catch (e) {
    console.log(e.message);
    return { err: e.message, data: undefined };
  }
}
