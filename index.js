require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { OpenAI } = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_TOKEN })
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

const messageHistory = []

bot.on('message', async msg => {
	const chatId = msg.chat.id
	const text = msg.text
	if (chatId === 846119799) {
		if (!messageHistory[chatId]) {
			messageHistory[chatId] = []
		}
		messageHistory[chatId].push({ role: 'user', content: text })
		const response = await openai.chat.completions.create({
			messages: messageHistory[chatId],
			model: 'gpt-3.5-turbo',
			max_tokens: 250,
		})
		messageHistory[chatId].push({
			role: 'system',
			content: response.choices[0].message.content,
		})
		console.log(messageHistory[chatId])
		await bot.sendMessage(chatId, response.choices[0].message.content)
	} else {
		bot.sendMessage(
			chatId,
			'You do not have access to this bot.\nPlease contact the developer (@Serhii_004) for details.'
		)
	}
})
