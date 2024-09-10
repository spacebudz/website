"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/mod.tsx"; // adjust path as needed
import { Button } from "@/components/ui/button/mod.tsx";
import { useSignal } from "@preact/signals";

const GifCard = () => {
  const gifUrl = useSignal<string | undefined>();
  const isLoading = useSignal<boolean>(false);
  const API_KEY = "tg8QBMYgXp5EkUtc3ayL1HmOyt1OjrQ8"; // Replace with your Giphy API key

  const fetchGif = async () => {
    isLoading.value = true; // Set loading to true when fetching starts
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=&rating=g`,
      );
      const data = await response.json();
      gifUrl.value = data.data.images.original.url; // Update the GIF URL
    } catch (error) {
      console.error("Error fetching GIF:", error);
    } finally {
      isLoading.value = false; // Set loading to false after fetching completes
    }
  };

  React.useEffect(() => {
    fetchGif(); // Fetch the initial GIF when the component mounts
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Random GIF</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {isLoading.value
          ? ( // Show loading message or spinner while fetching
            <p>Loading...</p>
          )
          : gifUrl.value
          ? ( // Show the GIF when loaded
            <img
              src={gifUrl.value}
              alt="Random GIF"
              className="rounded-md w-full h-64 object-cover"
            />
          )
          : <p>No GIF available</p>}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={fetchGif}
          className={`bg-blue-500 hover:bg-blue-600 ${
            isLoading.value ? "cursor-not-allowed" : ""
          }`} // Disable the button during loading
          disabled={isLoading.value}
        >
          {isLoading.value ? "Loading..." : "Click Me"}{" "}
          {/* Change button text during loading */}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GifCard;
