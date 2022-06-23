console.clear()

const Client = require("./Structures/Client")
const Command = require("./Structures/Command");

const config = require("./Data/config.json");

const client = new Client()

const fs = require("fs");
const Discord = require("discord.js");
const { type } = require("os");

var callStart = null;
var stillInVC = false;
var count = 0;
var justStarted = false;
var callStatus;
var thread = null;

var manualSet = false;
var setDate = null;

var thisCallStart = false;

var callStarter = null;


fs.readdirSync("./src/Commands").filter(file => file.endsWith(".js")).forEach(file => {
    /**
     * @type {Command}
     */
    const command = require(`./Commands/${file}`);
    console.log(`Command ${command.name} loaded.`)
    client.commands.set(command.name, command);
})

client.on("ready", async () => {

    console.log(`Logged in as ${client.user.tag}!`)


    botStartedEmbed = new Discord.MessageEmbed()
      .setColor('#F1C40F')
      .setDescription ("Currently no ongoing call")
      .setTimestamp();

    callStatus = await client.channels.cache.get(config.logchannel).send({ embeds: [botStartedEmbed]})

    setInterval(async() => {

        if(callStart != null){
            if(justStarted) {
                callStartedEmbed = new Discord.MessageEmbed()
                    .setColor('#2ECC71')
                    .setTitle("Ongoing Call")
                    .addFields(
                        {name:'Start time', value: callStart.toString().slice(3, callStart.toString().length - 36)}
                    )
                    .setTimestamp();
                if(callStarter != null){
                    callStartedEmbed = new Discord.MessageEmbed()
                    .setColor('#2ECC71')
                    .setTitle("Ongoing Call")
                    .addFields(
                        {name:'Start time', value: callStart.toString().slice(3, callStart.toString().length - 36)}
                    )
                    .addFields(
                        {name:'Started by', value: `<@${callStarter}>`}
                    )
                    .setTimestamp();
                }
                callStatus.edit({embeds: [callStartedEmbed]})
                justStarted = false;
                thisCallStart = callStart.toString().slice(3, callStart.toString().length - 36);

                thread = await callStatus.startThread({
                    name: 'Call Activity (WIP)',
                    autoArchiveDuration: 60,
                    reason: 'Display call activity',
                })

                if(callStarter != null){
                    thread.send(`<@${callStarter}> started the call`)
                }
            }

            let newDate = new Date();

			let totalSeconds = Math.floor((newDate.getTime() - callStart.getTime()) / 1000);
            let totalMinutes = Math.floor(totalSeconds / 60);
            let totalHours = Math.floor(totalMinutes / 60);
            let totalDays = Math.floor(totalHours / 24);
            let totalMonths = Math.round((totalDays / 30) * 10) / 10;
            let totalYears = Math.round((totalMonths / 12) * 10) / 10;

            let hours = totalHours - ( totalDays * 24 );
            let minutes = totalMinutes - ( totalDays * 24 * 60 ) - ( hours * 60 );
            let seconds = totalSeconds - ( totalDays * 24 * 60 * 60 ) - ( hours * 60 * 60 ) - ( minutes * 60 );

            var output = `${totalDays} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

            var dynamicOutput = [`${seconds} seconds`, `${minutes} minutes ${seconds} seconds`, `${hours} hours ${minutes} minutes ${seconds} seconds`, `${totalDays} days ${hours} hours ${minutes} minutes ${seconds} seconds`]

            if(minutes === 0 && hours === 0 && totalDays === 0){
                output = dynamicOutput[0]
                client.user.setPresence({
                    activities: [{
                        name: dynamicOutput[0],
                        type: 'PLAYING'
                    }],
                    status: 'online'
                });
            } else if(minutes != 0 && hours === 0 && totalDays === 0){
                output = dynamicOutput[1]
                client.user.setPresence({
                  activities: [{
                      name: dynamicOutput[1],
                      type: 'PLAYING'
                  }],
                  status: 'online'
                });
            } else if(minutes != 0 && hours != 0 && totalDays === 0){
                output = dynamicOutput[2]
                client.user.setPresence({
                  activities: [{
                      name: dynamicOutput[2],
                      type: 'PLAYING'
                  }],
                  status: 'online'
                });
            } else if (totalDays != 0) {
                output = dynamicOutput[3]
                client.user.setPresence({
                    activities: [{
                        name: dynamicOutput[3],
                        type: 'PLAYING'
                    }],
                    status: 'online'
                  });
            }
        }

        const voiceChannels = client.channels.cache.filter(c => c.type === 'GUILD_VOICE');
        count = 0;
        for(const[id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

        if(callStart === null){
            client.user.setPresence({
                activities: [{
                    name: 'the voice channels', // anything you want
                    type: 'WATCHING' // (PLAYING, WATCHING, LISTENING)
                }],
                status: 'idle' // (idle, dnd, online, invisible)
              })

            if(count >= 1 && !manualSet){
                stillInVC = true;
                callStart = new Date();
                setDate = `${callStart.getMonth()}\/${callStart.getDate()}\/${callStart.getFullYear()}`
                justStarted = true;
            }
        }
        if(manualSet && count >= 1){
            callStart = new Date(setDate)
        }

        if(count === 0){
            stillInVC = false;
            setDate = null;
            manualSet = false;
            callStart = null;
        }

        if(!stillInVC){
            let outputMessage = output;
            callStart - null;
            if(thread){
                await thread.setLocked(true);
                await thread.setArchived(true);
            }
            if(outputMessage != null){
                let callDurationEmbed = new Discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle("Call Ended")
                    .setDescription(outputMessage)
                    .setFooter("Started  • " + thisCallStart + "  •  Ended ")
                    .setTimestamp();
                callStatus.edit({embeds: [callDurationEmbed]})

                botStartedEmbed = new Discord.MessageEmbed()
                    .setColor('#F1C40F')
                    .setDescription ("Currently no ongoing call")
                    .setTimestamp();
                callStatus = await client.channels.cache.get(config.callchannel).send({ embeds: [botStartedEmbed]})
            }
            thread = null;
            
        }
    }, 5000);
});

client.on("voiceStateUpdate", function(oldMember, newMember){
    let newUserChannel = newMember.channelId;
    let oldUserChannel = oldMember.channelId;

    if(newUserChannel != null && thread && newUserChannel != oldUserChannel){
        thread.send(`${newMember.member} joined call in <#${newUserChannel}>`)
    }
    else if(newMember.streaming && !oldMember.streaming){
        thread.send(`${newMember.member} started streaming in <#${newUserChannel}>`)
    }
    else if(oldMember.streaming && !newMember.streaming){
        thread.send(`${oldMember.member} stopped streaming`)
    }
    else if(newMember.selfVideo && !oldMember.selfVideo){
        thread.send(`${newMember.member} turned their camera on`)
    }
    else if(oldMember.selfVideo && !newMember.selfVideo){
        thread.send(`${oldMember.member} turned off their camera`)
    }
    if(oldUserChannel != null && thread && newUserChannel != oldUserChannel){
        thread.send(`${oldMember.member} left the call`)
    }

    callStarter = newMember.member.user.id;
});

client.on("messageCreate", message => {

    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    var commandword = args.shift().toLowerCase();

    if(commandword === "admin"){
        commandword = commandword + " " + args[0]
    }


    if(commandword === "settime"){
        manualSet = true;
        setDate = args.join(' ')
        thisCallStart = setDate

        callSetEmbed = new Discord.MessageEmbed()
          .setColor('#2ECC71')
          .setTitle("Ongoing Call")
          .addFields(
            {name:'Start time', value: setDate}
          )
          .setTimestamp();
        callStatus.edit({embeds: [callSetEmbed]})

        message.delete()
    }
    else{

      const command = client.commands.find(cmd => cmd.name == commandword)

      if(!command){ return message.reply(`${commandword} is not a valid command.`).then(msg => setTimeout(() => {msg.delete()}, 10000)); }

      command.run(message,args,client);
    }
});


client.login(config.token)