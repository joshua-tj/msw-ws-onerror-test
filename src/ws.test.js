import { ws } from "msw";
import { setupServer } from "msw/node";

test("Connection should error", () =>
  new Promise((done, fail) => {
    const api = ws.link("wss://example.com/path");

    const server = setupServer(
      api.addEventListener("connection", () => {
        console.log("connecting");
        throw new Error("Connection error");
      })
    );
    server.listen();

    const connection = new WebSocket("wss://example.com/path");
    connection.onerror = (e) => {
      console.log("onerror", e);
      done();
    };

    connection.onclose = (e) => {
      console.log("onclose", e);
    };

    connection.onopen = () => {
      console.log("onopen");
      fail("Connection should not be opened");
    };
  }));
