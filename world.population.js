var worldPopulation = {
    run: function() {
        // Remove non-existant creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // World and Population details
        var spawnName = 'Nexus';

        var workers = [
            { name: 'Harvester', memoryRole: 'harvester', body: [WORK,CARRY,MOVE], populationCap: '3' },
            { name: 'Upgrader', memoryRole: 'upgrader', body: [WORK,CARRY,MOVE], populationCap: '1' }
        ]
        
        // Spawn workers that are needed
        workers.forEach(function(worker) {
            var currentCount = _.filter(Game.creeps, (creep) => creep.memory.role == worker.memoryRole);

            if (currentCount.length < worker.populationCap)
            {
                if (Game.spawns[spawnName].spawning) {
                    var newSpawnName = Game.creeps[Game.spawns[spawnName].spawning.name];
                    console.log('Waiting on new spawn ' + newSpawnName);
                } else {
                    var newName = worker.name + Game.time;

                    if (Game.spawns[spawnName].spawnCreep(worker.body, newName, {memory: {role: worker.memoryRole}}) == ERR_NOT_ENOUGH_ENERGY) {
                        console.log('Not enough energy to spawn ' + worker.name + ', waiting...');

                        Game.spawns[spawnName].room.visual.text(
                            '🔋 Needs Energy',
                            Game.spawns[spawnName].pos.x + 1,
                            Game.spawns[spawnName].pos.y,
                            {align: 'left', opacity: 0.8}
                        );
                    } else {
                        console.log('Current ' + worker.name + ' population (' + currentCount.length + ') does not meet quota (' + worker.populationCap + '), spawning...');
                        console.log('Spawning new ' + worker.name + ' (' + newName + ')');
                    }
                }
            } else {
                console.log('Current ' + worker.name + ' population (' + currentCount.length + ') meets quota (' + worker.populationCap + ')');
            }
        });

        // Show what we're spawning
        if (Game.spawns[spawnName].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
    
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                {align: 'left', opacity: 0.8}
            );
        }
    }
}

module.exports = worldPopulation;