import { Component } from "react";
// import Carousel from "nuka-carousel";

import Layout from "./Layout";
import { getPageTitle } from "../utils";

export default class IndexPage extends Component {
	static async getInitialProps({ pathname }) {
		const title = getPageTitle(pathname);
		return {
			title,
			pathname
		};
	}

	state = {};

	render() {
		const { title, pathname } = this.props;
		return (
			<Layout title={title} pathname={pathname}>
				<div className="indexPageP">ppp</div>
			</Layout>
		);
	}
}
