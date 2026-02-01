import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Flex, Box, Text, TextField, IconButton, Spinner, ScrollArea, Strong } from "@radix-ui/themes";
import { PaperPlaneIcon, FaceIcon } from "@radix-ui/react-icons";
//import './App.css';
import { Mistral } from '@mistralai/mistralai';

export default class App extends React.Component {
  state = {
    isLoading: false,
    mistralAiApiKey: '',
    mistralClient: null,
    conversation: {
      model: 'devstral-small-latest',
      messages: [],
    },
    question: '',
  };

  componentDidMount() {
    const mistralAiApiKey = import.meta.env.VITE_MISTRAL_AI_API_KEY
    // console.log('mistralAiApiKey.length', mistralAiApiKey.length) // should be around 32

    this.mistralClient = new Mistral({apiKey: mistralAiApiKey});
    // console.log('mistralClient', this.mistralClient)

    this.setState({mistralAiApiKey, mistralClient: this.mistralClient})
  }

  sendQuestion = async () => {
    //console.log('sendQuestion state', this.state);
    const question = this.state.question;
    //console.log('sendQuestion question', question);

    const requestBodyObj = {...this.state.conversation};
    requestBodyObj.messages.push({role: 'user', content: question})
    //console.log('requestBodyObj', requestBodyObj)

    await fetch('http://localhost:3333/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({role: 'user', message_content: question})
    })

    const mistralClient = this.state.mistralClient;
    this.setState({isLoading: true});
    const chatResponse = await mistralClient.chat.complete(requestBodyObj);
    this.setState({isLoading: false});
    //console.log('chatResponse', chatResponse)

    // Update conversation with response
    const updatedMessages = [...requestBodyObj.messages, 
      {role: 'assistant', content: chatResponse.choices[0].message.content}
    ];
    //console.log('updatedMessages', updatedMessages)

    await fetch('http://localhost:3333/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({role: 'assistant', message_content: chatResponse.choices[0].message.content})
    })

    this.setState({conversation: {...this.state.conversation, messages: updatedMessages}});    
  }

  handleEnter = e => {
    if (e.key == 'Enter') this.sendQuestion();
  }

  render() {
    return (
      <Flex direction="column" height="100vh" p="3" gap="3" style={{margin: '10px'}}>
        {/* Header */}
        <Box>
          <Text size="4" weight="bold">
            <Strong>AI Chat</Strong>
          </Text>
        </Box>

        {/* Conversation area */}
        <div 
          type="always" 
          scrollbars="vertical"
          style={{
            flex: 1,                    // fills remaining height
            overflowY: 'auto',
            height: '600px',
            
            border: "1px solid #ccc",
            borderRadius: 8,
            backgroundColor: "#fafafa"
          }}
        >
          <Box p="2" style={{padding: '2px'}}>
            {this.state.conversation.messages.length === 0 ? (
              <Text color="gray">No messages yet…</Text>
            ) : (
              this.state.conversation.messages.map((msg, i) => {

                // Remove <think>...</think>
                const cleaned = msg.content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                return (
                  <div key={i}>
                    <h5><FaceIcon /> {msg.role}</h5>
                    <ReactMarkdown>{cleaned}</ReactMarkdown>
                  </div>
                );

              })
            )}
          </Box>
        </div>


        {/* Input bar or Spinner */}

        {this.state.isLoading ? <p>&#x23F3; LOADING &#x23F3; </p> :

          <Box onKeyDown={this.handleEnter}>
            <p>
              <input type="text" id="inputQuestion" name="inputQuestion" placeholder="Ask…"
              style={{minWidth: '90vw', minHeight: '40px'}}
              onChange={e=>this.setState({question: e.target.value})} />
              <IconButton onClick={this.sendQuestion} id='btnSend' name='btnSend' aria-label='btnSend'>
                <PaperPlaneIcon />
              </IconButton>
            </p>
          </Box>

        }


      </Flex>
    );
  }
}
