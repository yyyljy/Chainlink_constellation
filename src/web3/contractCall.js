import { ethers } from "ethers";
import abiFile from "./abi/contracts/dataFeed/AggregatorV3Interface.sol/AggregatorV3Interface.json";

export default async function getPriceData() {
  const fujiAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
  const mumbaiAddress = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    window.ethereum
      .enable()
      .then(async (accounts) => {
        const signer = await provider.getSigner(accounts[0]);
        const fujiContract = new ethers.Contract(
          fujiAddress,
          abiFile.abi,
          signer
        );
        const mumbaiContract = new ethers.Contract(
          mumbaiAddress,
          abiFile.abi,
          signer
        );
        const avaxPrice = fujiContract.latestRoundData();
        const maticPrice = mumbaiContract.latestRoundData();
        Promise.all([avaxPrice, maticPrice])
          .then((values) => {
            console.log(`${values[0][1]}`, `${values[1][1]}`);
            return values;
          })
          .catch((e) => {
            console.error(e);
            return undefined;
          });
      })
      .catch((error) => {
        console.error("계정 접근 권한이 거부되었습니다.", error);
        return { undefined };
      });
  } else {
    console.error("MetaMask가 설치되어 있지 않습니다.");
    return { undefined };
  }
}
