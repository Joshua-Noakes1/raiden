const path = require('path'),
    lcl = require('cli-color'),
    {MessageEmbed} = require('discord.js'),
    {
        readJSON,
        writeJSON
    } = require('../../../bin/readWrite');

async function videoQueue(interaction) {
    // check if videoQueue is empty
    var videoQueueJSON = await readJSON(path.join(__dirname, '../../../data/videoQueue.json'));
    if (!videoQueueJSON.success) videoQueueJSON = {success: true, queue: []}

    if (videoQueueJSON.queue.length == 0) {
        // return success
        return {success: true}
    }

    // push video into queue
    videoQueueJSON.queue.push(videoQueueJSON.queue.length++);
    await writeJSON(path.join(__dirname, '../../../data/videoQueue.json'), videoQueueJSON);

    // see how many videos are in the queue
    var queueLoop = setInterval((async () => {
        var videoQueueJSON = await readJSON(path.join(__dirname, '../../../data/videoQueue.json'));

        if (videoQueueJSON.queue.length == 0) {
             // clear interval
             clearInterval(queueLoop);
             return {success: true}
        }

        // build embed
        var videoQueueEmbed = new MessageEmbed()
            .setTitle(`Video Queue - ${videoQueueJSON.queue.length} / ${videoQueueJSON.queue.length}`)
        // send interaction edit
    }), 1000);
}

module.exports = videoQueue;
