// тут используется версия API для Дискорда на JavaScript
// Документация находится по ссылке: https://discord.js.org/#/docs/main/stable/general/welcome
// 04 ноября 2020 сломались роли. Надо починить
const { Console } = require('console')
const Discord = require('discord.js')
const config = require('./config/config.json')
const client = new Discord.Client()

// Загружает бота, говорит, кем залогинился и устаналивает слово активности бота в списке 
// пользователелей со словом WATCHING YOU.
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("YOU", {type: "WATCHING"})
})
    
// Тут хватаем сообщением и обрабатываем функцией processCommand полученное сообщение с началом на "!" символ.
// А перед этим проверяем. Бот ли отправил нам сообщение? Если да, то дальше даже не смотрим.
client.on('message', (receivedMessage) => {
    if (receivedMessage.author.bot || (receivedMessage.guild === null)) return
    if (receivedMessage.content.startsWith("!")){
        processCommand(receivedMessage)
    }
})

// Когда добавляется пользователь, то отрпавляем ему целый набор сообщений.
// Возможно тут ошибка теперь с новым видом переменной member

// client.on('guildMemberAdd', (member) => {
//     var fs = require("fs")
//     var text = fs.readFileSync("./text/greetings.txt").toString('utf-8')
//     var text2 = fs.readFileSync("./text/hello.txt").toString('utf-8')
//     member.user.send("<@" + member.user.id + ">" + text)
//     client.channels.get('561618305002242048').send("<@" + member.user.id + ">" + text2)
// })

client.on('error', console.error);

function processCommand (receivedMessage){
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0].toLowerCase() // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command
    let allTail = fullCommand.substr(fullCommand.indexOf(' ')+1); // Taking tail for Role argument

    if (fullCommand === "привет"){
        receivedMessage.channel.send("Привет, " + receivedMessage.author.toString() + "!")
        receivedMessage.react("🖖")
            .then(() => receivedMessage.react('🇵'))
            .then(() => receivedMessage.react('🇷'))
            .then(() => receivedMessage.react('🇮'))
            .then(() => receivedMessage.react('🇻'))
            .then(() => receivedMessage.react('🇪'))
            .then(() => receivedMessage.react('🇹'))
            .then(() => receivedMessage.react('592747816565342218'));
    }

    if (primaryCommand === "помощь"){
        var fs = require("fs")
        var text = fs.readFileSync("./text/greetings.txt").toString('utf-8')
        receivedMessage.react('592747816565342218')
        receivedMessage.author.send("<@" + receivedMessage.author.id + ">\n" + text)
    }

    if (primaryCommand === "легенду") {
        var legend = generateLegend()
        showEmbed(receivedMessage, `Легенда для Forbidden Lands`, legend)
    }

    if (primaryCommand === "я") {
        let systemAnswerHasRoles =       []
        let systemAnswerHasNoRoles =     []
        let systemAnswerNoRolesInGuild = []
        let finalMessageText = []
        let receivedRolesNamesFromMemberArray = allTail.split(/\n![яЯ]\s/gi).filter(Boolean)
        let rolesToAddArray = []

        if (receivedRolesNamesFromMemberArray.length > 0) {
            receivedRolesNamesFromMemberArray.forEach(role => {
                if (receivedMessage.member.roles.cache.some(hasRole => hasRole.name === role)) {
                    systemAnswerHasRoles.push(role)
                } else {
                    if (receivedMessage.guild.roles.cache.some(hasRoles => hasRoles.name === role)) {
                        systemAnswerHasNoRoles.push(role)
                        var foundRoleID = receivedMessage.guild.roles.cache.find(r => r.name === role)
                        rolesToAddArray.push(foundRoleID)
                    } else {
                        systemAnswerNoRolesInGuild.push(role)
                    }
                }
            });
        } else {
            finalMessageText.push(`Вы не ввели роли. Попробуйте снова \`!я Название Роли\``)
        }

        
        if (rolesToAddArray.length > 0) receivedMessage.member.roles.add(rolesToAddArray)
        
        if (rolesToAddArray.length > 0) finalMessageText.push(`**Добавил вам роль(и)**:\n${systemAnswerHasNoRoles.join(' • ')}`)
        if (systemAnswerHasRoles.length > 0) finalMessageText.push(`**У вас уже есть роль(и)**:\n${systemAnswerHasRoles.join(' • ')}`)
        if (systemAnswerNoRolesInGuild.length > 0) finalMessageText.push(`**На сервере нет ролей** (_но вы можете попросить добавить_):\n${systemAnswerNoRolesInGuild.join(' • ')}`)
        receivedMessage.channel.send(`${finalMessageText.join('\n')}`)
    }

    if (primaryCommand === "яне") {
        let systemAnswerHasRoles =       []
        let systemAnswerHasNoRoles =     []
        let systemAnswerNoRolesInGuild = []
        let finalMessageText = []
        let receivedRolesNamesFromMemberArray = allTail.split(/\n![яЯ]не\s/gi).filter(Boolean)
    let rolesToRemove = []

        if (receivedRolesNamesFromMemberArray.length > 0) {
            receivedRolesNamesFromMemberArray.forEach(role => {
                if (receivedMessage.member.roles.cache.some(hasRole => hasRole.name === role)) {
                    systemAnswerHasRoles.push(role)
                    var foundRoleID = receivedMessage.guild.roles.cache.find(r => r.name === role)
                    rolesToRemove.push(foundRoleID)
                } else {
                    if (receivedMessage.guild.roles.cache.some(hasRoles => hasRoles.name === role)) {
                        systemAnswerHasNoRoles.push(role)
                    } else {
                        systemAnswerNoRolesInGuild.push(role)
                    }
                }
            });
        } else {
            finalMessageText.push(`Вы не ввели роли. Попробуйте снова \`!яне Название Роли\``)
        }

        
        if (rolesToRemove.length > 0) receivedMessage.member.roles.remove(rolesToRemove)
        
        if (rolesToRemove.length > 0) finalMessageText.push(`**Удалил у вас роль(и)**:\n${systemAnswerHasRoles.join(' • ')}`)
        if (systemAnswerHasNoRoles.length > 0) finalMessageText.push(`**У вас уже нет роли(ей)**:\n${systemAnswerHasRoles.join(' • ')}`)
        if (systemAnswerNoRolesInGuild.length > 0) finalMessageText.push(`**На сервере нет ролей** (_но вы можете попросить добавить_):\n${systemAnswerNoRolesInGuild.join(' • ')}`)
        receivedMessage.channel.send(`${finalMessageText.join('\n')}`)
    }

    if (primaryCommand === "системы") {
        var roles = receivedMessage.guild.roles.cache.filter(role => role.color === 1752220).map(role => role.name)
        let users = ''
        
        roles.forEach(system => {
            if ((system != '@everyone')){
                // #f1c40f -- city
                // #1abc9c -- system, FATAL (+1) color name == '1752220'
                // if (system.color == 1752220) users += `!я ${system.name}\n`
                users += `!я ${system}\n`
            }
        });

        users += `!я FATAL\n`
        sendEmbed(receivedMessage, `Доступные роли систем на сервере **No Roleplaying**. Копируй, вставляй и отправляй одну из фраз ниже:`, users)
        receivedMessage.react('592747816565342218')
        receivedMessage.author.send(`Попроси добавить систему, если в списке нет твоей любимой.`)
    }

    if (primaryCommand === "города") {
        var cities = receivedMessage.guild.roles.cache.filter(role => role.color === 15844367).map(role => role.name)
        let users = ''
        
        cities.forEach(city => {
            if ((city != '@everyone')){
                // #f1c40f -- city
                // #1abc9c -- system, FATAL (+1) color name == '1752220'
                // if (system.color == 1752220) users += `!я ${system.name}\n`
                users += `!я ${city}\n`
            }
        });

        sendEmbed(receivedMessage, `Доступные роли городов на сервере **No Roleplaying**:`, users)
        receivedMessage.react('592747816565342218')
        receivedMessage.author.send(`Попроси добавить твой , если его нет в списке.`)
    }

    if (primaryCommand === "команды") {
        var fs = require("fs")
        var text = fs.readFileSync("./text/commands.txt").toString('utf-8')
        receivedMessage.react('592747816565342218')
        receivedMessage.author.send("<@" + receivedMessage.author.id + ">\n" + text)
        // receivedMessage.author.send("<@" + receivedMessage.author.id + ">\n" + text)
        // receivedMessage.channel.send(`<@${receivedMessage.author.id}>, отправил тебе в личные сообщения список команд нашего сервера. Хорошего дня!`)
    }

    if (primaryCommand === "кто") {
        who(allTail, receivedMessage)
    }
}

// Функция поиска пользователей по ролям
// Может искать по нескольким разным ролям через соединительное И
// Берём хвост и режем его на пробелы и И
// Таким образом составляем список ролей, по которым будем искать
// Список ролей сервера запрашиваем единожды и храним в roles
// Выводим соощение о количестве людей и перечислияем конкретный список людей

function who(tail, message) {
    // message.channel.send("На данный момент функция \`!кто\` не доступна. Ведутся работы. Скоро починим.")
    
    // Получить список ролей, которые были в сообщении
    
    // Разделить, если были сочетания по И

    // Взять у сервера всех пользователей по одной роли

    // Если была вторая роль, то собрать всех пользователей по второй роли

    // Если было больше одной роли, то сранить два списка на совпадения

    // Если была толко одна роль, то вывести пользователю имена каждого пользователя

    // У меня проблема на моменте, когда надо взять пользователей, сервер показывает
    // только меня. Как будто бы вообще никого больше нет.
    
    var enteredRolesByUser = tail.split(" И ")
    var guildRoles = message.guild.roles.cache
    var members = []
    var users = ``

    // новые переменные 
    var rolesNotFoundArray = []
    var rolesFoundInGuildArray = []
    var finalMessage = []
    var rolesIDsByName = []
    var membersWithRole = []
    
    // проверил, а есть ли у нас вообще эти роли на сервере?
    // составил два списка: те, которые есть, и те, которых нет.
    // далее выведу сообещние о том, какие нашлись, а какие не нашлись.
    enteredRolesByUser.forEach(role => {
        if (guildRoles.find(r => r.name === role) == null){
            rolesNotFoundArray.push(role)
        } else {
            rolesFoundInGuildArray.push(role)
        }
    });

    let testRoleName = rolesFoundInGuildArray[0]



    // console.log(rolesNotFoundArray + '\n' + rolesFounInGuildArray)
    
    // // тут нашёл ID всех ролей, которые у нас есть на сервере
    // rolesFoundInGuildArray.forEach(roleName => {
    //     rolesIDsByName.push(message.guild.roles.cache.get(roleID => roleID.name === roleName).members.array())
    // });

    // // // if (rolesFoundInGuildArray.length = 1) 
    // // let roleID = rolesIDsByName[0].id
    // membersWithRole = message.guild.roles.cache.get().members.array()//.map(m => m.user.tag)
    
    // console.log(membersWithRole);
    // roleID = message.guild.roles.cache.find(r => r.name === rolesFoundInGuildArray[0])
    // console.log(roleID.id)
    // if (rolesFoundInGuildArray.length > 0) finalMessage.push(`**Для роли ${rolesFoundInGuildArray[0]} нашёл**: ${message.guild.roles.cache.get(`${roleID.id}`).members.array()}`) //\n${membersWithRole.join(` • `)
    // if (rolesNotFoundArray.length > 0) finalMessage.push(`**Не смог найти**:\n${rolesNotFoundArray.join(` • `)}`)
    
    // message.channel.send(finalMessage.join(`\n`))

    // if (members === undefined || members.length == 0) {
    //     return
    // }

    // // Тут я проверяю насколько много введено названия ролей для поиска
    // // Если одна, то идём искать только по ней и составлять список
    // // Если больше одной, то идём составлять списки и под списки списков друг из друга, пока не закончатся.
    // if (members.length == 1) {
    //     // console.log(`Entered equal 1: ${members.length} and ${members[0].length}\n\n`)
    //     const member_list = members[0]
    //     for (let i = 0; i < members[0].length; i++) {
    //         users += `@${members[0][i]}\n`
    //     }
    //     showEmbed(message, `Нашёл ${members[0].length} пользователя(ей):`, users)
    // } else {
    //     let sub = []
    //     let users = ``
    //     let functionValues
    //     for (let i = 0; i < members.length; i++) {
    //         if (i == 0){
    //             functionValues = compareTwoLists(members[i], members[i+1])  
    //         } else if ((i + 1) < members.length) {
    //             functionValues = compareTwoLists(sub, members[i+1]) 
    //         }
    //         sub = functionValues[0]
    //         users = functionValues[1]
    //         // console.log(users)
    //     }
    //     showEmbed(message, `Нашёл ${sub.length} пользователя(ей):`, users)
    // }

    // Понять почему оно не работает. Отчего showEmbed игнорируется?
    // if (rolesNotFoundArray > 0) showEmbed(message, `Не нашёл ролей на сервере:`, rolesNotFoundArray)
}

function compareTwoLists(list1, list2){
    let users = ``
    let sub = [list1, list2].reduce((a, b) => a.filter(c => b.includes(c)))
    for (let m = 0; m < sub.length; m++) {
        users += `@${sub[m]}\n`
    }
    return [sub, users] 
}


function sendEmbed(message, title, users) {
    console.log(`\nДлина переменной users: ${users.length}\n===`)
    if (users.length > 2001) {
        for (let i = 0; i < Math.ceil(users.length / 2000); i++) {
            
            // console.log(`Прошёл круг ${i+1}.\n`)
            
            const Embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title + ` [${i + 1}]`)
            .setDescription(users.substring(i * 2000, (i + 1) * 2000))
            
            message.author.send(Embed)
            
            // console.log(`I've sent: ${users.substring(i * 2000, (i + 1) * 2000)}.`)
        }
    } else { 
        const Embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setDescription(users)
        
        message.author.send(Embed)
    }
}

function showEmbed(message, title, users){

    if (users.length > 2001) {
        
        // console.log(`users.length: ${users.length}`)
        
        for (let i = 0; i < Math.ceil(users.length / 2000); i++) {

            const Embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title + ` [${i + 1}]`)
            .setDescription(users.substring(i * 2000, (i + 1) * 2000))

            message.channel.send(Embed)
        }
    } else {
        const Embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setDescription(users)
        
        message.channel.send(Embed)
    }
}

/*
// FORBIDDEN LANDS LEGEND GENERATOR
*/

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is exclusive and the minimum is inclusive
}

function rollndm(n, m){
    var roll = 0
    for (let i = 0; i < n; i++) {
        roll += getRandomInt(1, m)
    }
    return roll
}


function readTable(filename){
    var fs = require("fs")
    var text = fs.readFileSync(`./${filename}.txt`).toString('UTF-8')
    text = text.split('\n')
    return text
}

function rollTable(txtfilename){
    var data = readTable(txtfilename)
    var diceAndWeights = data[0].replace(/(\r\n|\n|\r)/gm,"").split(', ')
    data.shift()
    var variants = data

    var dice = parseInt(diceAndWeights[0].substring(1))
    var roll = rollndm(1, dice)
    diceAndWeights.shift()
    var tableWeights = diceAndWeights.map(Number)
    
    for (let i = 0; i < variants.length; i++) {
        const element = variants[i]
        if (tableWeights[i] >= roll){
            return ` ${element.replace(/(\r\n|\n|\r)/gm,"")}`
        }
    }
}

function generateLegend() {
    var phrase = 'A long time ago'
    var tableNames = ['A long time ago',
                    'There was a 1',
                    'There was a 2',
                    'Who sought',
                    'Because of',
                    'And traveled to', 'Located',
                    'In asome',
                    'In the direction of',
                    'As the Legend goes',
                    'And that at the location',
                    'But also 1',
                    'But also 2']

    for (let i = 0; i < tableNames.length; i++) {
        const table = 'text/forbidden_lands/' + tableNames[i]
        phrase += rollTable(table)
    }
    return phrase
}

client.login(config.discord_bot.token)