import Image from "next/image";
import styles from "./page.module.css";
import logo from "../../public/Liquidus.svg";

async function getData() {
  const contractAddress = "0x2749C9f2f8568d389BBF61ed77784A43C3cD3E19";
  const holderInfo = [
    {
      contractAddress,
      address: "0x407993575c91ce7643a4d4ccacc9a98c36ee1bbe",
    },
    {
      contractAddress,
      address: "0xaf967c1a979d4600affce6bffbaeacfd165a1a2a",
    },
    {
      contractAddress,
      address: "0x2ddfda4a037836bb5f78075d6bc356d6ae06fd9b",
    },
    {
      contractAddress,
      address: "0x079ef53e8533fac72079930a34b380145f797471",
    },
  ];

  let holderTotal = [];

  const contractResult = await fetch(
    `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
  )
    .then((res) => res.json())
    .then((json) => json.result);

  for (let i = 0; i < holderInfo.length; i++) {
    await fetch(
      `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${holderInfo[i].address}&tag=latest&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
    )
      .then((res) => res.json())
      .then((json) => holderTotal.push(BigInt(json.result)));
  }
  const holderMaxTotal = holderTotal.reduce((a, b) => a + b);

  const circulation = BigInt(contractResult) - holderMaxTotal;
  return { contractResult, circulation };
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
        <p>
          LIQ Token Total Supply : {liquiData.contractResult}
        </p>
        <p>
          LIQ Token Current Circulating Supply :{" "}
          {BigInt(liquiData.circulation).toString()}
        </p>
      </div>
    </main>
  );
}
