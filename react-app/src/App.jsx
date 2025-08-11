import React from 'react';
import { Flex, Box, Text, TextField, IconButton, Spinner } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
//import './App.css';
import groqApiKey from './groqkey';

export default class App extends React.Component {
  state = {
    isLoading: false,
    conversation: {
      model: 'deepseek-r1-distill-llama-70b',
      messages: [],
    },
    question: '',
  };

  sendQuestion = e => {
    //console.log('sendQuestion state', this.state);
    const question = this.state.question;
    console.log('sendQuestion question', question);

    const requestBodyObj = {...this.state.conversation};
    // append question to messages[]
    requestBodyObj.messages.push({
          role: "user",
          content: question
        });
    this.setState(prevState => ({
      conversation: {
        ...prevState.conversation, // keep model and other props
        messages: [...requestBodyObj.messages]
      }
    }));

    const requestBodyJson = JSON.stringify(requestBodyObj);

    this.setState({isLoading: true});
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer '+groqApiKey
      },
      body: requestBodyJson
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res);
      // append answer to messages[]
      this.setState(prevState => ({
        conversation: {
          ...prevState.conversation,
          messages: [
            ...prevState.conversation.messages,
            res.choices[0].message
          ]
        }
      }));
    })
    .catch(console.warn)
    .finally(()=>this.setState({isLoading: false}));
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
          {this.state.conversation.messages.length === 0 ? (
            <Text color="gray">No messages yet…</Text>
          ) : (
            this.state.conversation.messages.map((msg, i)=>(
              <div key={i}>
                <h5>{msg.role}</h5>
                <p>{msg.content}</p>
              </div>
            ))
          )}
        </Box>

        {/* Input bar or Spinner */}

        {this.state.isLoading ? <p>&#x23F3; LOADING &#x23F3; </p> :

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

        }


      </Flex>
    );
  }
}
