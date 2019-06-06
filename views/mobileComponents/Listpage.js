import { Component } from 'react';

import ScrollList from './ScrollList';

export default class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: 1000,
    };
  }

  componentDidMount() {
    const height = document.documentElement.clientHeight;

    this.setState({
      listHeight: height,
    });
  }

  render() {
    const { list, apiUrl } = this.props;
    return <ScrollList listHeight={this.state.listHeight} initList={list} apiUrl={apiUrl} />;
  }
}
