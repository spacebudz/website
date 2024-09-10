import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/mod.tsx"; // adjust path as needed
import { Button } from "@/components/ui/button/mod.tsx";

const GifCard = () => {
  const [gifUrl, setGifUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const API_KEY = "tg8QBMYgXp5EkUtc3ayL1HmOyt1OjrQ8"; // Replace with your Giphy API key

  const fetchGif = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=&rating=g`,
      );
      const data = await response.json();
      setGifUrl(data.data.images.original.url); // Update the GIF URL
    } catch (error) {
      console.error("Error fetching GIF:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching completes
    }
  };

  useEffect(() => {
    fetchGif(); // Fetch the initial GIF when the component mounts
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Random GIF</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {isLoading
          ? ( // Show loading message or spinner while fetching
            <p>Loading...</p>
          )
          : gifUrl
          ? ( // Show the GIF when loaded
            <img
              src={gifUrl}
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
            isLoading ? "cursor-not-allowed" : ""
          }`} // Disable the button during loading
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Click Me"}{" "}
          {/* Change button text during loading */}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GifCard;
