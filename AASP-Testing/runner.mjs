import { Status } from "allure-js-commons";
import { glob } from "glob";
import Mocha from "mocha";
import * as os from "node:os";

const mocha = new Mocha({
  reporter: "allure-mocha",
  reporterOptions: {
    resultsDir: "allure-results",
    extraReporters: "spec",
    links: {  
      issue: {
        nameTemplate: "Issue #%s",
        urlTemplate: "https://issues.example.com/%s",
      },
      tms: {
        nameTemplate: "TMS #%s",
        urlTemplate: "https://tms.example.com/%s",
      },
      jira: {
        urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
      },
    },
    categories: [
      {
        name: "foo",
        messageRegex: "bar",
        traceRegex: "baz",
        matchedStatuses: [Status.FAILED, Status.BROKEN],
      },
    ],
    environmentInfo: {
      os_platform: os.platform(),
      os_release: os.release(),
      os_version: os.version(),
      node_version: process.version,
    },
  },

  /* Other Mocha options... */
});

glob.sync("test/**/*.spec.{m,c,}js").forEach((file) => mocha.addFile(file));
await mocha.loadFilesAsync();
mocha.run((failures) => process.exit(failures));