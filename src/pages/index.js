import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { prisma } from '../../server/db/client'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ animals }) {
  const [animal, setAnimal] = useState('')
  const [loading, setLoading] = useState(false)
  const route = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (animal === '') return

    setLoading(true)
    // save to db
    await axios.post('/api/animals', { animal })
    setAnimal('')
    setLoading(false)
    // refresh page
    route.reload()
  }

  return (
    <>
      <Head>
        <title>Animals.io</title>
        <meta
          name='description'
          content='an web application to test next.js with prisma using postgres'
        />
      </Head>
      <main
        className={`min-h-screen p-24 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${inter.className}`}
      >
        <h1 className='font-bold text-4xl'>Animals.io 🐮🐶🐔</h1>
        <h2 className='text-white/[0.7] mt-2'>
          Just for me to test this thing
        </h2>

        <section className='mt-16 flex flex-col items-center'>
          <h3 className='font-bold text-2xl'>List of your current animals</h3>
          {/* list of animals */}
          <ul className='mt-4 list-decimal'>
            {animals?.length === 0 && (
              <p className='italic text-white/[0.4]'>No animals yet.</p>
            )}
            {animals?.map((animal) => (
              <li key={animal.id}>{animal.name}</li>
            ))}
          </ul>
        </section>

        <section className='mt-16'>
          <h3 className='font-bold text-2xl'>Create a new animal</h3>
          <form
            className='mt-4 flex flex-col items-center'
            onSubmit={handleSubmit}
          >
            <input
              type='text'
              placeholder='Name of the animal'
              className='p-2 rounded-md border-slate-200 placeholder-slate-400 text-pink-500 text-center font-semibold text-sm'
              onChange={(e) => setAnimal(e.target.value)}
              value={animal}
            />
            <button
              type='submit'
              className='font-bold text-[12px] bg-pink-600 py-2 px-4 rounded-lg mt-2 shadow-md border border-1 border-white/[0.2]'
              disabled={loading}
            >
              {!loading ? 'Create animal' : 'Creating...'}
            </button>
          </form>
        </section>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const animals = await prisma.animal.findMany()

  return {
    props: { animals: JSON.parse(JSON.stringify(animals)) },
  }
}
