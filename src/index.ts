#!/usr/bin/env node
import sade from "sade";
import { version } from "../package.json";

const quickts = sade("quickts");

quickts.version(version);

quickts.command("hello").action(() => {
  console.log("helloworld");
});

quickts.parse(process.argv);
