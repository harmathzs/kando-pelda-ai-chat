import React from 'react';
import { Flex, Box, Text, TextField, IconButton } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
//import './App.css';

export default class App extends React.Component {
  state = {
    conversation: [],
    question: '',
    answer: '',
    model: 'deepseek-r1-distill-llama-70b',
    messages: []
  };

  sendQuestion = e => {
    //console.log('sendQuestion state', this.state);
    const question = this.state.question;
    console.log('sendQuestion question', question);
  }

  handleEnter = e => {
    if (e.key == 'Enter') this.sendQuestion(null);
  }

  render() {
    return (
      <Flex direction="column" height="100vh" p="3" gap="3" style={{margin: '10px'}}>
        {/* Header */}
        <Box>
          <Text size="4" weight="bold">
            AI Chat
          </Text>
        </Box>

        {/* Conversation area */}
        <Box
          flex="1" // fills remaining available space
          style={{
            minWidth: 1024,
            minHeight: 600,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px",
            overflowY: "auto",
            backgroundColor: "#fafafa"
          }}
        >
          {this.state.conversation.length === 0 ? (
            <Text color="gray">No messages yet…</Text>
          ) : (
            this.state.conversation.map((msg, i) => (
              <Text key={i} as="p">{msg}</Text>
            ))
          )}
        </Box>

        {/* Input bar */}
        <Box onKeyDown={this.handleEnter}>
          <p>
            <input type="text" id="inputQuestion" name="inputQuestion" placeholder="Ask…"
            style={{minWidth: '90vw', minHeight: '40px'}}
            onChange={e=>this.setState({question: e.target.value})} />
            <IconButton onClick={this.sendQuestion}>
              <PaperPlaneIcon />
            </IconButton>
          </p>
        </Box>
      </Flex>
    );
  }
}
