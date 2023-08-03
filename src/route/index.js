// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  // Статичне приватне поле для зберігання списку обєктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //Генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  //Статичний метод длястворення обєкту Track і додавання його до списку #list

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  //Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse() // reverse - вивести в зворотньому порядку
  }
}

Track.create(
  'Інь Янь',
  'Монатик і Роксолана',
  'https://picsum.photos/100/100',
)
Track.create(
  'Балия Комиго',
  'Селена Гомес и Рой Алехандро',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'Dakitty',
  'Bad banny i Jhay',
  'https://picsum.photos/100/100',
)
Track.create(
  '11pm',
  'Мaluma',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

// console.log(Track.getList())

//=======================

class Playlist {
  // Статичне приватне поле для зберігання списку обєктів Track
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) //Генеруємо випадкове id
    this.name = name

    this.tracks = [] // список треків які додані до плейлиста
    this.image = 'https://picsum.photos/100/100'
  }

  //Статичний метод длястворення обєкту Playlist і додавання його до списку #list

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  //Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse() // reverse - вивести в зворотньому порядку
  }

  // Метод для миксування в плейлист 3 рандомні трека
  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playList) => playList.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(trackId) {
    const trackAdd = Track.getList().find(
      (track) => track.id === trackId,
    )
    this.tracks.push(trackAdd)
  }

  static findListByValue(name) {
    return this.#list.filter((playList) =>
      playList.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))

Playlist.makeMix(Playlist.create('Test3'))
Playlist.makeMix(Playlist.create('Test4'))

// console.log(Playlist.getList())
// ================================================================

router.get('/', function (req, res) {
  //
  const list = Playlist.getList()
  console.log(list)

  res.render('spotify-index', {
    style: 'spotify-index',

    data: {
      lib: list,
    },
  })
})
//=================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix //Якщо у мене є isMix то буде приходити  true

  // console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

// ================================================================

router.post('/spotify-create', function (req, res) {
  // console.log(req.body, req.query)
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playList = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playList)
  }
  // console.log('spotify-create ----->', playList)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})
// ================================================================

router.get('/spotify-playlist', function (req, res) {
  // console.log('===spotify-playlist-----', req.query)

  const id = Number(req.query.id)

  const playList = Playlist.getById(id)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playListId = Number(req.query.playListId)

  const trackId = Number(req.query.trackId)

  const playList = Playlist.getById(playListId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playListId}`,
      },
    })
  }

  playList.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name, // для add не потрібно
      trackId: playList.trackId,
    },
  })
})

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playListId = Number(req.query.id)

  const playList = Playlist.getById(playListId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playListId}`,
      },
    })
  }

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playListId: playList.id,
      tracks: Track.getList(), //- це для spotify-playlist-add,
      name: playList.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playListId = Number(req.query.playListId)

  const trackId = Number(req.query.trackId)

  const playList = Playlist.getById(playListId)

  playList.addTrack(trackId)

  if (!playList) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playListId}`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playListId: playList.id,
      tracks: playList.tracks,
      name: playList.name,
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  // console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
