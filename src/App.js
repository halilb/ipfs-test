import React, { Component } from 'react';
import JSONTree from 'react-json-tree';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      node: null,
      data: null,
    };
  }

  componentDidMount() {
    this.initNode();
  }

  initNode() {
    const repoPath = 'ipfs-' + Math.random();
    // Create an IPFS node
    const node = new window.Ipfs({
      init: false,
      start: false,
      repo: repoPath,
    });
    node.init(() => {
      node.start(() => {
        this.fetchData(node);
        this.setState({
          connected: true,
          node,
        });
      });
    });
  }

  fetchData(node) {
    node.files.cat(
      'QmZ7UVp6gb2Lqq8YGZpwhQP6oQYXejsRhFYroupK9pnVKe',
      (err, stream) => {
        let res = '';

        stream.on('data', chunk => {
          res += chunk.toString();
        });

        stream.on('error', err => {
          console.error('Error - ipfs files cat ', err);
        });

        stream.on('end', () => {
          this.setState({
            data: JSON.parse(res),
          });
        });
      }
    );
  }

  render() {
    const { connected, data } = this.state;

    let status;
    if (connected) {
      if (!data) {
        status = 'Fetching Data';
      }
    } else {
      status = 'Connecting';
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{status}</h2>
        </div>
        {data && <JSONTree data={data} />}
      </div>
    );
  }
}

export default App;
