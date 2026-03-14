import http from "node:http";
import { getManageUsersViewModel } from "./server/manageUsersGateway.js";
import { renderManageUsersHtml } from "./renderManageUsers.js";

const server = http.createServer((_req, res) => {
  const html = renderManageUsersHtml(getManageUsersViewModel());
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><html><body>${html}</body></html>`);
});

server.listen(4173, "0.0.0.0", () => {
  process.stdout.write("Manage Users shell running at http://0.0.0.0:4173\n");
});
