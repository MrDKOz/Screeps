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

        // Worker populations will be checked and spawned in on a priority basis
        var workers = [
            { name: 'Harvester', memoryRole: 'harvester', body: [WORK,CARRY,MOVE], populationCap: 3, priority: 1 },
            { name: 'Upgrader', memoryRole: 'upgrader', body: [WORK,CARRY,MOVE], populationCap: 1, priority: 2 }
        ]

        var haltProcessing = false;

        for (i = 1; i < 10; i++)
        {
            // For each level of priority (1-10)
            var focus = _.filter(workers, (worker) => worker.priority == i);

            if (focus.length > 0) {
                // Priority group contains workers, let's continue

                focus.forEach(worker => {

                    if (Game.spawns[spawnName].spawning) {
                        // Already spawning something, let's notify and wait

                        var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
        
                        Game.spawns[spawnName].room.visual.text(
                            '🛠️' + spawningCreep.memory.role,
                            Game.spawns[spawnName].pos.x + 1,
                            Game.spawns[spawnName].pos.y,
                            {align: 'left', opacity: 0.8}
                        );

                        haltProcessing = true;

                    } else {
                        // Spawn isn't currently busy, let's crack on

                        var currentCount = _.filter(Game.creeps, (creep) => creep.memory.role == worker.memoryRole).length;
                    
                        if (currentCount < worker.populationCap) {
                            console.log(worker.name + ' population is lower than cap, attempting spawn...');
                            
                            var newName = worker.name + Game.time;
                            var spawnResponse = Game.spawns[spawnName].spawnCreep(worker.body, newName, {memory: {role: worker.memoryRole}});
                            
                            switch (spawnResponse) {
                                case OK:
                                    console.log('Started spawn process for ' + worker.name + '(' + newName + ')');
                                    break;
                                case ERR_INVALID_ARGS:
                                    console.log('Requested spawn config was not correct');
                                    break;
                                case ERR_RCL_NOT_ENOUGH:
                                    console.log('Spawn is not appropriate level for this request');
                                    break;
                                case ERR_NOT_ENOUGH_ENERGY:
                                    console.log('Not enough energy to spawn ' + worker.name + ', waiting...');
        
                                    Game.spawns[spawnName].room.visual.text(
                                        '🔋 Needs Energy',
                                        Game.spawns[spawnName].pos.x + 1,
                                        Game.spawns[spawnName].pos.y,
                                        {align: 'left', opacity: 0.8}
                                    );
                                    break;
                            }

                            haltProcessing = true;
                        }
                    }
                });
            }

            if (haltProcessing)
                break;
        }
    }
}

module.exports = worldPopulation;