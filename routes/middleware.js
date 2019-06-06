const dev = process.env.NODE_ENV !== "production";

const getClientIp = function(req) {
	let ip =
		req.headers["x-forwarded-for"] ||
		req.ip ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress ||
		"";
	if (ip.split(",").length > 0) {
		ip = ip.split(",")[0]; //eslint-disable-line
	}
	return ip;
};

exports.validateIp = function(req, res, next) {
	const ipList = dev ? [] : [];
	console.log(getClientIp(req));
	if (
		ipList.indexOf(getClientIp(req)) === -1 &&
		req.path.indexOf("keystone") !== -1
	) {
		res.send(404);
	} else {
		next();
	}
};
