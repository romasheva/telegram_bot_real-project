const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
const mongoose = require('mongoose')
const database = require('../database.json')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
helper.logStart()
mongoose.Promise = global.Promise
mongoose.connect(config.DB_URL, {
    useMongoClient: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))
require('./models/film.model')
const Film = mongoose.model('films')
// database.films.forEach(f => new Film(f).save().catch(e => console.log(e)))

const bot = new TelegramBot(config.TOKEN, {
    polling: true
})
bot.on('message', msg => {
    console.log('Working', msg.from.first_name)
    const chatId = helper.getChatId(msg)
    switch (msg.text) {
        case kb.home.favorite:
            break
        case kb.home.films:
            bot.sendMessage(chatId, `Выберите жанр:`, {
                reply_markup: {keyboard: keyboard.films}
            })
            break
        case kb.film.comedy:
            sendFilmsByQuery(chatId, {type: 'comedy'})
            break
        case kb.film.action:
            sendFilmsByQuery(chatId, {type: 'action'})
            break
        case kb.film.random:
            sendFilmsByQuery(chatId, {})
            break
        case kb.home.cinemas:
            break
        case kb.back:
            bot.sendMessage(chatId, `Что хотите посмотреть?:`, {
                reply_markup: {keyboard: keyboard.home}
            })
            break
    }
})


//Создание клавиатуры
bot.onText(/\/start/, msg => {
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы`;
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup: {
            keyboard: keyboard.home
        }
    })
})

function sendFilmsByQuery(chatId, query) {
    Film.find(query).then(films => {
        console.log(films)
    })
}