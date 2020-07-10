var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targets.length > 0) {
            if(creep.store.getFreeCapacity() > 0) {
                var sources = creep.room.find(FIND_SOURCES);
                
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
    
            } else {
    
                if(targets.length > 0) {
    
                    var transferResponse = creep.transfer(targets[0], RESOURCE_ENERGY);
    
                    switch (transferResponse) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        default:
                            console.log("Non-handled response from transfer: " + transferResponse);
                    }
                }
            }
        } else {
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;