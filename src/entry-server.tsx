import "reflect-metadata";
import { createHandler, StartServer } from "@solidjs/start/server";
import { AppDataSource } from "./AppDataSource";

AppDataSource.initialize()
  .then(() => {
    console.log(`server started successfully ...`);
  })
  .catch((err) => {
    console.log(err);
  });

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
