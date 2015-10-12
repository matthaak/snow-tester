SnowLib.namespace('SnowLib.Tester');

SnowLib.Tester.TextReporter = function (params) {
  params = params || {};
  params.verbose = params.verbose || false;
  params.headerText = params.headerText || '';
  params.footerText = params.footerText || '';

  // TextReporter is silent by default. To actually do anything, it requires a lnOut
  // or out function or something can be done with getResults().output once run.
  params.lnOut = params.lnOut || function() {};
  params.multiLnOut = params.multiLnOut || function() {};

  var failed_char = '\u2717';
  var passed_char = '\u2713';

  var self = this;
  var r, outputBuffer, symbolSummary, failedSummary, indentLevel;

  self.reportRunnerStarting = function (runner) {
    self.startedAt = new Date();
    outputBuffer = [];
    symbolSummary = [];
    failedSummary = [];
    indentLevel = 0;

    r = {};
    r.passed = r.failed = r.skipped = r.time = 0;
    r.total = runner.specs().length;
    r.status = "running";
    r.output = "";
  };

  self.reportRunnerResults = function (runner) {
    r.time = new Date().getTime() - self.startedAt.getTime();
    r.status = r.failed > 0 ? "failed" : "passed";

    output(symbolSummary.join("") + "\n");
    if (params.verbose) {
      for (var i=0; i<suites.length; i++) {
        indentLevel--;
        outputSuiteResult(suite);
        output("");
        indentLevel++;
      }
    }
    if (failedSummary.length > 0) {
      output(failedSummary.join("\n") + "\n");
    }
    output(r.passed + "/" + r.total + " passed, " + r.failed + " failed in " + (r.time / 1000) + "s");
    r.output = params.headerText + outputBuffer.join("\n") + params.footerText;
    params.multiLnOut(r.output);
  };

  self.reportSpecResults = function (spec) {
    var results = spec.results();

    if (results.skipped) {
      r.skipped++;
      symbolSummary.push("-");

    } else if (results.passed()) {
      r.passed++;
      symbolSummary.push(".");

    } else {
      r.failed++;
      symbolSummary.push(failed_char);
      outputFailed(failed_char + " " + spec.getFullName());
      outputMessages(spec, outputFailed);
    }
  };

  self.reportLog = function (str) {
    output(str);
  };

  self.getResults = function () {
    return r;
  };

  function outputSuiteResult(suite) {
    indentLevel++;
    output(suite.description);
    var suiteSpecs = suite.specs();
    for (var i=0; suiteSpecs.length; i++) {
      outputSpecResult(suiteSpecs[i]);
    }
    var suiteSuites = suite.suites();
    for (var i=0; suiteSuites.length; i++) {
      outputSuiteResult(suiteSuites[i]);
    }
    indentLevel--;
  }

  function outputSpecResult(spec) {
    var passed = spec.results().passed();
    indentLevel++;
    output((passed ? "" : failed_char + " ") + spec.description);
    if (!passed) {
      outputMessages(spec, output);
    }
    indentLevel--;
  }

  function outputMessages(spec, outputer) {
    indentLevel++;
    var resultItems = spec.results().getItems();
    for (var i=0; i<resultItems.length; i++) {
      var result = resultItems[i];
      if (result.type == 'log') {
        outputer(result.toString());

      } else if (result.type == 'expect' && result.passed && !result.passed()) {
        outputer(failed_char + ' ' + result.message);
        if (result.trace.stack) {
          outputer(result.trace.stack);
        }
      }
    };
    indentLevel--;
  }

  function output(str) {
    params.lnOut(getLine(str));
    outputBuffer.push(getLine(str));
  }

  function outputFailed(str) {
    failedSummary.push(getLine(str));
  }

  function getLine(str) { return new Array(indentLevel + 1).join("  ") + str; }

};