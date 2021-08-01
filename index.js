require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const regexp = require('regexp');
const reg = regexp('[a-z]+')
const User = require('./models');

mongoose.connect('mongodb+srv://andrew:sosok228@cluster0.rxwip.mongodb.net/test')
.then(() => {
    console.log('Успешно подключено');
})
.catch((err) => {
    console.log(err);
})

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.command('start', ctx => {
    const id = ctx.message.from.id;
    const name = ctx.message.from.first_name;
    User.init().then(() => {
        User.create({ id, name })
    })
    bot.telegram.sendMessage(ctx.chat.id, `Привет, ${ctx.message.from.first_name}. что тебя интересует ?`,
    {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Узнать про что-то', callback_data: 'test' }
                ],
                [
                    { text: 'Обратная связь', url: 'https://vk.com/semen0510' }
                ],
                [
                    { text: 'Наш сайт', url: 'https://vk.com/semen0510' }
                ],
                [
                    { text: 'Информация', callback_data: 'info' }
                ]
            ]
        }
    })
})

bot.action('test', ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, 'Тут будет какая-то информация о чем-то конкретном')
})


bot.action('info', ctx => {
    ctx.answerCbQuery();
    bot.telegram.sendMessage(ctx.chat.id, 'Информация', {
        reply_markup: {
            keyboard: [
                [
                    { text: 'Как заказать что-либо' }
                ],
                [
                    { text: 'Как оплатить что-либо' },
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    })
})


bot.hears('Как заказать что-либо', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Выбери то, что вас интересует', {
        reply_markup: {
            keyboard: [
                [
                    { text: 'Вариант 1' },
                    { text: 'Вариант 2' },
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    })
})

bot.hears('Вариант 1', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Ответ на вопрос 1');
})

bot.hears('Вариант 2', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Ответ на вопрос 2');
})



bot.hears('Как оплатить что-либо', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Выбери то, что вас интересует', {
        reply_markup: {
            keyboard: [
                [
                    { text: 'Вариант 1.1' },
                    { text: 'Вариант 2.2' },
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    })
})

bot.hears('Вариант 1.1', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Ответ на вопрос 1.1');
})

bot.hears('Вариант 2.2', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Ответ на вопрос 2.2');
})

bot.on('message', ctx => {
    if (ctx.message.from.id === 424446979) {
        User.find()
        .then((users) => {
            users.forEach((user) => {
                bot.telegram.sendMessage(user.id, ctx.message.text);
            })
        })
        .catch((err) => console.log(err));
    }
})



bot.launch();
console.log('Бот запущен');