// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextRequest } from 'next/server'
import { PineconeClient } from "@pinecone-database/pinecone";     
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

type Data = {
  results: Array<string>
}

export const config = {
  runtime: 'edge',
}

export default async function handler(
  req: NextRequest,
) {
  const pinecone = new PineconeClient();      
  await pinecone.init({      
	  environment: "asia-southeast1-gcp",      
	  apiKey: process.env.PINECONE_KEY ?? "",      
  });
  const index = pinecone.Index("elon-tweets");
  const { query } = await req.json();
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query
  });
  const query_vector = (await response.json()) as ResponseTypes["createEmbedding"]
  //console.log(query_vector.data[0]["embedding"])
  const queryResponse = await index.query({
    queryRequest: {
      topK: 5,
      includeValues: true,
      includeMetadata: true,
      vector: query_vector.data[0]["embedding"],
    },
  });
  let tweets: Array<string> = []
  queryResponse?.matches?.slice(0, 10).forEach((result: any) => {
    const { text } = result.metadata;
    tweets.push(text);  
  });
  return new Response(JSON.stringify({ results: tweets }))
}
