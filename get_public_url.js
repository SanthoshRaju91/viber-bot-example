const http = require('http');
const options = {
    hostname: "127.0.0.1",
    port: 4040,
    path: "/api/tunnels",
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
};

module.exports = {
    getPublicURL: () => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                res.setEncoding("utf8");
                res.on("data", config => {
                    config = JSON.parse(config);
                    const httpsTunnel = config.tunnels.filter(t => t.proto === "https").pop();
                    resolve(httpsTunnel.public_url);
                });
            });
            req.on("error", err => reject(err));
            req.end();
        });
    }
}