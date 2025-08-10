import React from 'react';
import { Flex, Box, Text, TextField, IconButton } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import './App.css';

export default class App extends React.Component {
  state = {
    conversation: [],
  }

  render() {
    return <Flex gap="3">
      <Box>
        <Text>
          AI chat
        </Text>
      </Box>
      <Box minWidth="1024" minHeight="600">
        {this.state.conversation}
      </Box>
      <Flex direction="row">
          <TextField.Root placeholder="Ask…" />
          <IconButton>
            <PaperPlaneIcon />
          </IconButton>
      </Flex>
    </Flex>
  }
}
