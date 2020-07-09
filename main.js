// Divide behaviour in main loop
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var worldPopulation = require('world.population');

module.exports.loop = function () {

    worldPopulation.run();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}