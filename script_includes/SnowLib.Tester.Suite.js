gs.include('jasmine-1.3.1r');
gs.include('SnowLib.Tester.TextReporter');
SnowLib.namespace('SnowLib.Tester');

SnowLib.Tester.Suite = (function() {

  function getByName(suiteName) {
    var gr = new GlideRecord("u_tester_suite");
    gr.addQuery("u_name", suiteName);
    gr.addQuery("u_active", true);
    gr.query();

    if (gr.next()) {
      return getBySuiteGR(gr);
    }
    return null;
  }

  function getBySuiteGR(gr) {
    return new Suite({
      sysId : gr.sys_id.toString(),
      name : gr.u_name.toString(),
      description : gr.u_description.toString(),
      script : gr.u_script.toString()
    });
  }

  function Suite(params) {
    var self = this;
    self.sysId = params.sysId;
    self.name = params.name;
    self.description = params.description;
    self.script = params.script;

    self.run = function(reporter) {

      var env = jasmine.getEnv();
      env.updateInterval = 0;  // disables setTimeout, not available in Rhino/SN

      env.addReporter(new SnowLib.Tester.TextReporter({
        headerText : self.name + ':\n',
        multiLnOut : function(str) {
          gs.log(str, 'SnowLib.Tester.Suite');
        }
      }));

      if (reporter) {
        env.addReporter(reporter);
      }

      eval(self.script);
      env.execute();

    }
  }

  return {
    getByName : getByName,
    getBySuiteGR : getBySuiteGR
  };

})();