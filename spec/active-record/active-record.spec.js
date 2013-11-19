'use strict';

describe('ActiveRecord', function() {

  var ActiveRecord, System, Sensor, Collection, Inflector, system;
  beforeEach(function() {
    ActiveRecord = require('../../lib/active-record/active-record');
    Collection   = require('../../lib/active-record/collection/collection');

    Sensor = function Sensor(data) {
      if (!data) data = {};
      this.id     = data.id     || undefined;
      this.system = data.system || undefined;
    };

    System = function System(data) {
      if (!data) data = {};
      this.id = data.id || undefined;
    };

    System.Sensor = Sensor;
    Sensor.System = System;

    Sensor = ActiveRecord.Base.apply(Sensor);
    System = ActiveRecord.Base.apply(System);
    System.hasMany('sensors');
    Sensor.belongsTo('system');
  });

  describe('Cached', function() {

    it('adds a cache of instantiated values', function() {
      expect(System.cached).toEqual({});
    });

  });

  describe('Associations', function() {

    beforeEach(function() {
      system = System.new({id: 1});
    });

    it('adds a `new` method to the collection', function() {
      var sensor = system.sensors.new()
      expect(sensor.id).toEqual(undefined);
      expect(sensor.system).toEqual(system);
    });

    it('adds a `belongsTo` method', function() {
      system.sensors.$create({});
      var sensor = system.sensors[0];
      expect(sensor.system).toEqual(system);
    });

    // it('adds a `$save` method to the collection', function() {
    //     var sensor = system.sensors.new();
    //     sensor.system = 'cool';
    //     sensor.$save();
    //     expect(system.sensors).toEqual([{system: 'cool'}]);
    // });

    it('adds a `$create` method to the collection', function() {
      system.sensors.$create({system: 'cool', id: 1});
      expect(system.sensors[0].id).toEqual(1);
      expect(system.sensors[0].system).toEqual(system);
    });

    it('adds a `$delete` method to the collection', function() {
        system.sensors.$create({id: 1});
        system.sensors.$create({id: 2});
        system.sensors.$delete(1);
        expect(system.sensors[0].id).toEqual(2);
        expect(system.sensors[0].system).toEqual(system);
        expect(system.sensors[1]).not.toBeDefined();

        system.sensors.$delete({id: 2});
        expect(system.sensors.length).toEqual(0);
    });

  });

});
