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
  const INITIAL_INTERVAL = 3;
  const [isFeeding, setIsFeeding] = useState(false);
  const [feedInterval, setFeedInterval] = useState(INITIAL_INTERVAL);
  const [avax, setAvax] = useState(0);
  const [matic, setMatic] = useState(0);

  const getPrice = async () => {
    const result = await getPriceData().then((value) => {
      console.log("result");
      console.log(value);
    });
    if (result) {
      setAvax(result.avaxPrice);
      setMatic(result.maticPrice);
      setIsFeeding(true);
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
      <Text>{feedInterval}</Text>
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
        <Flex direction={"row"} height={"100vh"}>
          <Flex direction={"column"} w={"50%"} justifyContent={"flex-start"}>
            <Text>Avalanche - Fuji</Text>

            <TableContainer>
              <Table variant="simple" width={"90%"}>
                <TableCaption>
                  Chainlink Price Feed <br />{" "}
                  0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>FROM</Th>
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
                </Tbody>
              </Table>
            </TableContainer>
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

          <Flex direction={"column"} w={"50%"} justifyContent={"flex-start"}>
            <Text>Polygon - Mumbai</Text>

            <TableContainer>
              <Table variant="simple">
                <TableCaption>
                  Chainlink Price Feed <br />
                  0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>FROM</Th>
                    <Th>into</Th>
                    <Th isNumeric>ratio</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Matic</Td>
                    <Td>USD</Td>
                    <Td isNumeric>{matic}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
