import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";

// PROBLEM: 
// 1. Langchain does not work w/ Edge 
// 2. But, function hangs if I specify nodejs " API resolved without sending a response for /api/vectordbqa, this may result in stalled requests. "
export const config = {
 runtime: "edge"
 // runtime: "nodejs"
 };

 const handler = async (req: Request): Promise<Response> => {
   
  try {
   
      /*
      // This all works 
      const prompt = req.body.prompt;
      const apiKey = req.body.apiKey;
  
      console.log("--- /// PROMPT /// ---");
      console.log(prompt);
      console.log("--- /// ---");

      const pinecone = new PineconeClient();
      await pinecone.init({
        environment: "us-east1-gcp",
        apiKey: "xxx",
      });

      const index = pinecone.Index("sf-building-codes");
      const vectorStore = await PineconeStore.fromExistingIndex(
        index,
        new OpenAIEmbeddings()
      );

      const model = new OpenAI();
      const chain = VectorDBQAChain.fromLLM(model, vectorStore);
      const response = await chain.call({query: prompt,});
      const responseBody = response.text;

      console.log("--- /// RESPONSE /// ---");
      console.log(responseBody);
      console.log("--- /// ---");
      // return new Response(responseBody, { status: 200 });
      */
    
      const mockResponse = () => Promise.resolve(new Response("This is a dummy response!", {status: 200}));
      console.log("--- /// ---");
      console.log("Returning Dummy Data!");
      console.log("--- /// ---");
      return new Response("This is a dummy response!", mockResponse);
      
    } catch (error) {
      console.error(error);
      console.log("--- /// ERROR RESPONSE /// ---");
      console.log("--- /// ---");
      const responseBody = "Error occurred: " + error.message;
      return new Response(responseBody, { status: 500 });
    }
};

export default handler;
