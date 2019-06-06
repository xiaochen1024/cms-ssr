import Head from "next/head";
import "isomorphic-fetch";
// import stylesheet from 'antd-mobile/dist/antd-mobile.min.css';

const flex =
	'!function(e,t){function n(){t.body?t.body.style.fontSize=12*o+"px":t.addEventListener("DOMContentLoaded",n)}function d(){var e=i.clientWidth/10;i.style.fontSize=e+"px"}var i=t.documentElement,o=e.devicePixelRatio||1;if(n(),d(),e.addEventListener("resize",d),e.addEventListener("pageshow",function(e){e.persisted&&d()}),o>=2){var a=t.createElement("body"),s=t.createElement("div");s.style.border=".5px solid transparent",a.appendChild(s),i.appendChild(a),1===s.offsetHeight&&i.classList.add("hairlines"),i.removeChild(a)}}(window,document);';

export default ({ children, title, hideFooter }) => (
	<div>
		<Head>
			<meta name="keyword" content="" />
			{__IS_SERVER__ && ( //eslint-disable-line
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{ __html: flex }}
				/>
			)}
		</Head>
		<div>{children}</div>

		{/* <style dangerouslySetInnerHTML={{ __html: stylesheet }} /> */}
		<style global jsx>
			{`
				body {
					margin: 0px !important;
					padding: 0px !important;
					font-family: PingFangSC-Regular;
				}
			`}
		</style>
	</div>
);
