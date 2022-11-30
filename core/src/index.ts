import express from "express";
// import { spawn } from "child_process";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const port = 33333;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.json({ a: 1 });
});

app.post("/", (_req, _res) => {
  console.log('HIT HERE THAT WORKS');
  
  // TODO:
  // 1. read the data from request body that have blocks schema
  // 2. convert them into cypress test cases
  // 3. write the test cases into the user codebase file system
  // 4. trigger the command "yarn run cypress open"
  
  
  
  
  
  
  
  
  
  
  
  
  // const e2eTestDir = `${__dirname}/To-do-app-with-React`;
  // const side_process = spawn("yarn run cypress open", {
  //   shell: true,
  //   detached: true,
  //   cwd: e2eTestDir,
  // });

  // side_process.stdout.on("data", (data: any) => {
  //   console.log(`stdout: ${data}`);
  // });

  // side_process.stderr.on("data", (data: any) => {
  //   console.log(`stderr: ${data}`);
  // });

  // side_process.on("error", (error: Error) => {
  //   console.log(`error: ${error.message}`);
  // });

  // side_process.on("close", (code: string) => {
  //   console.log(`child process exited with code ${code}`);
  // });
  // res.json({ b: 123 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
