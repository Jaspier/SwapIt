import styled from "styled-components";
import { View, Text } from "react-native";

export const Card = styled(View)<{ modal: boolean }>`
  position: relative;
  background-color: white;
  width: ${(props) => (props.modal ? "90%" : "100%")};
  height: ${(props) => (props.modal ? "65%" : "75%")};
  border-radius: 12px;
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
`;

export const CardFooter = styled(View)`
  position: absolute;
  flex-direction: row;
  bottom: 0;
  background-color: white;
  width: 100%;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const ItemName = styled(Text)`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
`;

export const LocationText = styled(Text)`
  font-size: 16px;
  line-height: 32px;
  font-weight: 700;
`;
