import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  
  // Check if the quoted message is a video or audio
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (!/video|audio/.test(mime)) {
    throw `✳️ Reply to the video or voice note you want to convert to mp3 with the command:\n\n*${usedPrefix + command}*`
  }

  // Download the media (either from the quoted message or current message)
  let media = await q.download?.()
  if (!media) throw '❎ Failed to download media'

  // Convert the media to audio (MP3)
  let audio = await toAudio(media, 'mp4')
  if (!audio.data) throw '❎ Error converting'

  // Send the converted audio back to the chat
  conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp3' })
}

handler.help = ['tomp3']
handler.tags = ['fun']
handler.command = /^to(mp3|a(udio)?)$/i

export default handler
