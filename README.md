ServiceNow client and server-side testing based on Jasmine

Installation
------------

Snow-tester can be installed in a ServiceNow instance running Fuji or later using the update set located here:

    update_sets/snow-tester-version.xml

That update set contains the entire application while the rest of this repository contains only the scripting components. The scripting components are separated out to ease coding using an IDE.

Usage
-----
Once installed (committed) in a ServiceNow instance, you can do some server-side testing. A means of doing client-side testing will be available soon.

At a high-level there are two steps in using Snow Tester: writing a Tester Suite and then running it.

### Writing a Tester Suite

1. Go to Snow Tester > Tester Suites
2. Click New
3. Enter a Name such as 'Example.spec'
4. Enter a Jasmine 1.3 suite in Script, such as the below examples
5. Click Save or Update

### Running a Tester Suite via the UI

1. Go to the Tester Suite you want to run
2. Click Run
3. Test output will appear at the top of the form and will simultaneously be logged in Snow Tester > Log

### Running a Tester Suite from a script

    gs.include("SnowLib.Tester.Suite");
    var reporter = new SnowLib.Tester.TextReporter();
    SnowLib.Tester.Suite.getByName('Example.spec').run(reporter);
    var resultsText = reporter.getResults().output;

The variable resultsText would then hold output like the results given in Examples.

### Running a Tester Suite using snow-runner

Snow-runner 0.0.3 and later includes support for running server-side Tester Suites from a local command line, by using the --suite argument:

    $ node run.js YWRtaW46YWRtaW4=@demo001 --suite 'Example.spec'
    
Test results would then be dumped to the console, in the same text format as the results given in Examples.

Examples
--------

The following is an example Jasmine 1.3 suite, taken from [Jasmine documentation](http://jasmine.github.io/1.3/introduction.html).

    describe("A suite", function() {
      it("contains spec with an expectation", function() {
        expect(true).toBe(true);
      });
    });

The above should return results like:

    .
    1/1 passed, 0 failed in 0.003s
    
The following example will produce a failure and also shows how to use the jasmine log.

    describe("A suite", function() {
      it("contains spec with an expectation", function() {
        jasmine.log('Setting up for failure')
        expect(true).toBe(false);
      });
    });
    
The above should return results like:

    ✗

    ✗ A suite contains spec with an expectation.
    Setting up for failure
    ✗ Expected true to be false.

    0/1 passed, 1 failed in 0.003s