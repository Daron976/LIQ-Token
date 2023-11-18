import { notFound } from "next/navigation";
import { LIQABI } from "../../utils/api-utils";
import Web3 from "web3";
import BigNumber from "bignumber.js";

export async function GET(request, { params }) {
  const endpoint = params.endpoint;
  const contractAddress = "0x2749C9f2f8568d389BBF61ed77784A43C3cD3E19";
  const holderInfo = [
    "0x407993575c91ce7643a4d4ccacc9a98c36ee1bbe",
    "0xaf967c1a979d4600affce6bffbaeacfd165a1a2a",
    "0x2ddfda4a037836bb5f78075d6bc356d6ae06fd9b",
    "0x079ef53e8533fac72079930a34b380145f797471",
  ];

  // web3 instance
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
  );

  // contract instance
  const tokenContract = new web3.eth.Contract(LIQABI, contractAddress);

  const result = await tokenContract.methods.totalSupply().call();

  // token decimal
  const decimal = await tokenContract.methods.decimals().call();

  const decimalVal = Math.pow(10, BigNumber(decimal));

  // api responses
  switch (endpoint) {
    case "total_supply":
      const convertedResult = new BigNumber(result).toFixed();

      const finalResult = (convertedResult / decimalVal).toFixed(2);

      return Response.json({
        status: 1,
        message: "ok",
        result: parseFloat(finalResult),
      });

    case "circulating_supply":
      let holderTotal = [];

      for (let i = 0; i < holderInfo.length; i++) {
        await tokenContract.methods
          .balanceOf(holderInfo[i])
          .call()
          .then((res) => holderTotal.push(res));
      }

      const holderMaxTotal = holderTotal.reduce((a, b) => a + b);

      const convertedCirculation = new BigNumber(
        result - holderMaxTotal
      ).toFixed();

      const finalCirculation = (convertedCirculation / decimalVal).toFixed(2);

      return Response.json({
        status: 1,
        message: "ok",
        result: parseFloat(finalCirculation),
      });

    default:
      notFound();
  }
}
