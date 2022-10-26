import { Text } from "react-native";
import styled from "styled-components";

export const ErrorText = styled(Text)`
  color: ${(props) => props.theme.colors.text.error};
`;

export const Label = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.label};
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const LinkedLabel = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.label};
  font-weight: ${(props) => props.theme.fontWeights.bold}
  color: ${(props) => props.theme.colors.text.link};
`;
