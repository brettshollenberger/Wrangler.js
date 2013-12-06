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
      this.id        = data.id        || undefined;
      this.placement = data.placement || undefined;
    };

    System.Sensor = Sensor;
    Sensor.System = System;

    Sensor = ActiveRecord.Base.apply(Sensor);
    System = ActiveRecord.Base.apply(System);
    System.hasMany('sensors');
    Sensor.belongsTo('system');

    system = System.new({id: 1});
  });

  describe('Caching', function() {

    it('adds a cache of instantiated values', function() {
      expect(System.cached).toEqual({});
    });

  });

  describe('Associations', function() {
    describe('base#hasMany', function() {
      it('adds an empty collection', function() {
        expect(system.sensors.length).toEqual(0);
      });

    describe('base#belongsTo', function() {
      it('establishes the belongsTo relationship', function() {
        system.sensors.$create({});
        var sensor = system.sensors[0];
        expect(sensor.system).toEqual(system);
      });
    });
  });

  describe('Associated Collections', function() {
    describe('collection#new', function() {
      it('establishes the belongs-to relationship', function() {
        var sensor = system.sensors.new()
        expect(sensor.system).toEqual(system);
      });

      it('does not push the sensor into the has-many relationship until save', function() {
        var sensor = system.sensors.new();
        expect(system.sensors[0]).toEqual(undefined);
      });

      it('accepts data to instantiate with', function() {
        var sensor = system.sensors.new({id: 1});
        expect(sensor.id).toEqual(1);
      });
    });

    describe('collection#$create', function() {
      it('establishes the belongs-to relationship', function() {
        var sensor = system.sensors.$create();
        expect(sensor.system).toEqual(system);
      });

      it('establishes the has-many relationship', function() {
        var sensor = system.sensors.$create();
        expect(system.sensors[0]).toEqual(sensor);
      })

      it('accepts data to instantiate with', function() {
        var sensor = system.sensors.$create({id: 1});
        expect(sensor.id).toEqual(1);
      });
    });

    describe('collection#delete', function() {

      beforeEach(function() {
        system.sensors.$create({id: 1});
        system.sensors.$create({id: 2});
        system.sensors.$delete(1);
      });

      it('deletes the instance from the collection', function() {
        expect(system.sensors[1]).not.toBeDefined();
      });

      it('updates its length', function() {
        expect(system.sensors.length).toBe(1);
      });

      it('still contains all other members', function() {
        expect(system.sensors[0].id).toEqual(2);
      });
    });
  });

  describe('Persistence', function() {
    describe('base#save', function() {
      it('adds collection members to the collection', function() {
        var sensor = system.sensors.new();
        sensor.$save();
        expect(system.sensors[0]).toEqual(sensor);
      });

      it('adds an id if none is defined', function() {
        var sensor = system.sensors.new();
        sensor.$save();
        expect(system.sensors[0].id).toEqual(0);
      });
    });

    describe('base#$create', function() {
      it('adds to the cache', function() {
        system = System.$create({id: 1});
        expect(System.cached[1]).toEqual(system);
      });
    });

    describe('base#update', function() {

      beforeEach(function() {
        system = System.$create({id: 1});
      });

      it('updates the instance', function() {
        system.update({placement: 'window'});
        expect(System.find(1).placement).toEqual('window');
      });

      it('updates associated relations if described', function() {
        system.update({sensors: [{id: 1}]});
        expect(system.sensors[0].constructor.name).toBe('Sensor');
      });

      it('adds all new associated relations to the relationship', function() {
        system.update({sensors: [{id: 1}, {id: 2}]});
        expect(system.sensors.length).toBe(2);
      });

      it('removes entities previously in associated collections', function() {
        for (var i = 0; i<3; i++) { system.sensors.$create(); }
        system.update({sensors: [{id: 1}]});
        expect(system.sensors.length).toBe(1);
      });
    });
  });

  describe('Querying', function() {
    describe('base#where', function() {

      var system2, system3;

      beforeEach(function() {
        system.$save();
        system2 = System.$create({id: 2, placement: 'door'});
        system3 = System.$create({id: 3, placement: 'door'});
      });

      it('finds by id', function() {
        var foundSystems = System.where({id: 1});
        expect(foundSystems).toEqual([system]);
      });

      it('finds by any attr', function() {
        var foundSystems = System.where({placement: 'door'});
        expect(foundSystems).toEqual([system2, system3])
      });

      it('returns empty array if nothing is found', function() {
        var foundSystems = System.where({id: 1, placement: 'door'});
        expect(foundSystems).toEqual([]);
      });
    });

    describe('base#find', function() {

      var system2, system3;

      beforeEach(function() {
        system.$save();
        system2 = System.$create({id: 2, placement: 'door'});
        system3 = System.$create({id: 3, placement: 'door'});
      });

      it('returns the first instance found', function() {
        var foundSystem = System.find({id: 1});
        expect(foundSystem).toEqual(system);
      });

      it('accepts any attributes', function() {
        var foundSystem = System.find({placement: 'door'});
        expect(foundSystem).toEqual(system2);
      });

      it('returns undefined if nothing is found', function() {
        var foundSystem = System.find({id: 1, placement: 'door'});
        expect(foundSystem).toEqual(undefined);
      });
    });
  });

  });

});
