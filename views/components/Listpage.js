import { Component } from "react";
import Link from "next/link";
import listStyle from "../styles/p/list.scss";

import { formatDate } from "../utils";

const formatStr = "yyyy-MM-dd";

export default class ListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 1,
			hasMore: true,
			list: props.list.results
		};
	}

	handleLoadMore = async () => {
		const { currentPage, list } = this.state;
		const { apiUrl } = this.props;

		this.setState(prevState => ({
			currentPage: prevState.currentPage + 1
		}));

		const url =
			apiUrl.indexOf("?") === -1
				? `${apiUrl}?page=${currentPage + 1}`
				: `${apiUrl}&page=${currentPage + 1}`;
		const res = await fetch(url);
		const json = await res.json();

		if (Array.isArray(json.results) && json.results.length) {
			this.setState({ list: list.concat(json.results) });
		} else {
			this.setState({
				hasMore: false
			});
		}
	};

	render() {
		const { list } = this.state;

		return (
			<div className="listP">
				<div>
					{list.map(v => (
						<Link
							href={`/post?id=${v._id}`}
							as={`/post/${v._id}`}
							prefetch
							key={`${v.title}-${v.publishedDate}`}
						>
							<div className="listRow">
								<div className="textContainer">
									<div className="brief">
										<div
											dangerouslySetInnerHTML={{ __html: v.content.brief }}
										/>
										<div className="rightArea">
											<div className="titleText">{v.title}</div>
											<div
												className="descriptionText"
												style={{ WebkitBoxOrient: "vertical" }}
											>
												{v.description}
											</div>
											<div className="publishedDate">
												{`${formatDate(new Date(v.publishedDate), formatStr)}`}
											</div>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{this.state.hasMore ? (
					<div className="loadMore" onClick={this.handleLoadMore}>
						查看更多
					</div>
				) : null}
				<style dangerouslySetInnerHTML={{ __html: listStyle }} />
			</div>
		);
	}
}
