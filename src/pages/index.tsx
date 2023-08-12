import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const handleInput = async (e:any) => {
    const fieldValue = e.target.value;

    await setQuery(fieldValue);
  }
  const submitHandler = async (e: any) => {
    e.preventDefault()
    //await setQuery(e.queryInp.value);
    const response = await fetch("/api/backend", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ query: query }), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    await setResults(data.results);
    console.log(results)
    //console.log(data)
  }
  return (
    <div className="flex mx-auto w-full flex-col items-center justify-center py-2 min-h-screen">
      <h1 className="text-3xl border-l-gray-950 mb-3">Search through *some* of Elon's tweets</h1>
      <form onSubmit={submitHandler}>
        <textarea id="queryInp"
          name="queryInp"
          placeholder='Type your query here'
          value={query}
          onChange={handleInput}
          className="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96 h-11">

        </textarea>
        <br/>
        <button
        type='submit'
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-lg ml-40">Search</button>
      </form>
      <ul className='list-disc ml-10'>
        {
          results.map((result)=>{ 
            return <li value={result}>{result}</li>
          })
        }
      </ul>
    </div>
  )
}
