import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const endpoint = params.endpoint;
  const contractAddress = "0x2749C9f2f8568d389BBF61ed77784A43C3cD3E19";

  switch (endpoint) {
    case "total_supply":
      const res = await fetch(
        `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
      );
      const data = await res.json();
      return Response.json(data);
    case "circulating_supply":
      let holderTotal = [];
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
      for (let i = 0; i < holderInfo.length; i++) {
        await fetch(
          `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${holderInfo[i].address}&tag=latest&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
        )
          .then((res) => res.json())
          .then((json) => holderTotal.push(BigInt(json.result)));
      }
      const holderMaxTotal = holderTotal.reduce((a, b) => a + b);

      const tsupply = await fetch(
        `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
      );
      const result = await tsupply.json();

      const circulation = BigInt(result.result) - holderMaxTotal;

      return Response.json({
        status: 1,
        message: "ok",
        result: BigInt(circulation).toString(),
      });
    default:
      redirect("/");
  }
}

// async function getData() {

//   for (let i = 0; i < holderInfo.length; i++) {
//     await fetch(
//       `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${holderInfo[i].address}&tag=latest&apikey=SYTBNFA6AVVKBHFQPUASSDQZY8FXWY3TA5`
//     )
//       .then((res) => res.json())
//       .then((json) => holderTotal.push(parseInt(json.result)));
//   }
//   const holderMaxTotal = holderTotal.reduce((a, b) => a + b);
//   return { contractResult, holderMaxTotal };
// }
