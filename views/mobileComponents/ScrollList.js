import { Component } from 'react';
import { ListView, Icon } from 'antd-mobile';
import Link from 'next/link';

import { formatDate } from '../utils';
import '../styles/m/list.scss';

const formatStr = 'yyyy-MM-dd';

export default class ScrollList extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }).cloneWithRows(props.initList);

    this.state = {
      rData: [],
      dataSource,
      pageIndex: 1,
      isLoading: false,
      hasMore: true,
    };
  }

	onEndReached = async () => {
	  if (this.state.isLoading || !this.state.hasMore) {
	    return;
	  }

	  this.setState(prevState => ({
	    isLoading: true,
	    pageIndex: prevState.pageIndex + 1,
	  }));

	  await this.getData(this.state.pageIndex);

	  const { dataSource, rData } = this.state;
	  this.setState({
	    dataSource: dataSource.cloneWithRows(rData),
	    isLoading: false,
	  });
	};

	async getData(pageIndex = 0) {
	  const url = this.props.apiUrl.replace(/page=\d*/, `page=${pageIndex}`);
	  const res = await fetch(url);
	  const json = await res.json();
	  this.setState(prevState => ({
	    rData:
				pageIndex === 2
				  ? this.props.initList.concat(prevState.rData).concat(json.results)
				  : prevState.rData.concat(json.results),
	    hasMore: !!(Array.isArray(json.results) && json.results.length > 0),
	  }));
	}

	renderRow = v => (
  <Link
    href={`/m/post?id=${v._id}`}
    as={`/m/post/${v._id}`}
    prefetch
    key={`${v.title}-${v.publishedDate}`}
		>
    <div className="listRow">
      <div className="textContainer">
        <div className="brief" dangerouslySetInnerHTML={{ __html: v.content.brief }} />
        <div>
          <div className="titleText">{v.title}</div>
          <p className="publishedDate">
            {` ${formatDate(new Date(v.publishedDate), formatStr)}`}
          </p>
        </div>
      </div>
    </div>
  </Link>
	);

	render() {
	  const { isLoading, hasMore } = this.state;
	  let alertText = '';
	  if (isLoading) {
	    alertText = <Icon type="loading" />;
	  } else if (hasMore) {
	    alertText = '滑动加载更多！';
	  } else {
	    alertText = '没有更多了';
	  }

	  const separator = (sectionId, rowId) => (
  <div
    key={`${sectionId}-${rowId}`}
    style={{
				  backgroundColor: '#F5F5F9',
				  height: 8,
				  borderTop: '1px solid #ECECED',
				  borderBottom: '1px solid #ECECED',
    }}
  />
	  );

	  return (
  <ListView
    className="list"
    dataSource={this.state.dataSource}
    renderHeader={() => <img src={} alt=""/>}
    renderFooter={() => <div style={{ padding: 10, textAlign: 'center' }}>{alertText}</div>}
    renderRow={this.renderRow}
				// renderSeparator={separator}
    style={{
				  height: this.props.listHeight,
				  overflow: 'auto',
    }}
    pageSize={7}
    scrollRenderAheadDistance={500}
    onEndReached={this.onEndReached}
    onEndReachedThreshold={120}
  />
	  );
	}
}
