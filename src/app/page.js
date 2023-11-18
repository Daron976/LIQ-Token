import Image from "next/image";
import styles from "./page.module.css";
import logo from "../../public/Liquidus.svg";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { LIQABI } from "./api/utils/api-utils";

async function getData() {
  const contractAddress = "0x2749C9f2f8568d389BBF61ed77784A43C3cD3E19";
  const holderInfo = [
    "0x407993575c91ce7643a4d4ccacc9a98c36ee1bbe",
    "0xaf967c1a979d4600affce6bffbaeacfd165a1a2a",
    "0x2ddfda4a037836bb5f78075d6bc356d6ae06fd9b",
    "0x079ef53e8533fac72079930a34b380145f797471",
  ];
  let holderTotal = [];

  // web3 instance
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
  );

  // contract instance
  const tokenContract = new web3.eth.Contract(LIQABI, contractAddress);

  // token decimal
  const decimal = await tokenContract.methods.decimals().call();

  const decimalVal = Math.pow(10, BigNumber(decimal));

  // token contract
  const result = await tokenContract.methods.totalSupply().call();

  const convertedResult = new BigNumber(result).toFixed();

  const finalResult = (convertedResult / decimalVal).toFixed(2);

  // token balances
  for (let i = 0; i < holderInfo.length; i++) {
    await tokenContract.methods
      .balanceOf(holderInfo[i])
      .call()
      .then((res) => holderTotal.push(res));
  }

  const holderMaxTotal = holderTotal.reduce((a, b) => a + b);

  const convertedCirculation = new BigNumber(result - holderMaxTotal).toFixed();

  const finalCirculation = (convertedCirculation / decimalVal).toFixed(2);

  return { finalResult, finalCirculation };
}

export default async function Home() {
  const liquiData = await getData();
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Image
          src={logo}
          alt="liquidus Logo"
          className={styles.vercelLogo}
          width={100}
          height={24}
          priority
        />
      </div>
      <div className={styles.center}>
        <p>LIQ Token Total Supply : {liquiData.finalResult}</p>
        <p>
          LIQ Token Current Circulating Supply : {liquiData.finalCirculation}
        </p>
      </div>
    </main>
  );
}
