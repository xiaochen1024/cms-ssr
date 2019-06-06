const dev = process.env.NODE_ENV !== "production";

module.exports = {
	"process.env.h5root": dev ? "" : "",
	"process.env.gateway": dev ? "/api" : "/api"
};
