'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const Engine = require('..').Engine;
const Config = require('..').Config;
const Storage = require('storj-service-storage-models');
const Mailer = require('storj-service-mailer');
const Server = require('..').Server;

describe('Engine', function() {

  describe('@constructor', function() {

    it('should create instance without the new keyword', function() {
      expect(Engine(Config('__tmptest'))).to.be.instanceOf(Engine);
    });

    it('should keep reference to config', function() {
      var config = Config('__tmptest');
      var engine = new Engine(config);
      expect(engine._config).to.equal(config);
    });

  });

  describe('#getSpecification', function() {

    var config = Config('__tmptest');
    var engine = new Engine(config);

    it('should return the swagger specification', function() {
      var spec = engine.getSpecification();
      expect(typeof spec).to.equal('object');
    });

    it('should return the cached swagger specification', function() {
      expect(engine._apispec).to.equal(engine.getSpecification());
    });

  });

  describe('#start', function() {

    it('should setup storage, mailer, server', function(done) {
      var config = Config('__tmptest');
      var engine = new Engine(config);
      engine.start(function(err) {
        if (err) return done(err);
        expect(engine.storage).to.be.instanceOf(Storage);
        expect(engine.mailer).to.be.instanceOf(Mailer);
        expect(engine.server).to.be.instanceOf(Server);
        engine.server.server.close(function() {
          done();
        });
      });
    });

  });

  describe('#_handleRootGET', function() {

    it('should respond with the api specification', function(done) {
      var config = Config('__tmptest');
      var engine = new Engine(config);
      engine._handleRootGET({}, {
        send: function(content) {
          expect(content).to.equal(engine.getSpecification());
          done();
        }
      });
    });

  });

  describe('#_trackResponseStatus', function() {

    it('should store reference to response', function(done) {
      var engine = new Engine(Config('__tmptest'));
      var resp = {};
      engine._trackResponseStatus({}, resp, function() {
        var key = Object.keys(engine._pendingResponses)[0];
        expect(engine._pendingResponses[key]).to.equal(resp);
        done();
      });
    });

  });

  describe('#_keepPendingResponsesClean', function() {

    it('should delete responses that are finished', function(done) {
      var engine = new Engine(Config('__tmptest'));
      engine._pendingResponses = {
        one: { finished: false },
        two: { finished: true }
      };
      var clock = sinon.useFakeTimers();
      engine._keepPendingResponsesClean();
      clock.tick(Engine.RESPONSE_CLEAN_INTERVAL);
      expect(engine._pendingResponses.two).to.equal(undefined);
      expect(engine._pendingResponses.one).to.not.equal(undefined);
      clock.restore();
      done();
    });

  });

});
