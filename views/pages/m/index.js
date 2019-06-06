import { Component } from "react";
// import Link from "next/link";

import Layout from "./Layout";
import "../../styles/m/index.scss";
import { getInitData, formatDate } from "../../utils";

const title = "首页";

export default class IndexPage extends Component {
	// static async getInitialProps() {
	// 	const posts = await getInitData(
	// 		`${process.env.gateway}/news?page=1&size=4`
	// 	);
	// 	return {
	// 		posts
	// 	};
	// }

	constructor(props) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
	}

	state = {
		// list: this.props.posts.results
	};

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

	handleScroll = () => {};

	render() {
		return (
			<Layout title={title}>
				<div className="indexPage">mmm</div>
			</Layout>
		);
	}
}
