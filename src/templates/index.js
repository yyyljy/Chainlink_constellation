import {
  Box,
  Button,
  Flex,
  Divider,
  Spacer,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import getPriceData from "../web3/contractCall";

export default function MainTemplate() {
  const INITIAL_INTERVAL = 30;
  const [isFeeding, setIsFeeding] = useState(false);
  const [feedInterval, setFeedInterval] = useState(INITIAL_INTERVAL);
  const [avax, setAvax] = useState(0);
  const [matic, setMatic] = useState(0);

  const getPrice = async () => {
    try {
      const response = await getPriceData();
      if (!response) {
        console.error(response);
        return { err: "getPriceData() response Error", data: undefined };
      }
      const avaxContract = response.data.avaxContract;
      const maticContract = response.data.maticContract;
      const avaxPrice = avaxContract.latestRoundData();
      const avaxDecimal = avaxContract.decimals();
      const maticPrice = maticContract.latestRoundData();
      const maticDecimal = maticContract.decimals();
      Promise.all([avaxPrice, avaxDecimal, maticPrice, maticDecimal])
        .then((values) => {
          const avaxToDollar = Number(values[0][1]) / 10 ** Number(values[1]);
          const maticToDollar = Number(values[2][1]) / 10 ** Number(values[3]);
          setAvax(avaxToDollar);
          setMatic(maticToDollar);
          setIsFeeding(true);
        })
        .catch((e) => {
          console.error(e);
          return { err: e.message, data: undefined };
        });
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFeedInterval((prevInterval) => {
        const newInterval = prevInterval - 1;
        if (newInterval === 0) {
          setFeedInterval(INITIAL_INTERVAL);
          setAvax(`-`);
          setMatic(`-`);
          setIsFeeding(false);
        } else {
          return newInterval;
        }
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Box>
      <Box>
        <Button
          isDisabled={isFeeding}
          onClick={async () => {
            await getPrice();
            setFeedInterval(INITIAL_INTERVAL);
            setIsFeeding(!isFeeding);
          }}
        >
          <Text>
            {isFeeding ? `Valid time : ${feedInterval}` : `Get Price Feed`}
          </Text>
        </Button>
        <Divider borderWidth={"3px"} />
      </Box>
      <Box>
        <Flex justifyContent={"center"}>
          <TableContainer>
            <Table margin={"10px"} variant="simple" width={"50vh"}>
              <TableCaption>Chainlink Price Feed</TableCaption>
              <Thead>
                <Tr>
                  <Th>FROM </Th>
                  <Th>into</Th>
                  <Th isNumeric>ratio</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>AVAX</Td>
                  <Td>USD</Td>
                  <Td isNumeric>{avax}</Td>
                </Tr>
                <Tr>
                  <Td>Matic</Td>
                  <Td>USD</Td>
                  <Td isNumeric>{matic}</Td>
                </Tr>
                <Tr>
                  <Td>AVAX</Td>
                  <Td>Matic</Td>
                  <Td isNumeric>{matic}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
        <Divider borderWidth={"3px"} />
        <Flex direction={"row"} height={"100vh"}>
          <Flex
            direction={"column"}
            w={"50%"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
          >
            <Text alignSelf={"center"}>Avalanche</Text>
            <Text>1. Deploy CA at Polygon Network with CCIP (ERC-4337)</Text>
            <Button>1-1. get expected CA</Button>
            <br />
            <Text>2. Set Message</Text>
            <Text>3. Send Message to EntryPoint with CCIP</Text>
          </Flex>

          <Spacer />

          <Box>
            <Divider
              borderWidth={"3px"}
              borderStyle={"dashed"}
              orientation="vertical"
            />
          </Box>

          <Spacer />

          <Flex
            direction={"column"}
            w={"50%"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
          >
            <Text alignSelf={"center"}>Polygon</Text>
            <br />
            <Text>1-1. Deployed CA</Text>
            <br />
            <br />
            <Text>3-1. EntryPoint Call CA</Text>
            <Text>3-2. CA receive Message</Text>
          </Flex>
        </Flex>
        <Box>test</Box>
      </Box>
    </Box>
  );
}
