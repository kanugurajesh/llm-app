"use client";

import { useState, useEffect } from "react";
import Markdown from 'react-markdown'
import { Input } from "@/components/ui/input"
import { MessageCircleCode, Upload,  } from "lucide-react";
import { Send, Copy, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import toast, { Toaster } from "react-hot-toast";
import styles from '../styles/styles.module.css'

export default function Home() {
  
  // state for the prompt, response and output
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [output, setOutput] = useState("The response will appear here...");

  const onKeyDown = (e:any) => {
    // Check if the Ctrl key is pressed along with the Enter key
    if (e.key === "Enter") {
      // Prevent the default behavior of the Enter key (e.g., new line in textarea)
      e.preventDefault();
      // Trigger the onSubmit function
      onSubmit();
    }
  };

  const onSubmit = async () => {

    if (prompt === "") {
      toast.error("Prompt cannot be empty!");
      return;
    }

    // clear the output
    setOutput("The response will appear here...");

    // create a post request to the /api/chat endpoint
    const response = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: prompt,
      }),
    });

    // get the response from the server
    const data = await response.json();
    // set the response in the state
    setResponse(data.text);

  };

  useEffect(() => {
    // update the response character by character in the output
    if (response.length === 0) return;

    setOutput("");
    
    for (let i = 0; i < response.length; i++) {
      setTimeout(() => {
        setOutput((prev) => prev + response[i]);
      }, i * 10);
    }
    
  }, [response]);

  return (
    <main className={`flex flex-col items-center h-screen gap-4`}>
      <Toaster />
      <div className="flex gap-2 items-center mb-5">
        <MessageCircleCode size="64" />
        <span className="text-3xl font-bold">Chaty</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Input
            type="text"
            placeholder="prompt"
            className={cn("min-w-[320px] sm:min-w-[400px] md:min-w-[500px] h-[50px] pr-12")}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => onKeyDown(e)}
          />
          <button onClick={() => onSubmit()} className="absolute top-3 right-3 hover:scale-110 transition ease-in-out">
            <Send />
          </button>
        </div>
        <Button variant="outline" className={cn("w-[40px] p-1")}>
          <Upload className={cn("w-[20px]")}/>
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <Card className={cn("p-5 whitespace-normal min-w-[320px] sm:w-[500px] md:min-w-[600px] max-h-[400px] lg:min-w-[700px] overflow-y-scroll")}>
          <div className={`${styles.textwrapper}`}>
            <Markdown className={cn("w-full h-full ")}>{`${output}`}</Markdown>
          </div>
        </Card>
        <div className="flex flex-col gap-5">
          <Button variant="outline" className={cn("w-[40px] p-1")}>
            <Copy className={cn("w-[20px]")} />
          </Button>
          <Button variant="outline" className={cn("w-[40px] p-1")}>
            <Download className={cn("w-[20px]")} />
          </Button>
        </div>
      </div>
    </main>
  );
      
}
