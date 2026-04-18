import { PrismaClient } from '@prisma/client'
import sqlite3 from 'sqlite3'

const prisma = new PrismaClient()
const db = new sqlite3.Database('./prisma/dev.db')

async function transfer() {
  console.log('Перенос...')

  // чтение sqlite
  const getAll = (query: string) => {
    return new Promise<any[]>((res, rej) => {
      db.all(query, (err, rows) => err ? rej(err) : res(rows))
    })
  }

  try {
    // учителя
    const oldTeachers = await getAll('SELECT * FROM Teacher')
    console.log(`> Тянем учителей: ${oldTeachers.length}`)
    for (const t of oldTeachers) {
      await prisma.teacher.create({ data: t })
    }

    // новости
    const oldNews = await getAll('SELECT * FROM News')
    console.log(`> Тянем новости: ${oldNews.length}`)
    for (const n of oldNews) {
      await prisma.news.create({ data: n })
    }

    // активности
    const oldActs = await getAll('SELECT * FROM Activities')
    console.log(`> Тянем активности: ${oldActs.length}`)
    for (const a of oldActs) {
      await prisma.activities.create({ data: a })
    }

    console.log('✅ База заполнена')
  } catch (err) {
    console.error('❌ Что-то пошло не так:', err)
  } finally {
    db.close()
    await prisma.$disconnect()
  }
}

transfer()