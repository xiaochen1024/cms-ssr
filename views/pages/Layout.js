import { Component } from "react";
// import Head from "next/head";
import "isomorphic-fetch";

// import ActiveLink from "../components/ActiveLink";
import layoutStyle from "../styles/p/layout.scss";

export default class Layout extends Component {
	render() {
		const {
			children,
		  } = this.props;
		return (
			<div>
				<style global jsx>
					{`
						body {
							font-size: unset;
							margin: 0px !important;
							padding: 0px !important;
							font-family: PingFangSC-Regular;
							background: unset;
						}

						html {
							line-height: initial;
						}

					`}
				</style>
				<style dangerouslySetInnerHTML={{ __html: layoutStyle }} />
				<div>{children}</div>
			</div>
		);
	}
}
