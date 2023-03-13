import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {};
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    
      const prompt = req.body.prompt;
      const apiKey = req.body.apiKey;
  
      // Vector DB
      const pinecone = new PineconeClient();
      await pinecone.init({
        environment: "us-east1-gcp",
        apiKey: "xxx",
      });
      const index = pinecone.Index("lex-test");
      const vectorStore = await PineconeStore.fromExistingIndex(
        index,
        new OpenAIEmbeddings()
      );

      // Call LLM 
      const model = new OpenAI();
      const chain = VectorDBQAChain.fromLLM(model, vectorStore);
      chain.returnSourceDocuments=true;
      const responseBody = await chain.call({query: prompt,});

      // Clean up 
      let answerText = responseBody["text"]; 
      answerText = answerText.replace(/["'\n\r]/g, ''); 
      const headers = {"sourceDocuments": JSON.stringify(responseBody["sourceDocuments"])};
      Object.keys(headers).forEach(key => { res.setHeader(key, headers[key]); });
      res.status(200).send(answerText); 
      
  } catch (error) {
    console.error(error);
    console.log("--- /// ERROR RESPONSE /// ---");
    console.log("--- /// ---");
    const responseBody = "Error occurred: " + error.message;
    // return new Response(responseBody, { status: 500 });
    res.status(500).json("Error");
  }
};

export default handler;